import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoHome,
  IoCalendar,
  IoChatbubbles,
  IoLibrary,
  IoPerson,
  IoLogOutOutline,
} from "react-icons/io5";
import "../../style/pages/assistantsidebar.css";
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";

const AssistantSidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();
  const token = cookies.token;
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        headers: {
          Authorization: token,
        },
      });

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
      navigate("/");
      removeCookie("token");
    } catch (err) {
      console.error(
        "Something went wrong!",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <aside className="landingpage-assistant-sidebar">
      <div className="landingpage-assistant-sidebar-logo">
        <img src="img/logo_consultant.png" alt="Logo" />
      </div>
      <div className="landingpage-assistant-sidebar-menu">
        <Link
          to="/assistant-landing"
          className="landingpage-assistant-sidebar-item"
          title="Home"
        >
          <IoHome className="landingpage-assistant-icon" />
        </Link>
        <Link
          to="/admin-profile"
          className="landingpage-assistant-sidebar-item"
        >
          <IoPerson className="landingpage-assistant-icon" />
        </Link>
        <Link
          to="/appointment-assistant"
          className="landingpage-assistant-sidebar-item"
          title="Appointment"
        >
          <IoCalendar className="landingpage-assistant-icon" />
        </Link>
        <Link
          to="/library-assistant"
          className="landingpage-assistant-sidebar-item"
          title="Library"
        >
          <IoLibrary className="landingpage-assistant-icon" />
        </Link>
        <Link
          to="/belly-talk"
          className="landingpage-assistant-sidebar-item"
          title="BellyTalk"
        >
          <IoChatbubbles className="landingpage-assistant-icon" />
        </Link>
        <button className="assistant-logout-button" onClick={handleLogout}>
          <IoLogOutOutline />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AssistantSidebar;
