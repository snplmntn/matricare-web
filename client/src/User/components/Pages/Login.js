import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pages/login.css";
import Modal from "react-modal";
import { MdMarkEmailRead } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false); // For modal
  const [email, setEmail] = useState(""); // Store the user's email
  const [resendMessage, setResendMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    setSuccessMessage("");

    console.log(`Username: ${username.trim()}, Password: ${password.trim()}`);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");

      setLoading(false);
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // if (!passwordRegex.test(password)) {
    //   setError(
    //     "Password must contain at least 8 characters, an uppercase letter, a number, and a special character."
    //   );
    //   setLoading(false);
    //   return;
    // }

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
      };

      localStorage.setItem("userData", JSON.stringify(userDetails));
      const userEmail = response.data.user.email; // Assume the email is returned from the backend
      document.cookie = `userID=${response.data.user._id}`;

      // After successful login, show the verification modal
      setEmail(userEmail);
      setSuccessMessage("Login successful! Please verify your email.");
      setLoading(false);
      await handleResendEmail();
      setShowVerificationModal(true);
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
        ? setSuccessMessage("Verification email resent successfully!")
        : setSuccessMessage("Verification email sent successfully!");
      document.cookie = `verifyToken=${response.data.verificationToken}`;
      setResendMessage(true);
    } catch (error) {
      console.error("Resend email error:", error);
      setError("Failed to resend verification email.");
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
          className="ReactModal__Content"
          overlayClassName="ReactModal__Overlay"
        >
          <div className="email-icon">
            <MdMarkEmailRead />
          </div>
          <h2>Authenticate your Account</h2>
          <p>
            We've sent a verification email to{" "}
            <strong>{email && censorEmail(email)}</strong>. Please verify your
            email.
          </p>
          <button onClick={handleResendEmail}>Resend Email</button>
          {successMessage && <p>{successMessage}</p>}
        </Modal>
      </div>
    </div>
  );
}
