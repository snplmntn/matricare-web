import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  FcLock,
  FcSettings,
  FcAdvertising,
  FcOldTimeCamera,
  FcDecision,
} from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import "../../styles/settings/userprofile.css";

const UserProfile = ({ user }) => {
  let { name, username, role } = user.current;
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const token = getCookie("token");
  const userID = getCookie("userID");

  //user info
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [partner, setPartner] = useState("");
  const [number, setNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // const [profilePicture, setProfilePicture] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [prcIdFile, setPrcIdFile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

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
  const [isEditingBabyDetails, setIsEditingBabyDetails] = useState(false);
  const [showBabyDetails, setShowBabyDetails] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState("");

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleUploadPrcId = async () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append("document", uploadedFile);

      try {
        const response = await axios.post(
          `${API_URL}/upload/id?userId=${userID}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data.documentLink;
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUploadProfilePicture = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("picture", selectedImage);

      try {
        const response = await axios.post(
          `${API_URL}/upload/p?userId=${userID}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.pictureLink;
      } catch (err) {
        console.error(err);
      }
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
        alert("New passwords do not match");
        return;
      }

      if (newPassword.length < 8) {
        alert("New password must be at least 8 characters long");
        return;
      }

      if (!hasUpperCase.test(newPassword)) {
        alert("New password must contain at least one uppercase letter");
        return;
      }

      if (!hasNumber.test(newPassword)) {
        alert("New password must contain at least one number");
        return;
      }

      if (!hasSpecialChar.test(newPassword)) {
        alert("New password must contain at least one special character");
        return;
      }

      if (newPassword === oldPassword) {
        alert("New password cannot be the same as the old password");
        return;
      }

      try {
        await axios.put(
          `${API_URL}/user?userId=${userID}`,
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
        alert("Password updated successfully");
      } catch (error) {
        console.error(error);
      }

      // Clear form fields and error message
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
      localStorage.setItem("partner", partner);
      localStorage.setItem("number", Number);

      // Exit editing mode
      setIsEditing(false);
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  //handle user ifo update
  const handleUserUpdate = async (e) => {
    e.preventDefault();

    let profilePicture, prcIdFile;
    if (selectedImage && !profilePicture) {
      profilePicture = await handleUploadProfilePicture();
    }

    if (!profilePicture && selectedImage)
      return alert("Image upload failed. Please try again.");

    if (uploadedFile && !prcIdFile) prcIdFile = await handleUploadPrcId();

    if (!prcIdFile && uploadedFile) {
      return alert("ID upload failed. Please try again.");
    }

    const updatedUserForm = {};
    if (fullname !== user.fullName) updatedUserForm.fullName = fullname;
    if (profilePicture !== user.profilePicture)
      updatedUserForm.profilePicture = profilePicture;

    if (prcIdFile !== user.prcId) updatedUserForm.prcId = prcIdFile;

    if (birthday !== user.birthdate) {
      const birthdate = new Date(birthday);
      updatedUserForm.birthdate = birthdate;
    }
    if (email !== user.email) updatedUserForm.email = email;
    if (phoneNumber !== user.phoneNumber)
      updatedUserForm.phoneNumber = phoneNumber;
    if (address !== user.address) updatedUserForm.address = address;
    if (partner !== user.husband) updatedUserForm.husband = partner;
    if (number !== user.husbandNumber) updatedUserForm.husbandNumber = number;

    if (babyName !== user.babyName) updatedUserForm.babyName = babyName;
    if (lastMenstrualPeriod !== user.pregnancyStartDate) {
      const pregnancyStartDate = new Date(lastMenstrualPeriod);
      updatedUserForm.pregnancyStartDate = pregnancyStartDate;
    }

    try {
      await axios.put(`${API_URL}/user?userId=${userID}`, updatedUserForm, {
        headers: {
          Authorization: token,
        },
      });
      if (fullname || birthday || profilePicture) {
        const userData = localStorage.getItem("userData");
        const parsedData = JSON.parse(userData);

        if (fullname) {
          parsedData.fullName = fullname;
        }

        if (profilePicture) {
          parsedData.profilePicture = profilePicture;
        }

        if (updatedUserForm.prcId) setPrcIdFile(updatedUserForm.prcId);

        localStorage.removeItem("userData");
        localStorage.setItem("userData", JSON.stringify(parsedData));
      }
      setIsEditing(false);
      setIsEditingBabyDetails(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  //fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`${API_URL}/user?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
        const data = response.data.other;
        setBirthday(data.birthdate);
        setFullname(data.fullName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
        setPartner(data.husband);
        setNumber(data.husbandNumber);
        setAddress(data.address ? data.address : "");
        setProfileImage(data.profilePicture ? data.profilePicture : "");
        setProfileImage(data.profilePicture ? data.profilePicture : "");
        setBabyName(data.babyName ? data.babyName : "");
        setLastMenstrualPeriod(
          data.pregnancyStartDate ? data.pregnancyStartDate : ""
        );
        setIsVerified(data.verified);
        setPrcIdFile(data.prcId ? data.prcId : null);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, []);

  const handleBackButton = () => {
    navigate(-1);
  };

  return (
    <div className="user-profile-container">
      <div className="left-section">
        <div onClick={handleBackButton} className="user-profile-back-btn">
          <FaArrowLeft className="user-profile-back-icon" />
        </div>
        <h2>Settings</h2>
        <p>Customize view</p>
        <div className="settings-button-container">
          <button
            className="settings-btn"
            onClick={() => {
              setIsEditing(true);
              setShowPasswordSettings(false);
              setShowNotifications(false);
              setShowBabyDetails(false);
            }}
          >
            <FcSettings className="UP-icon" />
            Edit Profile
          </button>
          <button
            className="settings-btn"
            onClick={() => {
              setIsEditing(false);
              setShowPasswordSettings(false);
              setShowNotifications(true);
              setShowBabyDetails(false);
            }}
          >
            <FcAdvertising className="UP-icon" />
            Notifications
          </button>
          <button
            className="settings-btn"
            onClick={() => {
              setShowPasswordSettings(true);
              setIsEditing(false);
              setShowNotifications(false);
              setShowBabyDetails(false);
            }}
          >
            <FcLock className="UP-icon" />
            Password & Security
          </button>
          {role === "Patient" && (
            <button
              className="settings-btn"
              onClick={() => {
                setShowBabyDetails(true);
                setIsEditing(false);
                setShowPasswordSettings(false);
                setShowNotifications(false);
                setIsEditingBabyDetails(true);
              }}
            >
              <FcDecision className="UP-icon" />
              Set Baby's Details
            </button>
          )}
        </div>
      </div>

      <div className="user-profile-right-container">
        <h2>Personal</h2>
        <p>Patient's Information</p>

        {!isEditing &&
          !showPasswordSettings &&
          !showNotifications &&
          !showBabyDetails && (
            <div className="user-profile-items-wrapper">
              <div className="user-profile-divider-wrapper">
                <span className="UP-divider-text-wrapper">
                  Personal Details
                </span>
              </div>
              <div className="user-profile-item">
                <label>Full Name:</label>
                <p className="user-profile-detail">{fullname}</p>
              </div>
              <div className="user-profile-item">
                <label>Email:</label>
                <p className="user-profile-detail">{email}</p>
              </div>
              <div className="user-profile-item">
                <label>Phone Number:</label>
                <p className="user-profile-detail">{phoneNumber}</p>
              </div>
              <div className="user-profile-item">
                <label>Birthdate:</label>
                <p className="user-profile-detail">
                  {birthday ? formatDate(birthday) : "N/A"}
                </p>
              </div>
              <div className="user-profile-item">
                <label>Address:</label>
                <p className="user-profile-detail">
                  {address ? address : "N/A"}
                </p>
              </div>
              {role === "Ob-gyne Specialist" && (
                <>
                  <div className="user-profile-item">
                    <label>Verified Status:</label>
                    <p className="user-profile-detail">
                      {!prcIdFile
                        ? "No ID Found"
                        : isVerified
                        ? "Verified"
                        : "In Progress"}
                    </p>
                  </div>
                  <div className="user-profile-item">
                    <label>PRC ID:</label>
                    {prcIdFile && (
                      <p className="user-profile-detail">
                        <a
                          href={prcIdFile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      </p>
                    )}
                  </div>
                </>
              )}
              {role === "Patient" && (
                <>
                  <div className="user-profile-item">
                    <label>Husband / Partner :</label>
                    <p className="user-profile-detail">
                      {partner ? partner : "N/A"}
                    </p>
                  </div>
                  <div className="user-profile-item">
                    <label>Phone Number:</label>
                    <p className="user-profile-detail">
                      {number ? number : "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

        {isEditing && (
          <>
            <div className="user-profile-divider">
              <span className="UP-divider-text">Personal Details</span>
            </div>
            <div className="user-profile-details">
              <form onSubmit={handleUserUpdate}>
                <div className="user-profile-input-group">
                  <label htmlFor="userName">Full Name:</label>
                  <p className="user-profile-input verified-status">
                    {fullname}
                  </p>
                </div>
                <div className="user-profile-input-group">
                  <label htmlFor="email">Email:</label>
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
                  <label htmlFor="phoneNumber">Phone Number:</label>
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
                  <label htmlFor="birthday">Birthday:</label>
                  <input
                    type="date"
                    id="birthday"
                    value={
                      birthday && new Date(birthday).toISOString().split("T")[0]
                    }
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="Select your birthday"
                    className="user-profile-input"
                  />
                </div>
                <div className="user-profile-input-group">
                  <label htmlFor="address">Address:</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    className="user-profile-input"
                  />
                </div>
                {role === "Ob-gyne Specialist" && (
                  <>
                    <div className="user-profile-input-group">
                      <label htmlFor="verifiedStatus">Verified Status:</label>
                      <p
                        id="verifiedStatus"
                        className="user-profile-input verified-status"
                      >
                        {!prcIdFile
                          ? "No ID Found"
                          : isVerified
                          ? "Verified"
                          : "In Progress"}
                      </p>
                    </div>
                    <div className="user-profile-input-group">
                      <label htmlFor="prcId">PRC ID:</label>
                      {!prcIdFile || !isVerified ? (
                        <input
                          type="file"
                          id="prcId"
                          accept="image/*,application/pdf"
                          onChange={(e) => setUploadedFile(e.target.files[0])}
                          className="user-profile-input"
                        />
                      ) : (
                        isVerified && (
                          <p className="user-profile-input verified-status">
                            <a
                              href={prcIdFile}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View File
                            </a>
                          </p>
                        )
                      )}
                      {uploadedFile && (
                        <>
                          <p>{uploadedFile.name}</p>
                        </>
                      )}
                    </div>
                  </>
                )}
                {role === "Patient" && (
                  <>
                    <div className="user-profile-input-group">
                      <label htmlFor="address">Husband / Partner:</label>
                      <input
                        type="text"
                        id="partner"
                        value={partner}
                        onChange={(e) => setPartner(e.target.value)}
                        placeholder="Partner"
                        className="user-profile-input"
                      />
                    </div>
                    <div className="user-profile-input-group">
                      <label htmlFor="phoneNumber">Phone Number:</label>
                      <input
                        type="text"
                        id="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Number"
                        className="user-profile-input"
                      />
                    </div>
                  </>
                )}

                <div className="user-profile-button-group">
                  <button type="submit" className="user-profile-save-btn">
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
                <div className="user-profile-button-group">
                  <button type="submit" className="user-profile-save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="user-profile-cancel-btn"
                    onClick={() => {
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
                Save
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

        {showBabyDetails && (
          <>
            <div className="user-profile-divider">
              <span className="UP-divider-text">Baby's Details</span>
            </div>
            <div className="user-profile-details">
              <form onSubmit={handleProfileUpdate}>
                <div className="user-profile-input-group">
                  <label htmlFor="babyName">Baby's Name:</label>
                  <input
                    type="text"
                    id="babyName"
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    placeholder="Enter Baby's Name"
                    className="user-profile-input"
                  />
                </div>
                <div className="user-profile-input-group">
                  <label htmlFor="lastMenstrualPeriod">
                    Date of Last Menstrual Period:
                  </label>
                  <input
                    type="date"
                    id="lastMenstrualPeriod"
                    value={
                      lastMenstrualPeriod &&
                      new Date(lastMenstrualPeriod).toISOString().split("T")[0]
                    }
                    onChange={(e) => setLastMenstrualPeriod(e.target.value)}
                    className="user-profile-input"
                  />
                </div>

                {isEditingBabyDetails && (
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
                        setIsEditingBabyDetails(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
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
              src={profileImage}
              alt=""
              className="user-profile-image-border"
            />

            {isEditing && (
              <>
                <label
                  htmlFor="profileImage"
                  className="user-profile-upload-button"
                >
                  <FcOldTimeCamera className="user-profile-upload-icon" />
                </label>
                <input
                  type="file"
                  id="profileImage"
                  className="user-profile-image-input"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
