import React, { Fragment, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import "./App.css";
import axios from "axios";

// Components
import Footer from "./User/components/Pages/Footer";
import Header1 from "./User/components/Pages/Header1";
import LandingPage from "./User/components/Pages/LandingPage";
import Notifications from "./User/components/Pages/Notifications";
import UserProfile from "./User/components/Settings/UserProfile";
import BellyTalk from "./User/components/Features/BellyTalk";
import Signup from "./User/components/Pages/Signup";
import Login from "./User/components/Pages/Login";
import ForgotPass from "./User/components/Pages/ForgotPass";
import SavedPosts from "./User/components/Features/SavedPosts";
import Undefined from "./User/components/Pages/Undefined";
import PRCVerification from "./User/components/Settings/PRCVerification.js";

// Assistant Components
import LandingPageAssistant from "./Assistant/components/Pages/LandingPageAssistant";
import AssistantSidebar from "./Assistant/components/Pages/AssistantSidebar";
import PatientUserManagement from "./Assistant/components/Pages/PatientUserManagement";
import AppointmentAssistant from "./Assistant/components/Features/AppointmentAssistant";
import UserLogs from "./Assistant/components/Pages/UserLogs.js";

// Consultant Components
import LandingPageConsultant from "./Consultant/components/Pages/LandingPageConsultant";
import ConsultantSidebar from "./Consultant/components/Pages/ConsultantSidebar";
import AppointmentConsultant from "./Consultant/components/Features/AppointmentConsultant";
import PatientRecords from "./Consultant/components/Settings/PatientRecords";
import ConsultantPatientInfo from "./Consultant/components/Settings/ConsultantPatientInfo";
import ManageBellyTalk from "./Consultant/components/Settings/ManageBellyTalk";

function AppContent() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies();
  const parsedUser = useRef({});
  const token = cookies.token;
  const role = cookies.role;
  const userID = cookies.userID;
  const userData = localStorage.getItem("userData");

  useEffect(() => {
    async function checkToken() {
      if (token) {
        try {
          await axios.get(`${API_URL}/user?userId=${userID}`, {
            headers: {
              Authorization: token,
            },
          });
        } catch (err) {
          console.error(err);

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
        }
      }
    }
    checkToken();
  }, []);

  useEffect(() => {
    if (userData) {
      const parsedData = JSON.parse(userData);
      parsedData.name = parsedData.name.split(" ")[0];
      parsedUser.current = parsedData;
    }
  }, [userData]);

  const getPage = (Component) => {
    if (role && token) {
      switch (role) {
        case "Assistant":
          return (
            <Fragment>
              <AssistantSidebar />
              <LandingPageAssistant user={parsedUser} />
            </Fragment>
          );
        case "Obgyne":
          return (
            <Fragment>
              <ConsultantSidebar />
              <LandingPageConsultant user={parsedUser} />
            </Fragment>
          );
        case "Ob-gyne Specialist":
          return <BellyTalk user={parsedUser} />;
        default:
          return <Undefined />;
      }
    } else {
      return Component;
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={getPage(
            <>
              <Header1 />
              <LandingPage />
            </>
          )}
        />
        <Route
          path="/signup"
          element={getPage(
            <>
              <Header1 />
              <Signup />
            </>
          )}
        />
        <Route
          path="/login"
          element={getPage(
            <>
              <Header1 />
              <Login />
            </>
          )}
        />
        <Route
          path="/forgot-password"
          element={getPage(
            <>
              <Header1 />
              <ForgotPass />
            </>
          )}
        />
        <Route
          path="/notification"
          element={token ? <Notifications /> : <Undefined />}
        />

        {/* User Routes */}
        <Route
          path="/app"
          element={getPage(
            <>
              <Header1 />
              <Login />
            </>
          )}
        />
        <Route
          path="/userprofile"
          element={
            token ? (
              <UserProfile user={parsedUser} />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/prc-verification"
          element={
            token && role === "Ob-gyne Specialist" ? (
              <PRCVerification />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/saved-posts"
          element={
            token ? (
              <SavedPosts />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route path="/belly-talk" element={<BellyTalk user={parsedUser} />} />

        {/* CONSULTANT Routes */}
        <Route
          path="/consultant-landing"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar />
                <LandingPageConsultant user={parsedUser} />
              </>
            ) : (
              <Undefined />
            )
          }
        />
        <Route
          path="/manageBellytalk"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar />
                <ManageBellyTalk user={parsedUser} />
              </>
            ) : (
              <Undefined />
            )
          }
        />
        <Route
          path="/consultant-patientsinfo"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar />
                <ConsultantPatientInfo />
              </>
            ) : (
              <Undefined />
            )
          }
        />
        <Route
          path="/consultant-appointment"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar />
                <AppointmentConsultant />
              </>
            ) : (
              <Undefined />
            )
          }
        />
        <Route
          path="/consultant-notification"
          element={
            token && role === "Obgyne" ? <Notifications /> : <Undefined />
          }
        />
        <Route
          path="/patient-records/:userId"
          element={
            token && role === "Obgyne" ? (
              <PatientRecords user={parsedUser} />
            ) : (
              <Undefined />
            )
          }
        />

        {/* Assistant Routes  */}
        <Route
          path="/assistant-landing"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar />
                <LandingPageAssistant user={parsedUser} />
              </>
            ) : (
              <Undefined />
            )
          }
        />
        <Route
          path="/user-logs"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar />
                <UserLogs />
              </>
            ) : (
              <Undefined />
            )
          }
        />
        <Route
          path="/assistant-notification"
          element={
            token && role === "Assistant" ? <Notifications /> : <Undefined />
          }
        />
        <Route
          path="/user-management"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar />
                <PatientUserManagement />
              </>
            ) : (
              <Undefined />
            )
          }
        />
        <Route
          path="/appointment-assistant"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar />
                <AppointmentAssistant />
              </>
            ) : (
              <Undefined />
            )
          }
        />

        {/* 404 Page  */}
        <Route path="*" element={<Undefined />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
