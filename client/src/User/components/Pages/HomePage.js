import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FcOpenedFolder } from "react-icons/fc";
import {
  faBell,
  faSignOutAlt,
  faFileMedical,
  faBook,
  faMessage,
  faChevronDown,
  faSearch,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import "../../styles/pages/homepage.css";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import { CookiesProvider, useCookies } from "react-cookie";

function HomePage({ user }) {
  const userID = getCookie("userID");
  let { name, username, role } = user.current;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLibraryDropdown, setShowLibraryDropdown] = useState(false);
  const [activeBellyTalkTab, setActiveBellyTalkTab] = useState("new");
  const [newPost, setNewPost] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();
  const token = cookies.token;

  const API_URL = process.env.REACT_APP_API_URL;
  const [notification, setNotification] = useState();
  const [upcomingAppointment, setUpcomingAppointment] = useState();

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

  useEffect(() => {
    if (!user) window.location.href = "/";

    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/post/i`, {
          headers: {
            Authorization: token,
          },
        });

        setNewPost(response.data);
      } catch (err) {
        console.error(
          "Something went wrong!",
          err.response ? err.response.data : err.message
        );
      }
    };

    const fetchNotification = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/n?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
        // console.log(response);
        const unreadNotifications = response.data.filter(
          (notification) => notification.status === "Unread"
        );
        setNotification(unreadNotifications.length);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/appointment/u?userId=${userID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const appointments = response.data;
        const now = new Date();
        const upcoming = appointments
          .filter((appointment) => new Date(appointment.date) > now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        const laterToday = appointments
          .filter(
            (appointment) =>
              new Date(appointment.date) > now &&
              new Date(appointment.date).toDateString() === now.toDateString()
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        if (upcoming) {
          setUpcomingAppointment(upcoming);
        } else if (laterToday) {
          setUpcomingAppointment(laterToday);
        } else {
          setUpcomingAppointment(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
    fetchNotification();
    fetchAppointment();
  }, []);

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
        <div className="homepage-logout" onClick={handleLogout}>
          <Link>
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
                          {notification ? notification : 0}
                        </span>
                        <p>
                          You have {notification ? notification : "no"}
                          {" unread "}
                          notifications today!
                        </p>
                      </div>
                    </a>
                    <a href="/" className="dashboard-appointment-link">
                      <div className="dashboard-appointment-rectangle">
                        <div className="dashboard-text-wrapper">
                          {upcomingAppointment ? (
                            <>
                              <h2>Upcoming Appointment</h2>
                              <div className="dashboard-appointment-details">
                                <p>
                                  <IoCalendarOutline className="dashboard-appointment-icon" />{" "}
                                  Date:{" "}
                                  {upcomingAppointment &&
                                    new Date(
                                      upcomingAppointment.date
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                  <IoTimeOutline className="dashboard-appointment-icon" />{" "}
                                  Time:{" "}
                                  {upcomingAppointment &&
                                    new Date(
                                      upcomingAppointment.date
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </p>
                                <p>
                                  <IoLocationOutline className="dashboard-appointment-icon" />{" "}
                                  Place:{" "}
                                  {upcomingAppointment &&
                                    upcomingAppointment.location}
                                </p>
                              </div>{" "}
                            </>
                          ) : (
                            <>
                              <h2>No Upcoming Appointment</h2>
                            </>
                          )}
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
                    <h2>Stages of Pregnancy</h2>
                    <p>First, Second, and Third Trimester</p>
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
                    <p>Week 1 - Week 42</p>
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
                </div>
                {activeBellyTalkTab === "new" ? (
                  <div className="bellytalk-content">
                    <div className="bellytalk-scrollable">
                      {newPost &&
                        newPost.map((post) => {
                          console.log(post.likes);
                          const likedUserIDs = post.likes.map((i) => i.userId);
                          const isLikedByMe = likedUserIDs.includes(userID);
                          return (
                            <div key={post._id} className="bellytalk-item">
                              <div className="profile-icon">
                                <img
                                  src="img/logo.png"
                                  alt="Profile"
                                  className="profile-icon-image"
                                />
                              </div>
                              <p>{`${post.content}`}</p>
                              <FontAwesomeIcon
                                style={{
                                  color: isLikedByMe ? "#e39fa9" : "#9a6cb4",
                                }}
                                icon={faHeart}
                                className="bellytalk-like-icon"
                              />
                            </div>
                          );
                        })}
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
