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
    <div className="relative min-h-screen flex flex-col items-center justify-center py-10 px-2 bg-[#7c459c]">
      {/* Background image and overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90 z-0"
        style={{ backgroundImage: `url(/img/login.jpg)` }}
      ></div>
      <div className="absolute inset-0 w-full h-full bg-[#7c459cbc] z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <h2 className="text-white text-5xl md:text-7xl font-bold mb-4 mt-4 md:mt-0 leading-tight text-center drop-shadow-lg">
          Login!
        </h2>
        <p className="text-[#042440] text-base md:text-lg text-center mb-2">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-2 text-white hover:text-[#e39fa9] underline"
          >
            Sign Up here!
          </Link>
        </p>
        {error && (
          <p className="text-[#e39fa9] text-center mb-2 font-semibold">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-[#e39fa9] text-center mb-2 font-semibold">
            {successMessage}
          </p>
        )}

        <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-center mt-2">
          <form onSubmit={handleLogin} className="w-full">
            {/* Username */}
            <div className="relative mb-6">
              <input
                className="peer block w-full px-4 py-4 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9] placeholder-transparent"
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
              <label
                htmlFor="username"
                className="absolute left-4 top-4 text-[#042440] text-base transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#042440] peer-focus:bg-white peer-focus:px-1 bg-white px-1"
              >
                Username:
              </label>
            </div>
            {/* Password */}
            <div className="relative mb-6">
              <input
                className="peer block w-full px-4 py-4 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9] placeholder-transparent"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-4 text-[#042440] text-base transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#042440] peer-focus:bg-white peer-focus:px-1 bg-white px-1"
              >
                Password:
              </label>
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-[#7c459c] cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </span>
            </div>
            {/* Forgot Password */}
            <div className="flex justify-end mb-4">
              <Link
                to="/forgot-password"
                className="text-[#e39fa9] text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#e39fa9] text-white rounded-md font-semibold text-lg hover:bg-[#7c459c] transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>

      {/* Verification Modal */}
      <Modal
        isOpen={showVerificationModal}
        onRequestClose={() => setShowVerificationModal(false)}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto shadow-lg flex flex-col items-center outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="text-[#9a6cb4] text-6xl mb-4">
          <BsPatchCheckFill />
        </div>
        <h2 className="text-2xl font-bold text-[#333] mb-2 text-center">
          Authenticate Your Account
        </h2>
        <p className="text-base text-[#666] mb-6 text-center">
          {authMessage ? (
            authMessage
          ) : (
            <>
              Please type the verification code sent to{" "}
              <strong>{email && censorEmail(email)}</strong>.
            </>
          )}
        </p>
        <div className="flex justify-between gap-2 mb-6">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              className="w-10 h-14 text-2xl border-2 border-gray-200 rounded-lg text-center focus:outline-none focus:border-[#f5b63a] shadow"
              maxLength={1}
              value={verificationCode[index] || ""}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(input) => (inputRefs.current[index] = input)}
            />
          ))}
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="rememberDevice"
            className="mr-2"
            onChange={(e) => setRememberDevice(e.target.checked)}
          />
          <label htmlFor="rememberDevice" className="text-sm text-[#333]">
            Remember this Device
          </label>
        </div>
        <button
          className="bg-[#9a6cb4] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#e39fa9] transition"
          onClick={handleCodeSubmission}
        >
          Submit
        </button>
      </Modal>
    </div>
  );
}
