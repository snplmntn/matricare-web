import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getCookie } from "../../../utils/getCookie";
import "../../styles/pages/verify.css";
import axios from "axios";
import { parse } from "@fortawesome/fontawesome-svg-core";
import { CookiesProvider, useCookies } from "react-cookie";

export default function Verify() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const [cookies, setCookie, removeCookie] = useCookies();
  const request = localStorage.getItem("request");

  useEffect(() => {
    const verifyEmail = async () => {
      console.log(request);
      if (request === "true") return;
      localStorage.setItem("request", "true");
      try {
        let token = getCookie("verifyToken");

        const response = await axios.get(`${API_URL}/verify?token=${token}`);
        setError("Verification successful. Redirecting...");
        console.log(response);
        let userData = localStorage.getItem("userData");
        let parsedUser = JSON.parse(userData);
        let role = parsedUser.role;

        setTimeout(() => {
          if (response.status === 200) {
            // Check if the component is still mounted
            document.cookie = `role=${response.data.user.role}`;
            document.cookie = `token=${response.data.jwtToken}`;
            removeCookie("verifyToken");
            localStorage.removeItem("request");
            switch (role) {
              case "Patient":
                navigate("/app");
                break;
              case "Assistant":
                navigate("/assistant-landing");
                break;
              case "Obgyne":
                navigate("/consultant-landing");
                break;
              default:
                navigate("/app");
                break;
            }
          }
        }, 1000);
      } catch (err) {
        console.error(
          "Verification failed:",
          err.response ? err.response.data : err.message
        );
        setError("Verification failed. Please try again.");
      }
    };

    // Ensure verifyEmail is only called once
    if (!localStorage.getItem("request")) {
      verifyEmail();
    }

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
