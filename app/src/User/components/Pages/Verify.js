import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verificationCode = queryParams.get("code");
    const email = queryParams.get("email");

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/users/verify?code=${verificationCode}&email=${email}`
        );
        if (response.status === 200) {
          navigate("/app");
        }
      } catch (err) {
        console.error(
          "Verification failed:",
          err.response ? err.response.data : err.message
        );
        setError("Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="verify-container">
      {error ? <p>{error}</p> : <p>Verifying your email...</p>}
    </div>
  );
}
