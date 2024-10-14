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

// Assistant Components
import LandingPageAssistant from "./Assistant/components/Pages/LandingPageAssistant";
import AssistantSidebar from "./Assistant/components/Pages/AssistantSidebar";
import LibraryAssistant from "./Assistant/components/Features/LibraryAssistant";
import NotificationAssistant from "./Assistant/components/Pages/NotificationAssistant";
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
import ConsultantNotifications from "./Consultant/components/Pages/ConsultantNotifications";

// Verify
import Verify from "./User/components/Pages/Verify";

function AppContent() {
  const history = createHashHistory();
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies();
  const parsedUser = useRef({});
  const token = cookies.token;
  const role = cookies.role;

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        parsedData.name = parsedData.name.split(" ")[0];
        parsedUser.current = parsedData;
      }
    }
  }, []);

  const getPage = (Component) => {
    if (role) {
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
          element={
            token ? (
              <HomePage user={parsedUser} />
            ) : (
              <>
                <Header1 />
                <Login />
              </>
            )
          }
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
          element={<MedicalRec user={parsedUser} />}
        />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/belly-talk" element={<BellyTalk user={parsedUser} />} />
        <Route path="/duedate-calculator" element={<DateCalculator />} />
        <Route
          path="/book/:bookId"
          element={
            <>
              {" "}
              <LibrarySidebar /> <Article />{" "}
            </>
          }
        />
        <Route
          path="/library"
          element={
            <>
              {" "}
              <LibrarySidebar /> <Library />{" "}
            </>
          }
        />
        <Route
          path="/book"
          element={
            <>
              {" "}
              <LibrarySidebar /> <Article />{" "}
            </>
          }
        />
        <Route
          path="/savedarticle"
          element={
            <>
              {" "}
              <LibrarySidebar /> <SavedArticle />{" "}
            </>
          }
        />

        {/* Specific Library Items */}
        {Array.from({ length: 11 }, (_, index) => (
          <Route
            key={index}
            path={`/library-item${index + 1}`}
            element={
              <>
                {" "}
                <LibrarySidebar />{" "}
                {React.createElement(
                  require(`./User/components/Library/Library${index + 1}`)
                    .default
                )}{" "}
              </>
            }
          />
        ))}

        {/* CONSULTANT Routes */}
        <Route
          path="/consultant-landing"
          element={
            <>
              {" "}
              <ConsultantSidebar /> <LandingPageConsultant
                user={parsedUser}
              />{" "}
            </>
          }
        />
        <Route path="/consultant-records" element={<ConsultantRecord />} />
        <Route
          path="/consultant-patientsinfo"
          element={
            <>
              {" "}
              <ConsultantSidebar /> <ConsultantPatientInfo />{" "}
            </>
          }
        />
        <Route
          path="/consultant-appointment"
          element={
            <>
              {" "}
              <ConsultantSidebar /> <AppointmentConsultant />{" "}
            </>
          }
        />
        <Route path="/consultant-notification" element={<Notifications />} />
        <Route path="/patient-records/:userId" element={<PatientRecords />} />
        <Route
          path="/library-consultant"
          element={
            <>
              {" "}
              <ConsultantSidebar /> <LibraryConsultant />{" "}
            </>
          }
        />

        {/* ASSISTANT */}
        <Route
          path="/assistant-landing"
          element={
            <>
              {" "}
              <AssistantSidebar /> <LandingPageAssistant
                user={parsedUser}
              />{" "}
            </>
          }
        />
        <Route
          path="/library-assistant"
          element={
            <>
              {" "}
              <AssistantSidebar /> <LibraryAssistant />{" "}
            </>
          }
        />
        <Route path="/assistant-notification" element={<Notifications />} />
        <Route
          path="/admin-profile"
          element={
            <>
              {" "}
              <AssistantSidebar /> <PatientUserManagement />{" "}
            </>
          }
        />
        <Route
          path="/appointment-assistant"
          element={
            <>
              {" "}
              <AssistantSidebar /> <AppointmentAssistant />{" "}
            </>
          }
        />
        <Route path="/patient-records/:userId" element={<PatientRecords />} />
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
