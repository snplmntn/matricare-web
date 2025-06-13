import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { BsPatchCheckFill } from "react-icons/bs";
import { getCookie } from "../../../utils/getCookie";
import { useCookies } from "react-cookie";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    obGyneSpecialist: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  // Verification Modal
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState(
    new Array(6).fill("")
  );
  const inputRefs = useRef([]);
  const [verifyToken, setVerifyToken] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies();

  const API_URL = process.env.REACT_APP_API_URL;

  const {
    fullName,
    email,
    username,
    password,
    confirmPassword,
    phoneNumber,
    obGyneSpecialist,
  } = formData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

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

  const handleCodeSubmission = () => {
    setAuthMessage("");
    if (verificationCode.length !== 6) {
      setAuthMessage("Verification code must be 6 digits long.");
      return;
    }
    const expiryTimestamp = parseInt(getCookie("expiryTimestamp"), 10);
    if (!expiryTimestamp) {
      setAuthMessage("Verification code has expired. Please Sign up again.");
      return;
    }
    const joinedCode = verificationCode.join("");
    if (verifyToken === joinedCode.toUpperCase()) {
      setAuthMessage("Verification Successful!");
      setTimeout(() => {
        setShowVerificationModal(false);
      }, 1000);
      submitUser();
    } else {
      setAuthMessage("Invalid verification code. Please try again.");
    }
    setTimeout(() => {
      setAuthMessage("");
    }, 3000);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{11}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (
      !fullName.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !phoneNumber.trim()
    ) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (!phoneRegex.test(phoneNumber)) {
      setError("Phone number must be 11 digits.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least 8 characters, an uppercase letter, a number, and a special character."
      );
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const sendEmail = async () => {
    setError("");
    setSuccess("");
    try {
      const emailResponse = await axios.put(
        `${API_URL}/verify?email=${email}&fullName=${fullName}`
      );
      setVerifyToken(emailResponse.data.verificationToken);
      setSuccess("Email sent! Please check your inbox.");
      const expiryTime = Date.now() + 5 * 60 * 1000;
      setCookie("expiryTimestamp", expiryTime, { path: "/", maxAge: 5 * 60 });
      setLoading(false);
      setShowVerificationModal(true);
    } catch (error) {
      setVerifyToken("");
      setError("Failed to send verification email. Please try again.");
      setLoading(false);
      console.error("Failed to send verification email:", error);
    }
  };

  const submitUser = async () => {
    setError("");
    setSuccess("");
    try {
      const newUser = {
        fullName,
        email,
        username,
        password,
        phoneNumber,
      };
      if (obGyneSpecialist) newUser.role = "Ob-gyne Specialist";
      await axios.post(`${API_URL}/auth/signup`, newUser);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Signup error. Please try again.");
      }
      setVerifyToken("");
      setVerificationCode(new Array(6).fill(""));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setLoading(true);
    if (!verifyToken) {
      await sendEmail();
      return;
    } else {
      submitUser();
    }
  };

  const censorEmail = (email) => {
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return email || "";
    }
    const [name, domain] = email.split("@");
    if (!name || !domain) {
      return email;
    }
    const visibleNamePart = name.slice(0, 3);
    const censoredNamePart = "*".repeat(Math.max(name.length - 3, 0));
    const visibleDomainPart = domain.slice(0, 1);
    const censoredDomainPart = "*".repeat(Math.max(domain.length - 1, 0));
    return `${visibleNamePart}${censoredNamePart}@${visibleDomainPart}${censoredDomainPart}`;
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#7c459c] overflow-hidden">
      {/* Background image and overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90 z-0"
        style={{ backgroundImage: `url(/img/login.jpg)` }}
      ></div>
      <div className="absolute inset-0 bg-[#7c459cbc] z-0"></div>

      {/* Content */}
      <div className="relative left-0 sm:left-20 z-10 flex flex-col px-2 sm:px-4 md:px-4 lg:left-40 w-full">
        <h2 className="text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 mt-8 xs:mt-12 sm:mt-24 leading-tight drop-shadow-lg text-center sm:text-left">
          Create New Account!
        </h2>
        <p className="text-[#042440] text-sm xs:text-base sm:text-lg mb-4 sm:mb-6 text-center sm:text-left">
          Already have an Account?
          <Link
            to="/login"
            className="ml-2 text-white hover:text-[#e39fa9] underline"
          >
            Log in here!
          </Link>
        </p>
        {error && (
          <p className="text-[#E39FA9] mb-4 text-center font-semibold">
            {error}
          </p>
        )}
        {success && (
          <p className="text-[#E39FA9] mb-4 text-center font-semibold">
            {success}
          </p>
        )}
        <form
          onSubmit={handleSignup}
          className="w-full max-w-[500px] bg-white/60 rounded-2xl shadow-lg p-3 xs:p-4 sm:p-8 flex flex-col items-center mx-auto  sm:mx-0"
        >
          <div className="w-full mb-4">
            <label
              htmlFor="fullName"
              className="block text-[#042440] text-base mb-2"
            >
              Full Name:
            </label>
            <input
              className="block w-full px-3 py-2 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9]"
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              value={fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full mb-4">
            <label
              htmlFor="email"
              className="block text-[#042440] text-base mb-2"
            >
              Email:
            </label>
            <input
              className="block w-full px-3 py-2 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9]"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full mb-4">
            <label
              htmlFor="username"
              className="block text-[#042440] text-base mb-2"
            >
              Username:
            </label>
            <input
              className="block w-full px-3 py-2 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9]"
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full mb-4">
            <label
              htmlFor="password"
              className="block text-[#042440] text-base mb-2"
            >
              Password:
            </label>
            <input
              className="block w-full px-3 py-2 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9]"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-[#042440] text-base mb-2"
            >
              Confirm Password:
            </label>
            <input
              className="block w-full px-3 py-2 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9]"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-[#042440] text-base mb-2"
            >
              Phone Number:
            </label>
            <input
              className="block w-full px-3 py-2 text-base text-[#042440] bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-[#e39fa9]"
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full flex items-center mb-4">
            <input
              type="checkbox"
              id="obGyneSpecialist"
              name="obGyneSpecialist"
              checked={obGyneSpecialist}
              onChange={handleChange}
              className="mr-2"
            />
            <label
              htmlFor="obGyneSpecialist"
              className="text-[#042440] text-base"
            >
              Ob-Gyne Specialist
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#e39fa9] text-white rounded-md font-semibold text-lg hover:bg-[#7c459c] transition"
            disabled={loading}
          >
            SIGN UP
          </button>
        </form>
      </div>

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
        <h2 className="text-xl sm:text-2xl font-bold text-[#333] mb-1 sm:mb-2 text-center">
          Confirm your Email
        </h2>
        <p className="text-sm sm:text-base text-[#666] mb-4 sm:mb-6 text-center">
          {authMessage ? (
            authMessage
          ) : (
            <>
              Please type the verification code sent to{" "}
              <strong>{email && censorEmail(email)}</strong>.
            </>
          )}
        </p>
        <div className="flex justify-between gap-1 sm:gap-2 mb-4 sm:mb-6">
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
        <button
          className="bg-[#9a6cb4] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-base sm:text-lg hover:bg-[#e39fa9] transition"
          onClick={handleCodeSubmission}
        >
          Submit
        </button>
      </Modal>
    </div>
  );
}
