import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoHome,
  IoCalendar,
  IoFolderOpen,
  IoChatbubbles,
  IoLibrary,
  IoBarChart,
  IoLogOutOutline,
} from "react-icons/io5";
import "../../styles/pages/consultantsidebar.css";
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";

const ConsultantSidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const token = cookies.token;
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

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
    <aside className="consultant-sidebar">
      <div className="consultant-sidebar-logo">
        <img src="img/logo_consultant.png" alt="logo" />
      </div>
      <div className="consultant-sidebar-menu">
        <Link
          to="/consultant-landing"
          className="consultant-sidebar-item home"
          title="Home"
        >
          <IoHome />
        </Link>
        <Link
          to="/consultant-appointment"
          className="consultant-sidebar-item appointment"
          title="Appointment"
        >
          <IoCalendar />
        </Link>
        <Link
          to="/library-consultant"
          className="consultant-sidebar-item library"
          title="Library"
        >
          <IoLibrary />
        </Link>
        <Link
          to="/belly-talk"
          className="consultant-sidebar-item bellytalk"
          title="BellyTalk"
        >
          <IoChatbubbles />
        </Link>
        <Link
          to="/manageBellytalk"
          className="consultant-sidebar-item bellytalk"
          title="Manage BellyTalk"
        >
          <IoBarChart />
        </Link>
        <Link
          to="/consultant-patientsinfo"
          className="consultant-sidebar-item records"
          title="Patient Records"
        >
          <IoFolderOpen />
        </Link>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        <IoLogOutOutline />
        Logout
      </button>
    </aside>
  );
};

export default ConsultantSidebar;
