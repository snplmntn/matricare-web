import React from 'react';
import { Link } from 'react-router-dom';
import { IoHome, IoCalendar, IoChatbubbles, IoLibrary, IoPerson } from 'react-icons/io5';
import '../../style/pages/assistantsidebar.css';


const AssistantSidebar = () => {
    return (
    <aside className="landingpage-assistant-sidebar">
        <div className="landingpage-assistant-sidebar-logo">
          <img src="img/logo_consultant.png" alt="Logo" />
        </div>
        <div className="landingpage-assistant-sidebar-menu">
        <Link to="/assistant-landing" className="landingpage-assistant-sidebar-item" title="Home">
            <IoHome className="landingpage-assistant-icon" />
          </Link>
        <Link to="/admin-profile" className="landingpage-assistant-sidebar-item">
            <IoPerson  className="landingpage-assistant-icon" />
          </Link>
          <Link to="/appointment-assistant" className="landingpage-assistant-sidebar-item" title="Appointment">
            <IoCalendar className="landingpage-assistant-icon" />
          </Link>
          <Link to="/library-assistant" className="landingpage-assistant-sidebar-item" title="Library">
            <IoLibrary className="landingpage-assistant-icon" />
          </Link>
          <Link to="/belly-talk" className="landingpage-assistant-sidebar-item" title="BellyTalk">
            <IoChatbubbles className="landingpage-assistant-icon" />
          </Link>
        </div>
      </aside>
     );
};

export default AssistantSidebar;
