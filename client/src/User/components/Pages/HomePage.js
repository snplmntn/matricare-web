import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSignOutAlt,
  faFileMedical,
  faVideoCamera,
  faBook,
  faMessage,
  faChevronDown,
  faSearch,
  faExclamationTriangle,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import "../../styles/pages/homepage.css";

function HomePage({ user }) {
  const { name, username, role } = user.current;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLibraryDropdown, setShowLibraryDropdown] = useState(false);
  const [activeBellyTalkTab, setActiveBellyTalkTab] = useState("new");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLibraryClick = (e) => {
    e.preventDefault();
    setShowLibraryDropdown(!showLibraryDropdown);
  };

  const handleBellyTalkTabClick = (tab) => {
    setActiveBellyTalkTab(tab);
  };

  const handleViewResource = (resource) => {
    // Handle view resource action, e.g., navigate to resource details page
    console.log(`Viewing resource: ${resource}`);
  };

  const notificationCount = 3;

  return (
    <div className="homepage-container">
      <div className="homepage-left-container">
        <div className="homepage-profile">
          <img
            src="img/logo_consultant.png"
            alt="Logo"
            className="homepage-logo-side"
          />
          <p class="patient-text">{role}</p>
          <div className="homepage-welcome">
            <p>Hi, {name}!</p>
          </div>
        </div>
        <div className="homepage-nav-links">
          <ul>
            <li>
              <Link to="/medicalrecords">
                <FontAwesomeIcon icon={faFileMedical} />
                Records
              </Link>
            </li>
            <li>
              <Link to="/library">
                <FontAwesomeIcon icon={faBook} /> Library
              </Link>
            </li>
            <li>
              <Link to="/belly-talk">
                <FontAwesomeIcon icon={faMessage} /> BellyTalk
              </Link>
            </li>
          </ul>
        </div>
        <div className="homepage-logout">
          <Link to="/">
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </Link>
        </div>
      </div>
      <div className="homepage-right-container">
        <div className="homepage-right-content">
          <div className="homepage-header-right">
            <div className="homepage-search">
              <input
                type="text"
                placeholder="Search..."
                className="homepage-search-input"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="homepage-search-icon"
              />
            </div>
            <Link
              to="/notification"
              className="homepage-notification"
              title="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
            </Link>
            <div className="homepage-profile-info" onClick={toggleDropdown}>
              <div className="homepage-profile-circle">
                <img
                  src="img/logo3.png"
                  alt="Profile"
                  className="homepage-profile-picture-small"
                />
                <span className="homepage-profile-name">{name}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="homepage-profile-dropdown-icon"
                />
              </div>
              {isDropdownOpen && (
                <div className="homepage-profile-dropdown-menu">
                  <ul>
                    <li onClick={() => setIsDropdownOpen(false)}>
                      <Link to="/userprofile">User Profile</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="homepage-overlay-container">
            <div className="homepage-top-container">
              <div className="homepage-content">
                <div className="dashboard-container">
                  <h1>Dashboard</h1>
                  <div className="dashboard-notification-container">
                    <a
                      href="/notification"
                      className="dashboard-notification-link"
                    >
                      <div className="dashboard-notification-circle">
                        <span className="dashboard-notification-icon">
                          {notificationCount}
                        </span>
                        <p>You have {notificationCount} notifications today!</p>
                      </div>
                    </a>
                    <a href="/" className="dashboard-appointment-link">
                      <div className="dashboard-appointment-rectangle">
                        <div className="dashboard-text-wrapper">
                          <h2>Upcoming Appointment</h2>
                          <div className="dashboard-appointment-details">
                            <p>
                              <IoCalendarOutline className="dashboard-appointment-icon" />{" "}
                              Date: Tomorrow
                            </p>
                            <p>
                              <IoTimeOutline className="dashboard-appointment-icon" />{" "}
                              Time: 10:00 AM
                            </p>
                            <p>
                              <IoLocationOutline className="dashboard-appointment-icon" />{" "}
                              Place: Medical Center
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                <div
                  className="homepage-due-date"
                  style={{
                    backgroundImage: "url('img/bg1.webp')",
                  }}
                >
                  <h2>Wondering when your baby is due?</h2>
                  <p>
                    Discover your due date with our Pregnancy Due Date
                    Calculator!
                  </p>
                  <Link to="/duedate-calculator">
                    <button className="due-date-see-all">
                      Click Now <span>&gt;</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="homepage-bottom-content">
              <div className="homepage-library">
                <h1>Resource Library</h1>
                <Link to="/library">
                  <button className="homepage-bottom-see-all">
                    All Resource Library
                  </button>
                </Link>
                <div className="homepage-library-container">
                  <div className="homepage-library-column">
                    <img
                      src="img/topic1.jpg"
                      alt="Library Resource 1"
                      className="library-image"
                    />
                    <h2>First Trimester</h2>
                    <p>Description</p>
                    <Link to="/library-item1">
                      <button
                        className="view-button"
                        onClick={() => handleViewResource("Resource 1")}
                      >
                        View <span>&gt;</span>
                      </button>
                    </Link>
                  </div>
                  <div className="homepage-library-column">
                    <img
                      src="img/topic2.jpg"
                      alt="Library Resource 2"
                      className="library-image"
                    />
                    <h2>Weekly Pregnancy</h2>
                    <p>Description</p>
                    <Link to="/library-item4">
                      <button
                        className="view-button"
                        onClick={() => handleViewResource("Resource 2")}
                      >
                        View <span>&gt;</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="homepage-bellytalk">
                <h1>BellyTalk</h1>
                <Link to="/belly-talk">
                  <button className="homepage-bottom-see-all-one">
                    All BellyTalk
                  </button>
                </Link>
                <div>
                  <span
                    className={`bellytalk-tab ${
                      activeBellyTalkTab === "new" ? "active" : ""
                    }`}
                    onClick={() => handleBellyTalkTabClick("new")}
                    style={{
                      color: activeBellyTalkTab === "new" ? "red" : "",
                      textDecoration:
                        activeBellyTalkTab === "new" ? "none" : "underline",
                    }}
                  >
                    New Posts
                  </span>
                  <span
                    className={`bellytalk-tab ${
                      activeBellyTalkTab === "featured" ? "active" : ""
                    }`}
                    onClick={() => handleBellyTalkTabClick("featured")}
                    style={{
                      color: activeBellyTalkTab === "featured" ? "blue" : "",
                      textDecoration:
                        activeBellyTalkTab === "featured"
                          ? "none"
                          : "underline",
                    }}
                  >
                    Featured
                  </span>
                </div>
                {activeBellyTalkTab === "new" ? (
                  <div className="bellytalk-content">
                    <div className="bellytalk-scrollable">
                      {[...Array(10)].map((_, index) => (
                        <div key={index} className="bellytalk-item">
                          <div className="profile-icon">
                            <img
                              src="img/logo.png"
                              alt="Profile"
                              className="profile-icon-image"
                            />
                          </div>
                          <p>{`Post ${index + 1}`}</p>
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="bellytalk-like-icon"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bellytalk-content">
                    <h2>Featured</h2>
                    <p>Content related to featured posts goes here...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
