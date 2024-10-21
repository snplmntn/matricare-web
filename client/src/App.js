import React, { useState, Fragment, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import { createHashHistory } from "history";
import "./App.css";
import axios from "axios";

// Components
import Footer from "./User/components/Pages/Footer";
import Header1 from "./User/components/Pages/Header1";
import LandingPage from "./User/components/Pages/LandingPage";
import Notifications from "./User/components/Pages/Notifications";
import UserProfile from "./User/components/Settings/UserProfile";
import MedicalRec from "./User/components/Settings/MedicalRec";
import BellyTalk from "./User/components/Features/BellyTalk";
import HomePage from "./User/components/Pages/HomePage";
import Signup from "./User/components/Pages/Signup";
import Login from "./User/components/Pages/Login";
import ForgotPass from "./User/components/Pages/ForgotPass";
import SavedPosts from "./User/components/Features/SavedPosts";
import DateCalculator from "./User/components/Features/datecalculator";
import Article from "./User/components/Library/Article";
import SavedArticle from "./User/components/Pages/SavedArticle";
import Library from "./User/components/Features/Library";
import LibrarySidebar from "./User/components/Features/LibrarySidebar";
import Undefined from "./User/components/Pages/Undefined";

// Assistant Components
import LandingPageAssistant from "./Assistant/components/Pages/LandingPageAssistant";
import AssistantSidebar from "./Assistant/components/Pages/AssistantSidebar";
import LibraryAssistant from "./Assistant/components/Features/LibraryAssistant";
import PatientUserManagement from "./Assistant/components/Pages/PatientUserManagement";
import AppointmentAssistant from "./Assistant/components/Features/AppointmentAssistant";

// Consultant Components
import LandingPageConsultant from "./Consultant/components/Pages/LandingPageConsultant";
import ConsultantSidebar from "./Consultant/components/Pages/ConsultantSidebar";
import AppointmentConsultant from "./Consultant/components/Features/AppointmentConsultant";
import LibraryConsultant from "./Consultant/components/Features/LibraryConsultant";
import ConsultantRecord from "./Consultant/components/Settings/ConsultantRecord";
import PatientRecords from "./Consultant/components/Settings/PatientRecords";
import ConsultantPatientInfo from "./Consultant/components/Settings/ConsultantPatientInfo";
import ManageBellyTalk from "./Consultant/components/Settings/ManageBellyTalk";
import UserLogs from "./Assistant/components/Pages/UserLogs.js";

// Verify
import Verify from "./User/components/Pages/Verify";

function AppContent() {
  const API_URL = process.env.REACT_APP_API_URL;
  const history = createHashHistory();
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies();
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
          return <HomePage user={parsedUser} />;
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
          element={
            !token ? (
              <>
                <Header1 />
                <Signup />
              </>
            ) : (
              <HomePage user={parsedUser} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !token ? (
              <>
                <Header1 />
                <Login />
              </>
            ) : (
              <HomePage user={parsedUser} />
            )
          }
        />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/forgot-password"
          element={
            token ? (
              <HomePage user={parsedUser} />
            ) : (
              <>
                <Header1 />
                <ForgotPass />
              </>
            )
          }
        />
        <Route path="/notification" element={<Notifications />} />

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
          path="/medicalrecords"
          element={
            token && role === "User" ? (
              <MedicalRec user={parsedUser} />
            ) : role !== "User" ? (
              <Undefined />
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
        <Route
          path="/duedate-calculator"
          element={
            token && role === "User" ? (
              <DateCalculator />
            ) : role !== "User" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/book/:bookId"
          element={
            token ? (
              <>
                <LibrarySidebar /> <Article />
              </>
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/library"
          element={
            token ? (
              <>
                <LibrarySidebar /> <Library />
              </>
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/book"
          element={
            token ? (
              <>
                <LibrarySidebar /> <Article />
              </>
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/savedarticle"
          element={
            token ? (
              <>
                <LibrarySidebar /> <SavedArticle />
              </>
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />

        {/* CONSULTANT Routes */}
        <Route
          path="/consultant-landing"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar />{" "}
                <LandingPageConsultant user={parsedUser} />
              </>
            ) : role !== "Obgyne" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/manageBellytalk"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar /> <ManageBellyTalk user={parsedUser} />
              </>
            ) : role !== "Obgyne" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/consultant-records"
          element={
            token && role === "Obgyne" ? (
              <ConsultantRecord />
            ) : role !== "Obgyne" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/consultant-patientsinfo"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar /> <ConsultantPatientInfo />
              </>
            ) : role !== "Obgyne" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/consultant-appointment"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar /> <AppointmentConsultant />
              </>
            ) : role !== "Obgyne" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/consultant-notification"
          element={
            token && role === "Obgyne" ? (
              <Notifications />
            ) : role !== "Obgyne" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        {/* Consultant and Assistant  */}
        <Route
          path="/patient-records/:userId"
          element={
            token && (role !== "Obgyne" || role !== "Assistant") ? (
              <PatientRecords />
            ) : role !== "Obgyne" || role !== "Assistant" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/library-consultant"
          element={
            token && role === "Obgyne" ? (
              <>
                <ConsultantSidebar /> <LibraryConsultant />
              </>
            ) : role !== "Obgyne" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />

        {/* Assistant Routes  */}
        <Route
          path="/assistant-landing"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar /> <LandingPageAssistant user={parsedUser} />
              </>
            ) : role !== "Assistant" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />

        <Route
          path="/user-logs"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar /> <UserLogs />{" "}
              </>
            ) : role !== "Assistant" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/library-assistant"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar /> <LibraryAssistant />{" "}
              </>
            ) : role !== "Assistant" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/assistant-notification"
          element={
            token && role === "Assistant" ? (
              <Notifications />
            ) : role !== "Assistant" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/admin-profile"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar /> <PatientUserManagement />
              </>
            ) : role !== "Assistant" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
        <Route
          path="/appointment-assistant"
          element={
            token && role === "Assistant" ? (
              <>
                <AssistantSidebar /> <AppointmentAssistant />
              </>
            ) : role !== "Assistant" ? (
              <Undefined />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
        />
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
