import React, { useEffect, useState } from "react";
import "../../styles/features/librarysidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faHome,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";

const LibrarySidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user, setUser] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;
  const token = cookies.token;

  const handleReload = (e) => {
    if (window.location.pathname === "/library") {
      e.preventDefault();
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/logout`, {
        headers: {
          Authorization: token,
        },
      });

      removeCookie("token");
      removeCookie("userID");
      removeCookie("verifyToken");
      removeCookie("role");
      localStorage.removeItem("userData");
      localStorage.removeItem("address");
      localStorage.removeItem("email");
      localStorage.removeItem("events");
      localStorage.removeItem("userData");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("profileImageUrl");
      localStorage.removeItem("savedArticles");
      localStorage.removeItem("userName");
      window.location.href = "/";
    } catch (err) {
      console.error(
        "Something went wrong!",
        err.response ? err.response.data : err.message
      );
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  return (
    <nav className="library-sidebar">
      <div className="library-profile-section">
        <img
          src="img/topic4.jpg"
          alt="Profile Picture"
          className="library-profile-picture"
        />
        <div className="library-profile-info">
          <p className="library-welcome-text">
            Welcome <br />
            Back,
          </p>
          <p className="library-user-name">
            {user && user.name?.split(" ")[0]}
          </p>
        </div>
      </div>
      <div className="library-nav-links">
        <ul>
          <li>
            <Link to="/app">
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          <li>
            <Link to="/savedarticle">
              <FontAwesomeIcon icon={faBookmark} /> Saved Articles
            </Link>
          </li>
        </ul>
      </div>
      <div className="library-logout" onClick={handleLogout}>
        <Link>
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default LibrarySidebar;
