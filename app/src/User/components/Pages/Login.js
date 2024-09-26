import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pages/login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log(`Username: ${username.trim()}, Password: ${password.trim()}`);

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // if (!passwordRegex.test(password)) {
    //   setError('Password must contain at least 8 characters, an uppercase letter, a number, and a special character.');
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          username,
          password,
        }
      );

      console.log("Login response:", response.data);

      setSuccessMessage("Login successful! Redirecting...");
      setLoading(false);

      // Redirect to /app after a brief delay
      setTimeout(() => {
        navigate("/app");
      }, 1500); // 1.5 seconds delay

      // Handle success (e.g., redirect or store token)
    } catch (err) {
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response
          ? err.response.data.message
          : "Login error. Please try again."
      ); // Change `msg` to `message`
      setLoading(false);
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
      </div>
    </div>
  );
}
