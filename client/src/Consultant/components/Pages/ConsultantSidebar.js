import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoHome,
  IoCalendar,
  IoFolderOpen,
  IoChatbubbles,
  IoBarChart,
  IoLogOutOutline,
} from "react-icons/io5";
import axios from "axios";
import { useCookies } from "react-cookie";

const ConsultantSidebar = () => {
  const [cookies, , removeCookie] = useCookies();
  const token = cookies.token;
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

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

  return (
    <aside
      className="
        flex flex-col items-center bg-[#9a6cb4] pt-5 fixed top-0 left-0 h-screen z-[1000] w-[200px]
        max-[1100px]:flex-row max-[1100px]:w-full max-[1100px]:h-[60px] max-[1100px]:pt-0 max-[1100px]:items-center max-[1100px]:justify-between max-[1100px]:px-2
      "
    >
      <div
        className="
          text-[24px] text-white mb-8
          max-[900px]:mb-0 max-[900px]:ml-2
        "
      >
        <img
          src="img/logo_consultant.png"
          alt="logo"
          className="
            rounded-full w-[160px] h-[160px]
            max-[900px]:w-[36px] max-[900px]:h-[36px]
          "
        />
      </div>
      <div
        className="
          flex flex-col w-full mt-2
          max-[900px]:flex-row max-[900px]:w-auto max-[900px]:mt-0 max-[900px]:ml-2 max-[900px]:mr-2 max-[900px]:items-center max-[900px]:justify-center max-[900px]:gap-2
        "
      >
        <Link
          to="/consultant-landing"
          className="
            flex items-center justify-center text-white transition-colors duration-300
            w-[80%] py-5 text-[30px] ml-[70px] mb-2 hover:text-[#7c459c]
            max-[900px]:w-auto max-[900px]:ml-0 max-[900px]:mb-0 max-[900px]:py-0 max-[900px]:px-2 max-[900px]:text-[18px]
          "
          title="Home"
        >
          <IoHome />
        </Link>
        <Link
          to="/consultant-appointment"
          className="
            flex items-center justify-center text-white transition-colors duration-300
            w-[80%] py-5 text-[30px] ml-[70px] mb-2 hover:text-[#7c459c]
            max-[900px]:w-auto max-[900px]:ml-0 max-[900px]:mb-0 max-[900px]:py-0 max-[900px]:px-2 max-[900px]:text-[18px]
          "
          title="Appointment"
        >
          <IoCalendar />
        </Link>
        <Link
          to="/belly-talk"
          className="
            flex items-center justify-center text-white transition-colors duration-300
            w-[80%] py-5 text-[30px] ml-[70px] mb-2 hover:text-[#7c459c]
            max-[900px]:w-auto max-[900px]:ml-0 max-[900px]:mb-0 max-[900px]:py-0 max-[900px]:px-2 max-[900px]:text-[18px]
          "
          title="BellyTalk"
        >
          <IoChatbubbles />
        </Link>
        <Link
          to="/manageBellytalk"
          className="
            flex items-center justify-center text-white transition-colors duration-300
            w-[80%] py-5 text-[30px] ml-[70px] mb-2 hover:text-[#7c459c]
            max-[900px]:w-auto max-[900px]:ml-0 max-[900px]:mb-0 max-[900px]:py-0 max-[900px]:px-2 max-[900px]:text-[18px]
          "
          title="Manage BellyTalk"
        >
          <IoBarChart />
        </Link>
        <Link
          to="/consultant-patientsinfo"
          className="
            flex items-center justify-center text-white transition-colors duration-300
            w-[80%] py-5 text-[30px] ml-[70px] mb-2 hover:text-[#7c459c]
            max-[900px]:w-auto max-[900px]:ml-0 max-[900px]:mb-0 max-[900px]:py-0 max-[900px]:px-2 max-[900px]:text-[18px]
          "
          title="Patient Records"
        >
          <IoFolderOpen />
        </Link>
      </div>
      <button
        className="
          inline-flex items-center bg-transparent border-none text-white cursor-pointer
          px-8 py-4 text-[18px] rounded-[25px] mb-4 mt-[150px]
          hover:bg-white hover:text-[#9a6cb4] transition-colors duration-300
          max-[900px]:text-[12px] max-[900px]:px-2 max-[900px]:py-1 max-[900px]:mt-0 max-[900px]:mb-0 max-[900px]:h-[36px]
        "
        onClick={handleLogout}
      >
        <IoLogOutOutline className="mr-2 text-white max-[900px]:text-[16px]" />
        <span className="max-[900px]:hidden">Logout</span>
      </button>
    </aside>
  );
};

export default ConsultantSidebar;
