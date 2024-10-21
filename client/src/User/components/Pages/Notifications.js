import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoArrowBackSharp, IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/pages/notification.css"; // Import the CSS file
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

function Notifications() {
  const userID = getCookie("userID");
  const token = getCookie("token");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [notification, setNotification] = useState();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);

    try {
      const response = await axios.put(
        `${API_URL}/user/n?id=${notification._id}`,
        {
          status: "Read",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/n?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
        // console.log(response);
        console.log(response.data);
        setNotification(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotification();
  }, []);

  const formatDate = (date) => {
    const notificationDate = new Date(date);
    const now = new Date();
    const isYesterdayOrLater =
      notificationDate.getDate() >= now.getDate() - 1 &&
      notificationDate.getMonth() === now.getMonth() &&
      notificationDate.getFullYear() === now.getFullYear();

    if (isYesterdayOrLater) {
      return notificationDate.toLocaleString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return notificationDate.toLocaleString("en-PH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  return (
    <div className="PatientDashboard">
      <div onClick={handleBackButton} className="notif-back-button">
        <IoArrowBackSharp />
      </div>
      <div className="NotificationsSection">
        <h2 className="section-title">Notifications</h2>
        <hr className="section-divider" />
        {notification && notification.length > 0 ? (
          <div className="notifications-list">
            {notification.map((notification, index) => (
              <div
                key={index}
                className={`notification-container info`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-content">
                  <img
                    src={
                      notification.senderName === "MatriCare"
                        ? "img/LOGO.png"
                        : notification.senderId &&
                          notification.senderId.profilePicture
                        ? notification.senderId.profilePicture
                        : "img/topic1.jpg"
                    }
                    alt={notification.senderName}
                    className="sender-photo"
                  />
                  <div className="notification-text">
                    <strong className="notification-title">
                      {notification.senderName}
                    </strong>
                    <span className="notification-phonenumber">
                      {notification.senderPhoneNumber &&
                        `(${notification.senderPhoneNumber})`}
                    </span>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                  </div>
                  <div className="notification-time">
                    {formatDate(notification.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notifications">
            <FaCheckCircle className="caught-up-icon" />
            <h1>You're all caught up</h1>
            <p>
              Come back later for Reminders, Appointment Confirmation,
              <br /> and your Prescription notifications.
            </p>
          </div>
        )}
      </div>
      {isModalOpen && selectedNotification && (
        <div className="notif-modal-overlay">
          <div className="notif-modal-content">
            <span onClick={closeModal} className="notif-modal-back-button">
              <IoArrowBack />
            </span>
            <img
              src={
                selectedNotification.senderName === "MatriCare"
                  ? "img/LOGO.png"
                  : selectedNotification.senderId &&
                    selectedNotification.senderId.profilePicture
                  ? selectedNotification.senderId.profilePicture
                  : "img/topic1.jpg"
              }
              alt={selectedNotification.senderName}
              className="modal-sender-photo"
            />
            <h2 className="modal-sender-name">
              {selectedNotification.senderName}
            </h2>
            <div className="modal-notification-time">
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </div>
            <div className="message-bubble">
              <p className="notification-message">
                {selectedNotification.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
