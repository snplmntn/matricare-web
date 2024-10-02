import React, { useState, useEffect } from "react";
import { FaCameraRetro, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import "../../styles/settings/userprofile.css";

const UserProfile = ({ user }) => {
  // const [userId, setUserId] = useState("1");
  const token = getCookie("token");
  const userID = getCookie("userID");

  //user info
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  //user password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [error, setError] = useState("");

  //notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
        localStorage.setItem("profileImageUrl", reader.result); // Save to localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Regular expressions for password validation
    const hasUpperCase = /[A-Z]/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (showPasswordSettings) {
      // Password validation logic
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match");
        return;
      }

      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters long");
        return;
      }

      if (!hasUpperCase.test(newPassword)) {
        setError("New password must contain at least one uppercase letter");
        return;
      }

      if (!hasNumber.test(newPassword)) {
        setError("New password must contain at least one number");
        return;
      }

      if (!hasSpecialChar.test(newPassword)) {
        setError("New password must contain at least one special character");
        return;
      }

      if (newPassword === oldPassword) {
        setError("New password cannot be the same as the old password");
        return;
      }

      // Mock API call for password update
      // console.log("Updating password...");
      // console.log(`Old Password: ${oldPassword}`);
      // console.log(`New Password: ${newPassword}`);
      try {
        const response = await axios.put(
          `https://matricare-web.onrender.com/api/user?userId=${userID}`,
          {
            password: oldPassword,
            newPassword: newPassword,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }

      // Clear form fields and error message
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setShowPasswordSettings(false);
    } else {
      // Validate other fields if needed
      if (!fullname || !email || !phoneNumber || !address) {
        setError("All fields are required");
        return;
      }

      // Update profile information locally
      localStorage.setItem("userName", fullname);
      localStorage.setItem("email", email);
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("address", address);
      localStorage.setItem("profileImageUrl", profileImageUrl);

      // Exit editing mode
      setIsEditing(false);
      setError("");
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  //handle user ifo update
  const handleUserUpdate = async () => {
    const updatedUserForm = {
      fullName: fullname,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
    };

    try {
      const response = await axios.put(
        `https://matricare-web.onrender.com/api/user?userId=${userID}`,
        updatedUserForm,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    // location.reload();
  };

  //fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(
          `https://matricare-web.onrender.com/api/user?userId=${userID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // console.log(response);
        const data = response.data.other;
        setFullname(data.fullName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
        setAddress(data.address ? data.address : "");
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="user-profile-container">
      <Link to="/app" className="user-profile-back-btn">
        <FaArrowLeft className="user-profile-back-icon" />
      </Link>

      <div className="left-section">
        <h2>Settings</h2>
        <p>Customize view</p>
        <div className="settings-button-container">
          <button
            className="settings-btn"
            onClick={() => {
              setIsEditing(true);
              setShowPasswordSettings(false);
              setShowNotifications(false);
            }}
          >
            Edit Profile
          </button>
          <button
            className="settings-btn"
            onClick={() => {
              setIsEditing(false);
              setShowPasswordSettings(false);
              setShowNotifications(true);
            }}
          >
            Notifications
          </button>
          <button
            className="settings-btn"
            onClick={() => {
              setShowPasswordSettings(true);
              setIsEditing(false);
              setShowNotifications(false);
            }}
          >
            Password & Security
          </button>
        </div>
      </div>

      <div className="user-profile-right-container">
        <h2>Personal</h2>
        <p>Patient's Information</p>

        {!isEditing && !showPasswordSettings && !showNotifications && (
          <div className="user-profile-items-wrapper">
            <div className="user-profile-divider-wrapper">
              <span className="UP-divider-text-wrapper">Personal Details</span>
            </div>
            <div className="user-profile-item">
              <label>FULLNAME:</label>
              <p className="user-profile-detail">{fullname}</p>
            </div>
            <div className="user-profile-item">
              <label>EMAIL:</label>
              <p className="user-profile-detail">{email}</p>
            </div>
            <div className="user-profile-item">
              <label>PHONE NUMBER:</label>
              <p className="user-profile-detail">{phoneNumber}</p>
            </div>
            <div className="user-profile-item">
              <label>ADDRESS:</label>
              <p className="user-profile-detail">{address ? address : "N/A"}</p>
            </div>
          </div>
        )}

        {isEditing && (
          <>
            <div className="user-profile-divider">
              <span className="UP-divider-text">Personal Details</span>
            </div>
            <div className="user-profile-details">
              <form onSubmit={handleProfileUpdate}>
                <div className="user-profile-input-group">
                  <label htmlFor="userName">FULLNAME:</label>
                  <input
                    type="text"
                    id="userName"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="UserName"
                    className="user-profile-input"
                  />
                </div>
                <div className="user-profile-input-group">
                  <label htmlFor="email">EMAIL:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="user-profile-input"
                  />
                </div>
                <div className="user-profile-input-group">
                  <label htmlFor="phoneNumber">PHONE NUMBER:</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    className="user-profile-input"
                  />
                </div>
                <div className="user-profile-input-group">
                  <label htmlFor="address">ADDRESS:</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    className="user-profile-input"
                  />
                </div>

                <div className="user-profile-button-group">
                  <button
                    type="submit"
                    className="user-profile-save-btn"
                    onClick={handleUserUpdate}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="user-profile-cancel-btn"
                    onClick={() => {
                      setIsEditing(false);
                      setShowPasswordSettings(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {showPasswordSettings && (
          <>
            <div className="change-pass-divider">
              <span className="CP-divider-text">Password Settings</span>
            </div>
            <div className="CP-user-profile-details">
              <form onSubmit={handleProfileUpdate}>
                <div className="user-profile-input-group">
                  <label htmlFor="oldPassword">OLD PASSWORD:</label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Old Password"
                    className="user-profile-input"
                  />
                </div>
                <div className="user-profile-input-group">
                  <label htmlFor="newPassword">NEW PASSWORD:</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="user-profile-input"
                  />
                </div>
                <div className="user-profile-input-group">
                  <label htmlFor="confirmPassword">CONFIRM PASSWORD:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="user-profile-input"
                  />
                </div>

                {error && <p className="cp-error-message">{error}</p>}

                <div className="user-profile-button-group">
                  <button type="submit" className="user-profile-save-btn">
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="user-profile-cancel-btn"
                    onClick={() => {
                      setShowPasswordSettings(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {showNotifications && (
          <>
            <div className="user-profile-divider">
              <span className="UP-divider-text">Notification Preferences</span>
            </div>
            <div className="notification-settings">
              <div className="toggle-container">
                <label className="toggle">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={notificationPreferences.emailNotifications}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider"></span>
                  <span className="toggle-label">Email Notifications</span>
                </label>
              </div>
              <div className="toggle-container">
                <label className="toggle">
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={notificationPreferences.smsNotifications}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider"></span>
                  <span className="toggle-label">SMS Notifications</span>
                </label>
              </div>
              <div className="toggle-container">
                <label className="toggle">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={notificationPreferences.pushNotifications}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider"></span>
                  <span className="toggle-label">Push Notifications</span>
                </label>
              </div>
            </div>
            <div className="user-profile-button-group">
              <button
                type="button"
                className="user-profile-save-btn"
                onClick={() => {
                  localStorage.setItem(
                    "notificationPreferences",
                    JSON.stringify(notificationPreferences)
                  );
                  setShowNotifications(false);
                }}
              >
                Save Preferences
              </button>
              <button
                type="button"
                className="user-profile-cancel-btn"
                onClick={() => setShowNotifications(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        <div className="user-profile-left-container">
          <div className="user-profile-image-section">
            <h3 className="user-profile-image-title">My Profile Picture</h3>
            <p className="user-profile-image-description">
              Add a photo of you to be easily recognized
            </p>
            <img
              src={profileImageUrl || "/default-avatar.png"}
              alt=""
              className="user-profile-image-border"
            />
            <label
              htmlFor="profileImage"
              className="user-profile-upload-button"
            >
              <FaCameraRetro className="user-profile-upload-icon" />
            </label>
            <input
              type="file"
              id="profileImage"
              className="user-profile-image-input"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
