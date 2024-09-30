import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { IoArrowBackSharp, IoArrowBack  } from 'react-icons/io5';
import { Link } from "react-router-dom";
import '../../styles/pages/notification.css'; // Import the CSS file

const sampleNotifications  = [
  {
    sender: "Dra. Donna",
    phonenumber: "+63 901 2345 678",
    message: "You have new test results available.",
    timestamp: new Date().toISOString(),
    type: "info",
    photo: "img/topic1.jpg" 
  },
  {
    sender: "Assistant Kelly",
    phonenumber: "+63 901 2345 678",
    message: "Your rescheduled appointment is confirmed for tomorrow.",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    type: "info",
    photo: "img/topic1.jpg" 
  },
  {
    sender: "Laboratory",
    phonenumber: "+63 901 2345 678",
    message: "Your laboratory result is ready for pick up.",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    type: "info",
    photo: "img/topic1.jpg" 
  }
];

function Notifications() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="PatientDashboard">
      <Link to="/app" className="notif-back-button"><IoArrowBackSharp /></Link>
      <div className="NotificationsSection">
        <h2 className="section-title">Notifications</h2>
        <hr className="section-divider" />
        {sampleNotifications.length > 0 ? (
          <div className="notifications-list">
            {sampleNotifications.map((notification, index) => (
              <div key={index} className={`notification-container ${notification.type}`}onClick={() => handleNotificationClick(notification)}>
                <div className="notification-content">
                  <img src={notification.photo} alt={notification.sender} className="sender-photo" />
                  <div className="notification-text">
                    <strong className="notification-title">{notification.sender}</strong>
                    <span className="notification-phonenumber">({notification.phonenumber})</span>
                    <p className="notification-message">{notification.message}</p>
                  </div>
                  <div className="notification-time">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notifications">
            <FaCheckCircle className="caught-up-icon" />
            <h1>You're all caught up</h1>
            <p>Come back later for Reminders, Appointment Confirmation,<br /> and your Prescription notifications.</p>
          </div>
        )}
      </div>
      {isModalOpen && selectedNotification && (
        <div className="notif-modal-overlay">
          <div className="notif-modal-content">
            <span onClick={closeModal} className="notif-modal-back-button">
              <IoArrowBack />
            </span>
            <img src={selectedNotification.photo} alt={selectedNotification.sender} className="modal-sender-photo" />
            <h2 className="modal-sender-name">{selectedNotification.sender}</h2>
            <div className="modal-notification-time">
              {new Date(selectedNotification.timestamp).toLocaleString()}
            </div>
            <div className="message-bubble">
              <p className="notification-message">{selectedNotification.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
