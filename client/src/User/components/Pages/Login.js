import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { BsPatchCheckFill } from "react-icons/bs";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import { useCookies } from "react-cookie";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [email, setEmail] = useState("");
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

  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const newCode = [...verificationCode];
    if (/^[0-9A-Fa-f]$/.test(value)) {
      newCode[index] = value.toUpperCase();
      setVerificationCode(newCode);
      if (index < inputRefs.current.length - 1 && value) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    const newCode = [...verificationCode];
    if (e.key === "Backspace") {
      if (newCode[index]) {
        newCode[index] = "";
        setVerificationCode(newCode);
      } else if (index > 0) {
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
    removeCookie("token", { path: "/" });
    removeCookie("role", { path: "/" });
    removeCookie("userID", { path: "/" });
    removeCookie("verifyToken", { path: "/" });
    setError("");
    setLoading(true);
    setSuccessMessage("");
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    try {
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
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      let userID = getCookie("userID");
      const response = await axios.put(`${API_URL}/verify?userId=${userID}`);
      const expiryTime = Date.now() + 5 * 60 * 1000;
      setCookie("expiryTimestamp", expiryTime, { path: "/", maxAge: 5 * 60 });
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
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-[#7c459c] overflow-hidden">
      {/* Background image and overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90 z-0"
        style={{ backgroundImage: `url(/img/login.jpg)` }}
      ></div>
      <div className="absolute inset-0 bg-[#7c459cbc] z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col  w-full px-2 sm:px-0 lg:left-40">
        <h2 className="font-bold text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 sm:mb-4 mt-8 sm:mt-0 leading-tight drop-shadow-lg sm:text-left">
          Login!
        </h2>
        <p className="text-[#042440] text-sm xs:text-base sm:text-lg mb-2 sm:mb-4  sm:text-left">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-2 text-white hover:text-[#e39fa9] underline"
          >
            Sign Up here!
          </Link>
        </p>
        {error && (
          <p className="text-[#e39fa9] mb-2 sm:mb-4 font-semibold">{error}</p>
        )}
        {successMessage && (
          <p className="text-[#e39fa9] mb-2 sm:mb-4 font-semibold">
            {successMessage}
          </p>
        )}

        <div className="w-full max-w-[500px] bg-white/60 rounded-2xl shadow-lg p-3 xs:p-4 sm:p-8 flex flex-col items-center">
          <form onSubmit={handleLogin} className="w-full">
            <div className="relative mb-4 sm:mb-6">
              <label htmlFor="username" className="">
                Email:
              </label>
              <input
                className="block w-full px-3 py-2 sm:px-4 sm:py-3 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9] peer"
                type="text"
                id="username"
                placeholder=" "
                value={username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative mb-4 sm:mb-6">
              <label htmlFor="password" className="">
                Password:
              </label>
              <input
                className="block w-full px-3 py-2 sm:px-4 sm:py-3 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9] pr-10 peer"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                value={password}
                onChange={handleChange}
                required
              />

              <span
                className="absolute right-3 sm:right-4 top-2/3 transform -translate-y-1/2 text-xl sm:text-2xl text-[#7c459c] cursor-pointer"
                onClick={togglePasswordVisibility}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>

            <div className="flex justify-end mb-3 sm:mb-4">
              <Link
                to="/forgot-password"
                className="text-[#e39fa9] text-xs sm:text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 sm:py-3 bg-[#e39fa9] text-[#040400] rounded-md font-semibold text-base sm:text-lg hover:bg-[#7c459cbc] hover:text-white transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          {/* Verification Modal */}
          <Modal
            isOpen={showVerificationModal}
            onRequestClose={() => setShowVerificationModal(false)}
            className="bg-white rounded-2xl p-3 xs:p-4 sm:p-8 max-w-xs sm:max-w-md w-[95vw] sm:w-full mx-auto shadow-lg flex flex-col items-center outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <div className="text-[#9a6cb4] text-4xl sm:text-6xl mb-2 sm:mb-4">
              <BsPatchCheckFill />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#333] mb-1 sm:mb-2 text-center">
              Authenticate Your Account
            </h2>
            <p className="text-xs sm:text-base text-[#666] mb-3 sm:mb-6 text-center">
              {authMessage ? (
                authMessage
              ) : (
                <>
                  Please type the verification code sent to{" "}
                  <strong>{email && censorEmail(email)}</strong>.
                </>
              )}
            </p>
            <div className="flex justify-between gap-1 sm:gap-2 mb-3 sm:mb-6">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-8 h-12 sm:w-10 sm:h-14 text-xl sm:text-2xl border-2 border-gray-200 rounded-lg text-center focus:outline-none focus:border-[#f5b63a] shadow"
                  maxLength={1}
                  value={verificationCode[index] || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(input) => (inputRefs.current[index] = input)}
                />
              ))}
            </div>
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="rememberDevice"
                className="mr-2"
                onChange={(e) => setRememberDevice(e.target.checked)}
              />
              <label
                htmlFor="rememberDevice"
                className="text-xs sm:text-sm text-[#333]"
              >
                Remember this Device
              </label>
            </div>
            <button
              className="bg-[#9a6cb4] text-white px-6 sm:px-8 py-2 rounded-full font-bold text-base sm:text-lg hover:bg-[#e39fa9] transition"
              onClick={handleCodeSubmission}
            >
              Submit
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
}
