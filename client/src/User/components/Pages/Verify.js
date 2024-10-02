import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getCookie } from "../../../utils/getCookie";
import "../../styles/pages/verify.css";
import axios from "axios";
import { parse } from "@fortawesome/fontawesome-svg-core";

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
        let token = getCookie("verifyToken");

        if (!token) {
          setTimeout(() => {
            setError(
              "Verification failed. Please try again. Redirecting to login page"
            );
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }, 3000);
        } else {
          const response = await axios.get(
            `https://matricare-web.onrender.com/api/verify?token=${token}`
          );
          let userData = localStorage.getItem("userData");
          let parsedUser = JSON.parse(userData);
          let role = parsedUser.role;
          setTimeout(() => {
            if (response.status === 200) {
              navigate(
                role === "Patient"
                  ? "/app"
                  : role === "Assistant"
                  ? "/assistant-landing"
                  : role === "Obgyne" && "/consultant-landing"
              );
            }
          }, 3000);
        }
      } catch (err) {
        console.error(
          "Verification failed:",
          err.response ? err.response.data : err.message
        );
        setError("Verification failed. Please try again.");
        // setTimeout(() => {
        //   navigate("/login");
        // }, 3000);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="verify-container">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>
            <strong>Verifying your email</strong>
          </p>
          <div className="loader"></div>
        </>
      )}
    </div>
  );
}
