import React, { useEffect, useState } from "react";
import "../../styles/features/librarysidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faHome,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const LibrarySidebar = () => {
  const [user, setUser] = useState({});

  const handleReload = (e) => {
    if (window.location.pathname === "/library") {
      e.preventDefault();
      window.location.reload();
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
            {user && user.name?.split(" ")[0] }
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
      <div className="library-logout">
        <Link to="/logout">
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default LibrarySidebar;
