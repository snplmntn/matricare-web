import React from 'react';
import { Link } from 'react-router-dom';
import { IoHome, IoCalendar, IoDocumentText, IoChatbubbles, IoLibrary } from 'react-icons/io5';
import '../../styles/pages/consultantsidebar.css';

const ConsultantSidebar = () => {
    return (
        <aside className="consultant-sidebar">
            <div className="consultant-sidebar-logo">
            <img src="img/logo_consultant.png" alt="logo" /> 
            </div>
            <div className="consultant-sidebar-menu">
                <Link to="/consultant-landing" className="consultant-sidebar-item home" title="Home">
                    <IoHome />
                </Link>
                <Link to="/consultant-appointment" className="consultant-sidebar-item appointment" title="Appointment">
                    <IoCalendar />
                </Link>
                <Link to="/library" className="consultant-sidebar-item library" title="Library">
                    <IoLibrary />
                </Link>
                <Link to="/patient-records" className="consultant-sidebar-item records" title="Records">
                    <IoDocumentText />
                </Link>
                <Link to="/belly-talk" className="consultant-sidebar-item bellytalk" title="BellyTalk">
                    <IoChatbubbles />
                </Link>
            </div>
        </aside>
    );
};

export default ConsultantSidebar;
