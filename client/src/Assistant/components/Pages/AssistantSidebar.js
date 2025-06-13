import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoHome,
  IoCalendar,
  IoLibrary,
  IoPerson,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import axios from "axios";
import { useCookies } from "react-cookie";
import "../../style/pages/assistantsidebar.css";

const AssistantSidebar = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = cookies.token;
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        headers: {
          Authorization: token,
        },
      });

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
      navigate("/");
      removeCookie("token");
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

  const menuItems = [
    {
      to: "/assistant-landing",
      icon: IoHome,
      label: "Home",
      title: "Home",
    },
    {
      to: "/user-management",
      icon: IoPerson,
      label: "Users",
      title: "User Management",
    },
    {
      to: "/appointment-assistant",
      icon: IoCalendar,
      label: "Appointments",
      title: "Appointment",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-2 left-1/2 -translate-x-1/2 z-[1001] p-2 bg-[#9a6cb4] text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <IoCloseOutline size={24} />
        ) : (
          <IoMenuOutline size={24} />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#9a6cb4] flex flex-col items-center pt-5 z-[1000] transition-transform duration-300 ease-in-out
          w-[200px]
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="mb-6 lg:mb-8">
          <img
            src="img/logo_consultant.png"
            alt="Logo"
            className="rounded-full w-32 h-32 lg:w-40 lg:h-40"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col w-full mt-4 lg:mt-[100px] lg:ml-5">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="w-4/5 py-5 text-white ml-4 cursor-pointer transition-colors duration-300 ease-in-out flex mb-4 lg:ml-16 lg:mb-5 text-2xl lg:text-3xl hover:text-[#7c459c]"
                title={item.title}
                onClick={closeMobileMenu}
              >
                <IconComponent />
                <span className="ml-3 text-base lg:hidden">{item.label}</span>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="inline-flex items-center bg-transparent border-none text-white cursor-pointer px-4 py-3 lg:px-[30px] lg:py-[15px] text-base lg:text-lg ml-2 lg:ml-2.5 rounded-[25px] mb-4 mt-32 lg:mt-[150px] hover:bg-white/10 transition-colors duration-300"
          >
            <IoLogOutOutline className="mr-2.5 text-white" />
            <span className="lg:block">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block w-[200px] flex-shrink-0" />
    </>
  );
};

export default AssistantSidebar;
