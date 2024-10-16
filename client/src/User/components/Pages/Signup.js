import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Updated import
import axios from "axios";
// import { URL } from "../../../App";
import "../../styles/pages/signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const { fullName, email, username, password, confirmPassword, phoneNumber } =
    formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return; // Validate form before sending

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        fullName,
        email,
        username,
        password,
        phoneNumber,
      });

      console.log("Signup response:", response.data);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login"); // Redirect to login after 2 seconds
      }, 2000);

      // Handle response, such as redirecting the user
    } catch (err) {
      console.log(err);
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
    } finally {
      setLoading(false); // End loading state
    }
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
            <button type="submit" className="SU-button" disabled={loading}>
              SIGN UP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
