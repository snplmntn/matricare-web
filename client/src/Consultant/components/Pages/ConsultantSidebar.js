import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoHome,
  IoCalendar,
  IoDocumentText,
  IoChatbubbles,
  IoLibrary,
  IoBarChart,
  IoClipboard ,
  IoLogOutOutline ,
} from "react-icons/io5";
import "../../styles/pages/consultantsidebar.css";

const ConsultantSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
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
          title="Manage BellyTalk>"
        >
          <IoBarChart  />
        </Link>
        <Link
          to="/consultant-logs"
          className="consultant-sidebar-item logs"
          title="Logs"
        >
          <IoClipboard  />
        </Link>
      </div>
        <button className="logout-button" onClick={handleLogout}>
        <IoLogOutOutline/>
          Logout
        </button>
    </aside>
  );
};

export default ConsultantSidebar;
