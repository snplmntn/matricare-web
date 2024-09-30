import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pages/login.css";
import Modal from "react-modal";
import { MdMarkEmailRead } from "react-icons/md";
import { getCookie } from "../../../utils/getCookie";
import { URL } from "../../../App";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false); // For modal
  const [email, setEmail] = useState(""); // Store the user's email
  const navigate = useNavigate();

  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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

    // const passwordRegex =
    //   /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // if (!passwordRegex.test(password)) {
    //   setError(
    //     "Password must contain at least 8 characters, an uppercase letter, a number, and a special character."
    //   );
    //   setLoading(false);
    //   return;
    // }

    try {
      // Perform login
      const response = await axios.post(
        `https://matricare-web.onrender.com/api/auth/login`,
        {
          username,
          password,
        }
      );
      console.log(response);
      document.cookie = `userID=${response.data.user._id}`;
      document.cookie = `token=${response.data.token}`;
      document.cookie = `verifyToken=${response.data.user.token}`;
      const userDetails = {
        name: response.data.user.fullName,
        role: response.data.user.role,
        username: response.data.user.username,
      };
      localStorage.setItem("userData", JSON.stringify(userDetails));
      const userEmail = response.data.user.email; // Assume the email is returned from the backend

      // After successful login, show the verification modal
      setEmail(userEmail);
      setSuccessMessage("Login successful! Please verify your email.");
      setLoading(false);
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

      // Show verification modal regardless of the error
      setShowVerificationModal(true); // Show modal
      setLoading(false); // Stop loading
    }
  };

  const handleResendEmail = async () => {
    try {
      let userID = getCookie("userID");
      await axios.put(
        `https://matricare-web.onrender.com/api/verify?userId=${userID}`
      );
      setSuccessMessage("Verification email resent successfully!");
    } catch (error) {
      console.error(
        "Resend email error:",
        error
        // error.response ? error.response.data : error.message
      );
      setError("Failed to resend verification email.");
    }
  };

  return (
    <div
      className="login-outer-container login-background"
      style={{
        position: "relative",
        zIndex: 0,
      }}
    >
      <div
        className="background-image"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundImage: 'url("/img/login.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
          zIndex: -1,
        }}
      />
      <div className="login-overlay"></div>
      <h2 className="login-welcome-message">Log in to MatriCare!</h2>
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
          <div className="LI-form-group">
            <input
              className="LI-form-input"
              type="password"
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
          <h2>Verify your Email</h2>
          <p>
            You're almost there! We've sent a verification email to{" "}
            <strong>{email}</strong>. <br></br>You need to verify your email
            address to log into MatriCare.
          </p>
          <button onClick={handleResendEmail}>Resend Email</button>
          {successMessage && <p>{successMessage}</p>}
        </Modal>
      </div>
    </div>
  );
}
