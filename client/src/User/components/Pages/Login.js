import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import "../../styles/pages/login.css";
import Modal from "react-modal";
import { BsPatchCheckFill } from "react-icons/bs";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import { useCookies } from "react-cookie";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false); // For modal
  const [email, setEmail] = useState(""); // Store the user's email
  const [resendMessage, setResendMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(
    new Array(6).fill("")
  );
  const [authMessage, setAuthMessage] = useState("");
  const [loginToken, setLoginToken] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [userTrustedDevice, setUserTrustedDevice] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  const inputRefs = useRef([]); // Array to store input references

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const newCode = [...verificationCode];

    // Allow only valid hexadecimal characters (0-9, A-F)
    if (/^[0-9A-Fa-f]$/.test(value)) {
      newCode[index] = value.toUpperCase(); // Store uppercase for consistency
      setVerificationCode(newCode);

      // Move to the next input if not the last input
      if (index < inputRefs.current.length - 1 && value) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    const newCode = [...verificationCode];

    if (e.key === "Backspace") {
      if (newCode[index]) {
        // Clear the current input
        newCode[index] = "";
        setVerificationCode(newCode);
      } else if (index > 0) {
        // Move to the previous input and clear that input
        inputRefs.current[index - 1].focus();
        newCode[index - 1] = "";
        setVerificationCode(newCode);
      }
    }
  };

  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRedirectToApp = async () => {
    const role = cookies.role;
    setTimeout(() => {
      setCookie("token", loginToken);
      navigate(
        role === "Patient"
          ? "/app"
          : role === "Assistant"
          ? "/assistant-landing"
          : role === "Obgyne"
          ? "/consultant-landing"
          : role === "Ob-gyne Specialist" && "/belly-talk"
      );
    }, 3000);
  };

  const handleCodeSubmission = () => {
    setAuthMessage("");
    let userID = getCookie("userID");

    if (verificationCode.length !== 6) {
      setAuthMessage("Verification code must be 6 digits long.");
      return;
    }

    const expiryTimestamp = parseInt(getCookie("expiryTimestamp"), 10);

    if (!expiryTimestamp) {
      setAuthMessage("Verification code has expired. Please Login again.");
      return;
    }

    const joinedCode = verificationCode.join("");

    if (verifyToken === joinedCode.toUpperCase()) {
      setAuthMessage("Verification Successful!");

      if (rememberDevice) {
        const userTrustedDeviceArray = [...userTrustedDevice, userID];
        setCookie("userTrustedDevice", JSON.stringify(userTrustedDeviceArray), {
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        });
      }
      handleRedirectToApp();
    } else {
      setAuthMessage("Invalid verification code. Please try again.");
    }

    setTimeout(() => {
      setAuthMessage("");
    }, 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccessMessage("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");

      setLoading(false);
      return;
    }

    try {
      // Perform login
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      if (response.data.user.role === "Patient") {
        setLoading(false);
        return alert(
          "Access to the patient portal is available through our app. Please download the app to log in and access your records."
        );
      }

      const userDetails = {
        name: response.data.user.fullName,
        role: response.data.user.role,
        username: response.data.user.username,
        profilePicture: response.data.user.profilePicture,
      };

      localStorage.setItem("userData", JSON.stringify(userDetails));
      const userEmail = response.data.user.email;
      document.cookie = `userID=${response.data.user._id}`;
      document.cookie = `role=${response.data.user.role}`;
      setLoginToken(response.data.token);

      if (userTrustedDevice.includes(response.data.user._id)) {
        await handleRedirectToApp();
        setTimeout(() => {
          setCookie("token", response.data.token);
          navigate(
            response.data.user.role === "Patient"
              ? "/app"
              : response.data.user.role === "Assistant"
              ? "/assistant-landing"
              : response.data.user.role === "Obgyne" && "/consultant-landing"
          );
        }, 3000);
        return;
      }

      // After successful login, show the verification modal
      setEmail(userEmail);
      setLoading(false);
      setSuccessMessage("Login successful! Please verify your account.");
      await handleResendEmail();
      setShowVerificationModal(true);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else if (err.response && err.response.status === 404) {
        setError("Username or Password not found. Please register first.");
      } else {
        setError("Failed to login. Please try again.");
      }
      // Log the error
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      setLoading(false); // Stop loading
    }
  };

  const handleResendEmail = async () => {
    try {
      let userID = getCookie("userID");
      const response = await axios.put(`${API_URL}/verify?userId=${userID}`);

      // Set expiry timestamp to 5 minutes from now
      const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
      setCookie("expiryTimestamp", expiryTime, { path: "/", maxAge: 5 * 60 }); // Setting cookie with maxAge

      resendMessage
        ? setSuccessMessage("Verification code resent successfully!")
        : setSuccessMessage("Verification code sent successfully!");
      setVerifyToken(response.data.verificationToken);
      setResendMessage(true);
    } catch (error) {
      console.error("Resend email error:", error);
      setError("Failed to resend verification code.");
    }
  };

  const censorEmail = (email) => {
    const [name, domain] = email.split("@");
    const visibleNamePart = name.slice(0, 3);
    const censoredNamePart = "*".repeat(Math.max(name.length - 3, 0));
    const visibleDomainPart = domain.slice(0, 1);
    const censoredDomainPart = "*".repeat(Math.max(domain.length - 1, 0));
    return `${visibleNamePart}${censoredNamePart}@${visibleDomainPart}${censoredDomainPart}`;
  };

  useEffect(() => {
    const storedTrustedUserDevice = cookies.userTrustedDevice;
    const storedArray = storedTrustedUserDevice ? storedTrustedUserDevice : [];
    setUserTrustedDevice(storedArray);
  }, []);

  return (
    <div className="p-8 md:p-16 lg:p-24 xl:p-48 2xl:p-52 relative z-0 min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-screen bg-cover bg-center opacity-90 -z-10"
        style={{ backgroundImage: `url(/img/login.jpg)` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 w-full h-screen bg-purple-600 bg-opacity-75 -z-10"></div>

      {/* Back Button */}
      <a
        href="#"
        className="fixed top-4 left-6 md:top-5 md:left-10 text-white text-4xl md:text-5xl no-underline z-10 hover:text-pink-200 transition-colors"
      >
        ←
      </a>

      {/* Welcome Message */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-6 md:mb-8 lg:mb-12 -mt-12 md:-mt-16 lg:-mt-20 ml-4 md:ml-8 lg:ml-24 xl:ml-28 leading-tight md:leading-snug lg:leading-normal">
        Welcome Back!
      </h1>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="text-pink-300 ml-4 md:ml-8 lg:ml-24 xl:ml-28 mb-6 md:mb-8 lg:mb-10 -mt-6 md:-mt-8 lg:-mt-10">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="text-pink-300 ml-4 md:ml-8 lg:ml-24 xl:ml-28 mb-6 md:mb-8 lg:mb-10 -mt-6 md:-mt-8 lg:-mt-10">
          {error}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white bg-opacity-40 h-80 md:h-96 lg:h-[400px] w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-4 md:mx-8 lg:ml-24 xl:ml-28 flex justify-center items-center rounded-2xl shadow-lg shadow-purple-900/50 backdrop-blur-sm">
        <form onSubmit={handleLogin} className="w-full px-4 md:px-6">
          {/* Email Input */}
          <div className="relative mb-6 md:mb-8 ml-2 md:ml-3 mt-4 md:mt-5">
            <input
              type="email"
              id="username"
              value={username}
              onChange={handleChange}
              placeholder=" "
              className="p-2 md:p-3 border-0 text-base mt-1 md:mt-2 bg-white text-slate-800 w-full transition-all duration-300 ease-in-out rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 font-sans placeholder-transparent peer"
            />
            <label className="absolute top-4 md:top-5 left-2 md:left-3 text-slate-800 text-base transition-all duration-300 ease-in-out pointer-events-none font-sans peer-focus:-top-4 peer-focus:md:-top-5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:md:-top-5 peer-[:not(:placeholder-shown)]:text-xs">
              Email
            </label>
          </div>

          {/* Password Input */}
          <div className="relative mb-6 md:mb-8 ml-2 md:ml-3 mt-4 md:mt-5">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handleChange}
              placeholder=" "
              className="p-2 md:p-3 border-0 text-base mt-1 md:mt-2 bg-white text-slate-800 w-full transition-all duration-300 ease-in-out rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 font-sans placeholder-transparent peer"
            />
            <label className="absolute top-4 md:top-5 left-2 md:left-3 text-slate-800 text-base transition-all duration-300 ease-in-out pointer-events-none font-sans peer-focus:-top-4 peer-focus:md:-top-5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:md:-top-5 peer-[:not(:placeholder-shown)]:text-xs">
              Password
            </label>
            <div
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-4 md:right-5 -translate-y-1/2 cursor-pointer z-10 text-slate-600 hover:text-slate-800 transition-colors"
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </div>
          </div>

          {/* Forgot Password Link */}
          <a
            href="/forgot-password"
            className="ml-48 md:ml-56 lg:ml-72 xl:ml-80 -mt-2 md:-mt-3 mb-2 md:mb-3 text-pink-300 hover:text-pink-200 transition-colors block text-sm"
          >
            Forgot Password?
          </a>

          {/* Login Button */}
          <button
            type="submit"
            className="px-8 md:px-12 lg:px-16 py-2 md:py-3 w-full max-w-xs md:max-w-sm bg-pink-300 text-slate-900 border-0 rounded-md cursor-pointer font-sans ml-1 md:ml-2 flex justify-center items-center text-base md:text-lg font-medium hover:bg-purple-600 hover:text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>

      {/* Sign Up Text */}
      <div className="text-base md:text-lg lg:text-xl text-slate-800 text-center -mt-4 md:-mt-5 -ml-4 md:-ml-8 lg:-ml-96 xl:-ml-[930px] mb-8 md:mb-12">
        Don't have an account?
        <a
          href="/signup"
          className="text-white no-underline ml-2 md:ml-3 hover:underline hover:text-pink-300 transition-colors"
        >
          Sign Up
        </a>
      </div>

      {/* Authentication Modal */}
      {showVerificationModal && (
        <Modal
          isOpen={showVerificationModal}
          onRequestClose={() => setShowVerificationModal(false)}
          className="Authentication__Content"
          overlayClassName="Authentication__Overlay"
        >
          <div className="Authentication__Icon">
            <BsPatchCheckFill />
          </div>
          <h2 className="Authentication__Title">Authenticate Your Account</h2>
          <p className="Authentication__Subtitle">
            {authMessage ? (
              authMessage
            ) : (
              <>
                Please type the verification code sent to{" "}
                <strong>{email && censorEmail(email)}</strong>.
              </>
            )}
          </p>

          <div className="Authentication__CodeWrapper">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                className="Authentication__CodeInput"
                maxLength={1}
                value={verificationCode[index] || ""}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(input) => (inputRefs.current[index] = input)}
              />
            ))}
          </div>

          <div className="Authentication__RememberDevice">
            <input
              type="checkbox"
              id="rememberDevice"
              className="Authentication__Checkbox"
              onChange={(e) => setRememberDevice(e.target.checked)}
            />
            <label
              htmlFor="rememberDevice"
              className="Authentication__CheckboxLabel"
            >
              Remember this Device
            </label>
          </div>

          <button
            className="Authentication__Button Authentication__SubmitButton"
            onClick={handleCodeSubmission}
          >
            Submit
          </button>
        </Modal>
      )}

      {/* Mobile Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .container-login {
            margin-left: 1rem;
            margin-right: 1rem;
          }

          .login-welcome-message {
            margin-left: 1rem;
          }

          .login-sign-up-text {
            margin-left: -1rem;
          }

          .forgot-password {
            margin-left: 12rem;
          }
        }

        @media (max-width: 480px) {
          .login-welcome-message {
            font-size: 2.5rem;
            line-height: 1.1;
          }

          .container-login {
            height: 320px;
            width: calc(100vw - 2rem);
          }

          .forgot-password {
            margin-left: 8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
