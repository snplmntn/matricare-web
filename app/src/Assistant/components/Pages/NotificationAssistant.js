import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa'; 
import '../../style/pages/notificationassistant.css';
import { IoArrowBackSharp  } from 'react-icons/io5';
import { Link } from "react-router-dom";

function NotificationsAssistant({ userRole }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      // Filter notifications based on the user role
      if (newNotification.role === userRole || newNotification.role === 'all') {
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
      }
    };

    return () => {
      ws.close();
    };
  }, [userRole]);

  return (
    <div className="PatientDashboard">
      <Link to="/assistant-landing" className="notif-back-button"><IoArrowBackSharp /></Link>
      <div className="NotificationsSection">
        <h2 className="section-title">Notifications</h2>
        <hr className="section-divider" />
        {notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <div key={index} className={`notification-container ${notification.type}`}>
                <div className="notification-content">
                  <div className="notification-text">
                    <strong className="notification-title">{notification.title}</strong>
                    <p className="notification-subtitle">{notification.sender}</p>
                  </div>
                  <div className="notification-time">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notifications">
            <FaCheckCircle className="caught-up-icon" />
            <h1>You're all caught up</h1>
            <p>Come back later for Reminders, Appointment Confirmation,<br></br> and your Prescription notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsAssistant;
