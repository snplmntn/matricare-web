import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faHome,
  faBookmark,
  faBars,
  faTimes,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";

const LibrarySidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user, setUser] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = cookies.token;

  const handleReload = (e) => {
    if (window.location.pathname === "/library") {
      e.preventDefault();
      window.location.reload();
    }
  };

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  return (
    <>
      {/* Mobile Navigation Header */}
      <div className="md:hidden bg-[#9a6cb4] p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-[1001]">
        <div className="text-white text-xl font-bold">MatriCare.</div>
        <button
          onClick={toggleMobileMenu}
          className="text-white text-xl focus:outline-none"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bottom-0 bg-[#9a6cb4] z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-20 px-6">
          {/* Mobile Profile Section */}
          <div className="bg-white/90 rounded-[30px] p-6 mb-8 flex items-center">
            <img
              src={
                user && user.profilePicture
                  ? user.profilePicture
                  : "/img/profilePicture.jpg"
              }
              alt="Profile Picture"
              className="w-16 h-16 rounded-[15px] object-cover mr-4"
            />
            <div>
              <p className="text-sm text-[#666666] mb-1">Welcome Back,</p>
              <p className="text-base font-bold text-[#333333]">
                {user && user.name?.split(" ")[0]}
              </p>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <ul className="space-y-4">
            <li>
              <Link
                to="/app"
                onClick={closeMobileMenu}
                className="flex items-center text-white py-4 px-6 rounded-[25px] hover:bg-[#e39fa9] transition-all duration-300"
              >
                <FontAwesomeIcon icon={faHome} className="mr-4 text-white" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/savedarticle"
                onClick={closeMobileMenu}
                className="flex items-center text-white py-4 px-6 rounded-[25px] hover:bg-[#e39fa9] transition-all duration-300"
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="mr-4 text-white"
                />
                Saved Articles
              </Link>
            </li>
            <li>
              <Link
                to="/belly-talk"
                onClick={closeMobileMenu}
                className="flex items-center text-white py-4 px-6 rounded-[25px] hover:bg-[#e39fa9] transition-all duration-300"
              >
                <FontAwesomeIcon icon={faMessage} className="mr-4 text-white" />
                BellyTalk
              </Link>
            </li>
          </ul>

          {/* Mobile Logout */}
          <div className="mt-8">
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="flex items-center text-white py-4 px-6 rounded-[25px] hover:bg-[#e39fa9] transition-all duration-300 w-full"
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="mr-4 text-white"
              />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation (Original) */}
      <nav className="hidden md:block w-[180px] bg-[#9a6cb4] p-5 fixed top-0 left-0 bottom-0 h-screen z-10">
        {/* Profile Section */}
        <div className="w-[300px] h-[300px] p-2.5 bg-white/90 rounded-[50px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] flex flex-col items-center ml-[-150px] mt-[50px]">
          <img
            src={
              user && user.profilePicture
                ? user.profilePicture
                : "/img/profilePicture.jpg"
            }
            alt="Profile Picture"
            className="w-[100px] h-[100px] rounded-[25px] object-cover mb-5 mt-[50px] ml-[90px]"
          />
          <div className="text-left ml-[90px]">
            <p className="text-[16px] text-[#666666] m-0 mb-2.5">
              Welcome <br />
              Back,
            </p>
            <p className="text-[16px] font-bold m-0 text-[#333333]">
              {user && user.name?.split(" ")[0]}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col w-full mt-[60px]">
          <ul className="list-none text-xl flex-1 mt-[60px]">
            <li className="inline-flex items-center bg-none border-none text-inherit cursor-pointer py-[15px] px-[30px] text-[16px] ml-[-20px] rounded-[25px] mb-[15px] text-[#042440] transition-all duration-300">
              <Link
                to="/app"
                className="flex items-center text-white ml-2.5 no-underline hover:bg-[#e39fa9] hover:text-white hover:py-[15px] hover:px-[25px] hover:ml-[-10px] hover:rounded-[25px] transition-all duration-300"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2.5 text-white" />
                Home
              </Link>
            </li>
            <li className="inline-flex items-center bg-none border-none text-inherit cursor-pointer py-[15px] px-[30px] text-[16px] ml-[-20px] rounded-[25px] mb-[15px] text-[#042440] transition-all duration-300">
              <Link
                to="/savedarticle"
                className="flex items-center text-white ml-2.5 no-underline hover:bg-[#e39fa9] hover:text-white hover:py-[15px] hover:px-[25px] hover:ml-[-10px] hover:rounded-[25px] transition-all duration-300"
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="mr-2.5 text-white"
                />
                Saved Articles
              </Link>
            </li>
            <li className="inline-flex items-center bg-none border-none text-inherit cursor-pointer py-[15px] px-[30px] text-[16px] ml-[-20px] rounded-[25px] mb-[15px] text-[#042440] transition-all duration-300">
              <Link
                to="/belly-talk"
                className="flex items-center text-white ml-2.5 no-underline hover:bg-[#e39fa9] hover:text-white hover:py-[15px] hover:px-[25px] hover:ml-[-10px] hover:rounded-[25px] transition-all duration-300"
              >
                <FontAwesomeIcon
                  icon={faMessage}
                  className="mr-2.5 text-white"
                />
                BellyTalk
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout Section */}
        <div className="mt-auto" onClick={handleLogout}>
          <span className="inline-flex items-center bg-none border-none text-inherit cursor-pointer py-[15px] px-[30px] text-[18px] ml-[-7px] rounded-[25px] mt-[40px] text-white transition-all duration-300 hover:bg-[#e39fa9] hover:text-white hover:py-[15px] hover:px-[25px] hover:ml-[10px] hover:rounded-[25px]">
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="mr-2.5 text-white"
            />
            Logout
          </span>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default LibrarySidebar;
