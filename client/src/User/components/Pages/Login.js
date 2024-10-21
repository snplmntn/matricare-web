import React, { useState, useEffect, useRef } from "react";
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
    console.log(userTrustedDevice);
    setAuthMessage("");
    let userID = getCookie("userID");

    if (verificationCode.length !== 6) {
      setAuthMessage("Verification code must be 6 digits long.");
      return;
    }

    const expiryTimestamp = parseInt(getCookie("expiryTimestamp"), 10);
    const currentTimestamp = Date.now();

    if (currentTimestamp > expiryTimestamp) {
      setAuthMessage("Verification code has expired.");
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
      // console.log(verifyToken);
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
      </div>
    </div>
  );
}
