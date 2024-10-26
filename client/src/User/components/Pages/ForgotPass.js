import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/pages/forgotpass.css";
import Modal from "react-modal";
import { CookiesProvider, useCookies } from "react-cookie";
import { BsPatchCheckFill } from "react-icons/bs";
import axios from "axios";

export default function ForgotPassword() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [authMessage, setAuthMessage] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false); // For modal
  const [verifyToken, setVerifyToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState("");

  const censorEmail = (email) => {
    const [name, domain] = email.split("@");
    const visibleNamePart = name && name.slice(0, 3);
    const censoredNamePart = "*".repeat(Math.max(name && name.length - 3, 0)); // Ensure the repeat count is not negative
    const visibleDomainPart = domain && domain.slice(0, 1);
    const censoredDomainPart = "*".repeat(
      Math.max(domain && domain.length - 1, 0)
    ); // Ensure the repeat count is not negative
    return `${visibleNamePart}${censoredNamePart}@${visibleDomainPart}${censoredDomainPart}`;
  };

  const handleCodeSubmission = () => {
    setAuthMessage("");

    if (verifyToken === verificationCode.toUpperCase()) {
      setAuthMessage("Verification Successful!");
      setIsChangePassword(true);

      setTimeout(() => {
        setShowVerificationModal(false);
      }, 2000);
    } else {
      setAuthMessage("Invalid verification code. Please try again.");
    }

    setTimeout(() => {
      setAuthMessage("");
    }, 3000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.get(`${API_URL}/auth/find?account=${email}`);

      if (response.data.userId) {
        setUserId(response.data.userId);
        setEmailCode(response.data.email);

        try {
          const emailResponse = await axios.put(
            `${API_URL}/verify?userId=${response.data.userId}`
          );
          setSuccessMessage("We have e-mailed your password reset code!");
          setVerifyToken(emailResponse.data.verificationToken);

          setTimeout(() => {
            setShowVerificationModal(true);
          }, 2000);
        } catch (error) {
          console.error("Send email error:", error);
          setError("Failed to send verification code.");
        }
      } else {
        // If the userId is not found, set an error message
        setError("Email is not registered. Please check and try again.");
      }
    } catch (error) {
      console.error("Send email error:", error);
      setError("Failed to send verification code.");
      setShowVerificationModal(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setPasswordError("");
    setError("");

    // Password validation checks
    const passwordValidation = (password) => {
      const minLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      return minLength && hasUppercase && hasNumber && hasSpecialChar;
    };

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!passwordValidation(newPassword)) {
      setPasswordError(
        "Password must contain at least 8 characters, one uppercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const passwordObj = {
        password: newPassword,
      };
      console.log(passwordObj);
      const response = await axios.put(
        `${API_URL}/auth/recover?userId=${userId}`,
        passwordObj
      );
      setPasswordError("Password changed successfully! Please Login.");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Password change error:", error);
      setError("Failed to change the password. Please try again.");
    }
  };

  return (
    <div className="FP-outer-container FP-background">
      <div
        className="background-image"
        style={{ backgroundImage: `url(/img/login.jpg)` }}
      ></div>
      <div className="FP-overlay"></div>
      <h2 className="FP-welcome-message">
        Create New <br></br>Password!
      </h2>
      <p className="forgot-pass-text">New Password</p>

      <div className="forgot-password-container">
        {!isChangePassword ? (
          <form onSubmit={handleResetPassword}>
            <div className="FP-form-group">
              <input
                className="FP-form-input"
                name="email"
                type="text"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: "15px", width: "400px" }}
                required
              />
              <label htmlFor="username" className="FP-form-label">
                Email:
              </label>
            </div>
            <button type="submit" className="FP-button">
              RESET PASSWORD
            </button>
            {error && <div className="FP-error-message">{error}</div>}
            {successMessage && (
              <div className="FP-success-message">{successMessage}</div>
            )}
          </form>
        ) : (
          <form onSubmit={handleChangePassword}>
            <div className="FP-form-group">
              <input
                className="FP-form-input"
                name="newPassword"
                type="password"
                id="newPassword"
                placeholder=" "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ padding: "15px", width: "400px" }}
                required
              />
              <label htmlFor="newPassword" className="FP-form-label">
                New Password:
              </label>
            </div>
            <div className="FP-form-group">
              <input
                className="FP-form-input"
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ padding: "15px", width: "400px" }}
                required
              />
              <label htmlFor="confirmPassword" className="FP-form-label">
                Confirm New Password:
              </label>
            </div>
            {passwordError && (
              <div className="success-message">{passwordError}</div>
            )}
            <button type="submit" className="FP-button">
              CHANGE PASSWORD
            </button>
          </form>
        )}

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
                <strong>{emailCode && censorEmail(emailCode)}</strong>.
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
