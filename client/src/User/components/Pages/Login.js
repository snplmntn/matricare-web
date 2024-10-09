import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pages/login.css";
import Modal from "react-modal";
import { BsPatchCheckFill } from "react-icons/bs";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import { CookiesProvider, useCookies } from "react-cookie";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false); // For modal
  const [email, setEmail] = useState(""); // Store the user's email
  const [resendMessage, setResendMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loginToken, setLoginToken] = useState("");
  const [verifyToken, setVerifyToken] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();

  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCodeSubmission = () => {
    setAuthMessage("");
    const role = cookies.role;

    if (verifyToken === verificationCode.toUpperCase()) {
      setAuthMessage("Verification Successful!");

      setTimeout(() => {
        document.cookie = `token=${loginToken}`;
        navigate(
          role === "Patient"
            ? "/app"
            : role === "Assistant"
            ? "/assistant-landing"
            : role === "Obgyne" && "/consultant-landing"
        );
      }, 3000);
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
      const userDetails = {
        name: response.data.user.fullName,
        role: response.data.user.role,
        username: response.data.user.username,
        profilePicture: response.data.user.profilePicture,
      };

      localStorage.setItem("userData", JSON.stringify(userDetails));
      const userEmail = response.data.user.email; // Assume the email is returned from the backend
      document.cookie = `userID=${response.data.user._id}`;
      document.cookie = `role=${response.data.user.role}`;
      setLoginToken(response.data.token);

      // After successful login, show the verification modal
      setEmail(userEmail);
      setSuccessMessage("Login successful! Please verify your account.");
      setShowVerificationModal(true);
      setLoading(false);
      await handleResendEmail();
    } catch (err) {
      // Log the error
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response
          ? err.response.data.message
          : "Login error. Please try again."
      );
      setLoading(false); // Stop loading
    }
  };

  const handleResendEmail = async () => {
    try {
      let userID = getCookie("userID");
      const response = await axios.put(`${API_URL}/verify?userId=${userID}`);
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
    const censoredNamePart = "*".repeat(Math.max(name.length - 3, 0)); // Ensure the repeat count is not negative
    const visibleDomainPart = domain.slice(0, 1);
    const censoredDomainPart = "*".repeat(Math.max(domain.length - 1, 0)); // Ensure the repeat count is not negative
    return `${visibleNamePart}${censoredNamePart}@${visibleDomainPart}${censoredDomainPart}`;
  };

  return (
    <div className="login-outer-container login-background">
      <div
        className="background-image"
        style={{ backgroundImage: `url(/img/login.jpg)` }}
      ></div>
      <div className="login-overlay"></div>
      <h2 className="login-welcome-message">Login!</h2>
      <p className="login-sign-up-text">
        Don't have an account? <Link to="/signup">Sign Up here!</Link>
      </p>

      {error && <p className="login-error-message">{error}</p>}

      {successMessage && (
        <p className="login-success-message">{successMessage}</p>
      )}

      <div className="container-login">
        <form onSubmit={handleLogin}>
          <div className="LI-form-group">
            <input
              className="LI-form-input"
              type="text"
              id="username"
              placeholder=" "
              value={username}
              onChange={handleChange}
              style={{ padding: "15px", width: "400px" }}
              required
            />
            <label htmlFor="username" className="LI-form-label">
              Username:
            </label>
          </div>

          <div className="LI-form-group password-toggle-container">
            <input
              className="LI-form-input"
              type={showPassword ? "text" : "password"} // Toggle between text and password
              id="password"
              placeholder=" "
              value={password}
              onChange={handleChange}
              style={{ padding: "15px", width: "400px" }}
              required
            />
            <label htmlFor="password" className="LI-form-label">
              Password:
            </label>
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </span>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <div className="LI-form-group">
            <button type="submit" className="LI-button" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </div>
        </form>

        {/* Verification Modal */}

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
                onChange={(e) => {
                  const newCode = (verificationCode || "").toString().split("");
                  newCode[index] = e.target.value; // Allow any character input
                  setVerificationCode(newCode.join(""));
                }}
              />
            ))}
          </div>

          <button
            className="Authentication__Button Authentication__SubmitButton"
            onClick={handleCodeSubmission}
          >
            Submit
          </button>
        </Modal>
      </div>
    </div>
  );
}
