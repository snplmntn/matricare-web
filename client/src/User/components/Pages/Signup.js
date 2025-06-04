import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Updated import
import axios from "axios";
import Modal from "react-modal";
import "../../styles/pages/signup.css";
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
  const inputRefs = useRef([]); // Array to store input references
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      // handleRedirectToApp();
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
      const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
      setCookie("expiryTimestamp", expiryTime, { path: "/", maxAge: 5 * 60 }); // Setting cookie with maxAge
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
        navigate("/login"); // Redirect to login after 2 seconds
      }, 2000);

      // Handle response, such as redirecting the user
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError("Signup error. Please try again.");
      }
      console.error(
        "Signup error:",
        err.response
          ? err.response.data.message
          : "Signup error. Please try again."
      );
      setVerifyToken("");
      setVerificationCode(new Array(6).fill(""));
    } finally {
      setLoading(false); // End loading state
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return; // Validate form before sending

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
    <div className="signup-outer-container signup-background">
      <div
        className="background-image"
        style={{ backgroundImage: `url(/img/login.jpg)` }}
      ></div>
      <div className="signup-overlay"></div>
      <h2 className="signup-welcome-message">Create New Account!</h2>
      <p className="sign-up-text">
        Already have an Account? <Link to="/login">Log in here!</Link>
      </p>

      {error && <p className="signup-error-message">{error}</p>}

      {success && <p className="signup-success-message">{success}</p>}

      <div className="signup-container">
        <form onSubmit={handleSignup}>
          <div className="SU-form-group">
            <input
              className="SU-form-input"
              type="text"
              id="fullName"
              name="fullName"
              placeholder=" "
              value={fullName}
              onChange={handleChange}
              style={{ padding: "15px", width: "400px" }}
              required
            />
            <label htmlFor="fullName" className="SU-form-label">
              Full Name:
            </label>
          </div>
          <div className="SU-form-group">
            <input
              className="SU-form-input"
              type="email"
              name="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={handleChange}
              style={{ padding: "15px", width: "400px" }}
              required
            />
            <label htmlFor="email" className="SU-form-label">
              Email:
            </label>
          </div>
          <div className="SU-form-group">
            <input
              className="SU-form-input"
              type="text"
              id="username"
              name="username"
              placeholder=" "
              value={username}
              onChange={handleChange}
              style={{ padding: "15px", width: "400px" }}
              required
            />
            <label htmlFor="username" className="SU-form-label">
              Username:
            </label>
          </div>

          <div className="SU-form-group">
            <input
              className="SU-form-input"
              type="password"
              id="password"
              name="password"
              placeholder=" "
              value={password}
              onChange={handleChange}
              style={{ padding: "15px", width: "400px" }}
              required
            />
            <label htmlFor="password" className="SU-form-label">
              Password:
            </label>
          </div>

          <div className="SU-form-group">
            <input
              className="SU-form-input"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder=" "
              value={confirmPassword}
              onChange={handleChange}
              style={{ padding: "15px", width: "400px" }}
              required
            />
            <label htmlFor="confirmPassword" className="SU-form-label">
              Confirm Password:
            </label>
          </div>

          <div className="SU-form-group">
            <input
              className="SU-form-input"
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder=" "
              value={phoneNumber}
              onChange={handleChange}
              style={{ padding: "15px", width: "400px" }}
              required
            />
            <label htmlFor="phoneNumber" className="SU-form-label">
              Phone Number:
            </label>
          </div>
          <div className="SU-form-group">
            <label>
              <input
                type="checkbox"
                id="obGyneSpecialist"
                name="obGyneSpecialist"
                onChange={handleChange}
              />
              Ob-Gyne Specialist
            </label>
          </div>
          <div className="SU-form-group">
            <button type="submit" className="SU-button" disabled={loading}>
              SIGN UP
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showVerificationModal}
        onRequestClose={() => setShowVerificationModal(false)}
        className="Authentication__Content"
        overlayClassName="Authentication__Overlay"
      >
        <div className="Authentication__Icon">
          <BsPatchCheckFill />
        </div>
        <h2 className="Authentication__Title">Confirm your Email</h2>
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

        <button
          className="Authentication__Button Authentication__SubmitButton"
          onClick={handleCodeSubmission}
        >
          Submit
        </button>
      </Modal>
    </div>
  );
}
