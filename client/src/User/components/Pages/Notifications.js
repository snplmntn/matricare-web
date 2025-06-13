import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoArrowBackSharp, IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
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

    if (!notification.readBy.includes(userID)) {
      try {
        await axios.put(
          `${API_URL}/user/n?id=${notification._id}&userId=${userID}`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // Update the notification status locally
        setNotification((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === notification._id
              ? { ...notif, readBy: [notif.readBy, userID] }
              : notif
          )
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
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
    <div className="p-4 lg:p-5 relative bg-white h-screen">
      {/* Back Button */}
      <div
        onClick={handleBackButton}
        className="absolute top-4 left-4 lg:top-[45px] lg:left-[70px] text-[#7c459c] text-2xl lg:text-3xl cursor-pointer z-10 hover:text-[#e39fa9] transition-colors"
      >
        <IoArrowBackSharp />
      </div>

      {/* Notifications Section */}
      <div className="border-none rounded-lg">
        {/* Title */}
        <h2 className="text-left text-xl lg:text-[2rem] mb-4 lg:mb-5 ml-12 lg:ml-[120px] text-[#7c459c] mt-12 lg:mt-5">
          Notifications
        </h2>

        {/* Divider */}
        <hr className="border-none border-t-2 border-black/20 mx-4 lg:mx-[30px] mb-4 lg:mb-5" />

        {/* Notifications List or Empty State */}
        {notification && notification.length > 0 ? (
          <div className="flex flex-col gap-1 lg:gap-[2px] ml-4 lg:ml-[120px]">
            {notification.map((notification, index) => (
              <div
                key={index}
                className={`border border-[#e0e0e0] rounded-lg p-4 lg:p-5 relative w-full lg:w-[90%] m-1 lg:m-[5px] cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.readBy.includes(userID)
                    ? "bg-[#9a6cb46c]"
                    : "bg-white"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start">
                  {/* Sender Photo */}
                  <img
                    src={
                      notification.senderName === "MatriCare"
                        ? "img/LOGO.png"
                        : notification.senderId &&
                          notification.senderId.profilePicture
                        ? notification.senderId.profilePicture
                        : "img/profilePicture.jpg"
                    }
                    alt={notification.senderName}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full mr-2 lg:mr-2.5 object-cover flex-shrink-0"
                  />

                  {/* Notification Content */}
                  <div className="flex-grow pl-2 lg:pl-2.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                      <strong className="text-base lg:text-xl text-[#333]">
                        {notification.senderName}
                      </strong>
                      {notification.senderPhoneNumber && (
                        <span className="text-sm lg:text-[0.9rem] text-[#666] ml-1">
                          ({notification.senderPhoneNumber})
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm lg:text-[1rem] text-[#444] break-words">
                      {notification.message}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="text-xs lg:text-[0.9rem] text-[#040404] flex-shrink-0 ml-2">
                    {formatDate(notification.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center text-[#7c459c] text-lg lg:text-xl mt-20 lg:mt-[150px]">
            <FaCheckCircle className="mt-4 lg:mt-5 text-6xl lg:text-[7rem] text-[#7c459c] mb-4 lg:mb-5 mx-auto" />
            <h1 className="text-center text-[#e39fa9] text-xl lg:text-[2rem] mb-2 lg:mb-2.5">
              You're all caught up
            </h1>
            <p className="text-center text-[#7c459c] text-lg lg:text-xl italic px-4">
              Come back later for Reminders, Appointment Confirmation,
              <br className="hidden lg:block" /> and your Prescription
              notifications.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4">
          <div className="bg-white p-4 lg:p-5 rounded-t-2xl lg:rounded-t-[20px] w-full max-w-md lg:max-w-[500px] relative lg:mt-[370px] h-[90vh] lg:h-[500px] lg:ml-0 xl:ml-[1200px] overflow-y-auto">
            {/* Close Button */}
            <span
              onClick={closeModal}
              className="bg-transparent text-[#040404] border-none text-xl lg:text-[25px] absolute left-4 lg:left-5 top-4 lg:top-5 cursor-pointer font-bold hover:text-[#7c459c] transition-colors"
            >
              <IoArrowBack />
            </span>

            {/* Modal Content */}
            <div className="pt-12 lg:pt-16">
              {/* Sender Photo */}
              <img
                src={
                  selectedNotification.senderName === "MatriCare"
                    ? "img/LOGO.png"
                    : selectedNotification.senderId &&
                      selectedNotification.senderId.profilePicture
                    ? selectedNotification.senderId.profilePicture
                    : "img/profilePicture.jpg"
                }
                alt={selectedNotification.senderName}
                className="block mx-auto rounded-full w-16 h-16 lg:w-20 lg:h-20 object-cover"
              />

              {/* Sender Name */}
              <h2 className="text-center mx-0 my-2 lg:my-2.5 mb-4 lg:mb-5 text-lg lg:text-xl font-semibold">
                {selectedNotification.senderName}
              </h2>

              {/* Time */}
              <div className="text-center mb-0 lg:-mb-2.5 text-xs text-[#555] mt-6 lg:mt-[30px]">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl lg:rounded-[15px] p-3 lg:p-[15px] mt-4 lg:mt-5 rounded-br-none lg:rounded-br-none border border-[#e0e0e0] ${
                  !selectedNotification.readBy.includes(userID)
                    ? "bg-[#9a6cb46c]"
                    : "bg-white"
                }`}
              >
                <p className="text-sm lg:text-base text-[#444] break-words">
                  {selectedNotification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
