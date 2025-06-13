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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [prcIdFile, setPrcIdFile] = useState([]);
  const [isVerified, setIsVerified] = useState(false);

  //user password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
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

  const handleVerify = () => {
    navigate("/prc-verification");
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
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSettings(false);
    } else {
      if (!fullname || !email || !phoneNumber || !address) {
        setError("All fields are required");
        return;
      }
      localStorage.setItem("userName", fullname);
      localStorage.setItem("email", email);
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("address", address);
      localStorage.setItem("partner", partner);
      localStorage.setItem("number", Number);
      setIsEditing(false);
    }
  };

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
        localStorage.removeItem("userData");
        localStorage.setItem("userData", JSON.stringify(parsedData));
      }
      setIsEditing(false);
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
    <div className="relative flex w-full min-h-screen bg-white flex-row items-start gap-5 overflow-visible max-[900px]:flex-col max-[900px]:gap-2">
      {/* Purple top bar */}
      <div className="absolute top-0 left-0 w-full h-[19vh] bg-[#9a6cb4] z-0"></div>

      {/* Sidebar */}
      <div className="relative bg-white h-screen w-[18%] min-w-[220px] border-2 border-[#fbfbfb] rounded-[5px] flex flex-col items-center shadow-md z-10 max-[900px]:w-full max-[900px]:h-auto max-[900px]:flex-row max-[900px]:justify-between max-[900px]:py-2">
        <button
          onClick={handleBackButton}
          className="fixed top-5 left-5 text-[#042440] bg-transparent border-none rounded px-5 py-2 cursor-pointer text-[24px] flex items-center hover:text-[#7c459c] z-20 max-[900px]:static max-[900px]:ml-2"
        >
          <FaArrowLeft className="mr-2" />
        </button>
        <div className="mt-[70px] max-[900px]:mt-0">
          <h2 className="text-[24px] text-[#042440] font-bold max-[900px]:ml-2">
            Settings
          </h2>
          <p className="mt-2 text-[16px] text-[#042440d9] max-[900px]:ml-2">
            Customize view
          </p>
        </div>
        <div className="mt-5 w-full max-[900px]:mt-0 max-[900px]:ml-2">
          <button
            className="block w-full py-4 px-12 mb-2 bg-transparent text-[#042440] border-none cursor-pointer text-[16px] text-left hover:bg-[#e8e8e8] hover:border-l-4 hover:border-[#E39FA9] flex items-center"
            onClick={() => {
              setIsEditing(true);
              setShowPasswordSettings(false);
              setShowBabyDetails(false);
            }}
          >
            <FcSettings className="text-[24px] mr-2" />
            Edit Profile
          </button>
          <button
            className="block w-full py-4 px-12 mb-2 bg-transparent text-[#042440] border-none cursor-pointer text-[16px] text-left hover:bg-[#e8e8e8] hover:border-l-4 hover:border-[#E39FA9] flex items-center"
            onClick={() => {
              setShowPasswordSettings(true);
              setIsEditing(false);
              setShowBabyDetails(false);
            }}
          >
            <FcLock className="text-[24px] mr-2" />
            Password & Security
          </button>
          {role === "Patient" && (
            <button
              className="block w-full py-4 px-12 mb-2 bg-transparent text-[#042440] border-none cursor-pointer text-[16px] text-left hover:bg-[#e8e8e8] hover:border-l-4 hover:border-[#E39FA9] flex items-center"
              onClick={() => {
                setShowBabyDetails(true);
                setIsEditing(false);
                setShowPasswordSettings(false);
              }}
            >
              <FcDecision className="text-[24px] mr-2" />
              Set Baby's Details
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col bg-white w-[40%] min-w-[320px] max-h-[90vh] overflow-auto mt-[50px] mb-[50px] shadow-md z-10 ml-[100px] p-5 rounded-[5px] max-[900px]:w-full max-[900px]:ml-0 max-[900px]:mt-2 max-[900px]:mb-2">
        <h2 className="text-left mt-0 text-[24px] text-[#042440] ml-5">
          Personal
        </h2>
        <p className="text-left mt-2 text-[16px] text-[#042440d9] ml-5">
          Patient's Information
        </p>

        {/* View Mode */}
        {!isEditing && !showPasswordSettings && !showBabyDetails && (
          <div className="mt-2">
            <div className="relative w-full my-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[16px] text-[#9a6cb4] font-semibold z-10">
                Personal Details
              </div>
              <div className="w-full border-t-2 border-[#9a6cb4]"></div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label className="font-bold w-[150px]">Full Name:</label>
                <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                  {fullname}
                </p>
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label className="font-bold w-[150px]">Email:</label>
                <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                  {email}
                </p>
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label className="font-bold w-[150px]">Phone Number:</label>
                <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                  {phoneNumber}
                </p>
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label className="font-bold w-[150px]">Birthdate:</label>
                <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                  {birthday ? formatDate(birthday) : "N/A"}
                </p>
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label className="font-bold w-[150px]">Address:</label>
                <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                  {address ? address : "N/A"}
                </p>
              </div>
              {role === "Ob-gyne Specialist" && (
                <>
                  <div className="flex items-center   w-full max-[600px]:ml-2">
                    <label className="font-bold w-[150px]">
                      Verified Status:
                    </label>
                    <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                      {!prcIdFile
                        ? "No ID Found"
                        : isVerified
                        ? "Verified"
                        : "In Progress"}
                    </p>
                  </div>
                  <div className="flex items-center   w-full max-[600px]:ml-2">
                    <label className="font-bold w-[150px]">PRC ID:</label>
                    {prcIdFile && (
                      <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                        <a
                          href={prcIdFile[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      </p>
                    )}
                  </div>
                  {prcIdFile && (
                    <div className="flex items-center   w-full max-[600px]:ml-2">
                      <label className="font-bold w-[150px]">
                        Selfie with PRC ID:
                      </label>
                      <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                        <a
                          href={prcIdFile[1]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      </p>
                    </div>
                  )}
                </>
              )}
              {role === "Patient" && (
                <>
                  <div className="flex items-center   w-full max-[600px]:ml-2">
                    <label className="font-bold w-[150px]">
                      Husband / Partner :
                    </label>
                    <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                      {partner ? partner : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center   w-full max-[600px]:ml-2">
                    <label className="font-bold w-[150px]">Phone Number:</label>
                    <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                      {number ? number : "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <>
            <div className="relative w-full my-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[16px] text-[#9a6cb4] font-semibold z-10">
                Personal Details
              </div>
              <div className="w-full border-t-2 border-[#9a6cb4]"></div>
            </div>
            <form onSubmit={handleUserUpdate} className="flex flex-col gap-4">
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label htmlFor="userName" className="font-bold w-[150px]">
                  Full Name:
                </label>
                <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                  {fullname}
                </p>
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label htmlFor="email" className="font-bold w-[150px]">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label htmlFor="phoneNumber" className="font-bold w-[150px]">
                  Phone Number:
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label htmlFor="birthday" className="font-bold w-[150px]">
                  Birthday:
                </label>
                <input
                  type="date"
                  id="birthday"
                  value={
                    birthday && new Date(birthday).toISOString().split("T")[0]
                  }
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="Select your birthday"
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label htmlFor="address" className="font-bold w-[150px]">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              {role === "Ob-gyne Specialist" && (
                <>
                  <div className="flex items-center   w-full max-[600px]:ml-2">
                    <label
                      htmlFor="verifiedStatus"
                      className="font-bold w-[150px]"
                    >
                      Verified Status:
                    </label>
                    <p className="flex-1 p-3 border border-[#042440] bg-white rounded">
                      {!prcIdFile
                        ? "No ID Found"
                        : isVerified
                        ? "Verified"
                        : "In Progress"}
                    </p>
                  </div>
                  {!isVerified && (
                    <div className="flex items-center   w-full max-[600px]:ml-2">
                      <p className="text-[14px] text-[#042440] font-bold mr-2">
                        Please complete your account verification:
                      </p>
                      <button
                        className="bg-[#9a6cb4] text-white px-6 py-2 rounded-[20px] ml-2 hover:bg-[#E39FA9]"
                        onClick={handleVerify}
                        type="button"
                      >
                        VERIFY
                      </button>
                    </div>
                  )}
                </>
              )}
              {role === "Patient" && (
                <>
                  <div className="flex items-center   w-full max-[600px]:ml-2">
                    <label htmlFor="partner" className="font-bold w-[150px]">
                      Husband / Partner:
                    </label>
                    <input
                      type="text"
                      id="partner"
                      value={partner}
                      onChange={(e) => setPartner(e.target.value)}
                      placeholder="Partner"
                      className="flex-1 p-3 border border-[#042440] bg-white rounded"
                    />
                  </div>
                  <div className="flex items-center   w-full max-[600px]:ml-2">
                    <label htmlFor="number" className="font-bold w-[150px]">
                      Phone Number:
                    </label>
                    <input
                      type="text"
                      id="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Number"
                      className="flex-1 p-3 border border-[#042440] bg-white rounded"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="submit"
                  className="bg-[#9a6cb4] text-white px-8 py-2 rounded-[8px] text-[18px] w-[150px] hover:bg-[#7c459c]"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-[#e39fa9] text-white px-8 py-2 rounded-[8px] text-[18px] w-[100px] hover:bg-[#7c459c]"
                  onClick={() => {
                    setIsEditing(false);
                    setShowPasswordSettings(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        {/* Password Settings */}
        {showPasswordSettings && (
          <>
            <div className="relative w-full my-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[16px] text-[#9a6cb4] font-semibold z-10">
                Password Settings
              </div>
              <div className="w-full border-t-2 border-[#9a6cb4]"></div>
            </div>
            <form
              onSubmit={handleProfileUpdate}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label htmlFor="oldPassword" className="font-bold w-[150px]">
                  OLD PASSWORD:
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old Password"
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label htmlFor="newPassword" className="font-bold w-[150px]">
                  NEW PASSWORD:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label
                  htmlFor="confirmPassword"
                  className="font-bold w-[150px]"
                >
                  CONFIRM PASSWORD:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="submit"
                  className="bg-[#9a6cb4] text-white px-8 py-2 rounded-[8px] text-[18px] w-[150px] hover:bg-[#7c459c]"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-[#e39fa9] text-white px-8 py-2 rounded-[8px] text-[18px] w-[100px] hover:bg-[#7c459c]"
                  onClick={() => {
                    setShowPasswordSettings(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        {/* Baby Details */}
        {showBabyDetails && (
          <>
            <div className="relative w-full my-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[16px] text-[#9a6cb4] font-semibold z-10">
                Baby's Details
              </div>
              <div className="w-full border-t-2 border-[#9a6cb4]"></div>
            </div>
            <form
              onSubmit={handleProfileUpdate}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label htmlFor="babyName" className="font-bold w-[150px]">
                  Baby's Name:
                </label>
                <input
                  type="text"
                  id="babyName"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder="Enter Baby's Name"
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              <div className="flex items-center   w-full max-[600px]:ml-2">
                <label
                  htmlFor="lastMenstrualPeriod"
                  className="font-bold w-[150px]"
                >
                  Date of Last Menstrual Period:
                </label>
                <input
                  type="date"
                  id="lastMenstrualPeriod"
                  value={lastMenstrualPeriod}
                  onChange={(e) => setLastMenstrualPeriod(e.target.value)}
                  className="flex-1 p-3 border border-[#042440] bg-white rounded"
                />
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="submit"
                  className="bg-[#9a6cb4] text-white px-8 py-2 rounded-[8px] text-[18px] w-[150px] hover:bg-[#7c459c]"
                  onClick={handleUserUpdate}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-[#e39fa9] text-white px-8 py-2 rounded-[8px] text-[18px] w-[100px] hover:bg-[#7c459c]"
                  onClick={() => {
                    setShowBabyDetails(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        {/* Profile Picture Floating Card */}
        <div
          className="fixed top-[50px] right-[5vw] bg-white shadow-md rounded-[5px] w-[350px] h-[400px] flex flex-col items-center z-20
  max-[900px]:static max-[900px]:w-full max-[900px]:h-auto max-[900px]:mt-6"
        >
          <h3 className="text-[24px] text-[#042440] mb-2">
            My Profile Picture
          </h3>
          <p className="text-[16px] text-[#042440] mb-2 px-4 text-center">
            Add a photo of you to be easily recognized
          </p>
          <div className="relative flex flex-col items-center">
            <img
              src={profileImage}
              alt=""
              className="w-[250px] h-[250px] border-2 border-[#042440] rounded-full object-cover mt-2"
            />
            {isEditing && (
              <>
                <label
                  htmlFor="profileImage"
                  className="absolute top-[120px] left-[260px] bg-transparent p-2 rounded-full cursor-pointer flex items-center justify-center text-[#042440] text-[30px] hover:text-[#E39FA9] z-10"
                >
                  <FcOldTimeCamera />
                </label>
                <input
                  type="file"
                  id="profileImage"
                  className="hidden"
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
