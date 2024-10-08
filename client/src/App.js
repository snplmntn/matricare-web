import React, { useState, Fragment } from "react";
import { useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation,} from "react-router-dom";
import "./App.css";
import Footer from "./User/components/Pages/Footer";
import Signup from "./User/components/Pages/Signup";
import Login from "./User/components/Pages/Login";
import ForgotPass from "./User/components/Pages/ForgotPass";
import Header1 from "./User/components/Pages/Header1";
import LandingPage from "./User/components/Pages/LandingPage";
import Notifications from "./User/components/Pages/Notifications";
import UserProfile from "./User/components/Settings/UserProfile";
import MedicalRec from "./User/components/Settings/MedicalRec";
import BellyTalk from "./User/components/Features/BellyTalk";
import HomePage from "./User/components/Pages/HomePage";
import Library from "./User/components/Features/Library";
import LibrarySidebar from "./User/components/Features/LibrarySidebar";
import WeeklyPregnancy from "./User/components/Library/WeeklyPregnancy";
import Library1 from "./User/components/Library/Library1";
import Library2 from "./User/components/Library/Library2";
import Library3 from "./User/components/Library/Library3";
import Library4 from "./User/components/Library/Library4";
import Library5 from "./User/components/Library/Library5";
import Library6 from "./User/components/Library/Library6";
import Library7 from "./User/components/Library/Library7";
import Library8 from "./User/components/Library/Library8";
import Library9 from "./User/components/Library/Library9";
import Library10 from "./User/components/Library/Library10";
import SavedArticle from "./User/components/Pages/SavedArticle";
import DateCalculator from "./User/components/Features/datecalculator";
import LandingPageAssistant from "./Assistant/components/Pages/LandingPageAssistant";
import AssistantSidebar from "./Assistant/components/Pages/AssistantSidebar";
import LibraryAssistant from "./Assistant/components/Features/LibraryAssistant";
import NotificationAssistant from "./Assistant/components/Pages/NotificationAssistant";
import PatientUserManagement from "./Assistant/components/Pages/PatientUserManagement";
import AppointmentAssistant from "./Assistant/components/Features/AppointmentAssistant";
import LandingPageConsultant from "./Consultant/components/Pages/LandingPageConsultant";
import ConsultantSidebar from "./Consultant/components/Pages/ConsultantSidebar";
import AppointmentConsultant from "./Consultant/components/Features/AppointmentConsultant";
import ConsultantRecord from "./Consultant/components/Settings/ConsultantRecord";
import PatientRecords from "./Consultant/components/Settings/PatientRecords";
import ConsultantPatientInfo from "./Consultant/components/Settings/ConsultantPatientInfo";
import ConsultantNotifications from "./Consultant/components/Pages/ConsultantNotifications";
import Verify from "./User/components/Pages/Verify";
import SavedPosts from "./User/components/Features/SavedPosts";
import { getCookie } from "./utils/getCookie";
import { CookiesProvider, useCookies } from "react-cookie";
import { createHashHistory } from "history";

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
          return <LandingPageAssistant user={parsedUser} />;
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
        <Route
          path="/consultant-landing"
          element={
            <>
              <ConsultantSidebar />
              <LandingPageConsultant user={parsedUser} />
            </>
          }
        />
        <Route path="/consultant-records" element={<ConsultantRecord />} />
        <Route
          path="/consultant-patientsinfo"
          element={
            <>
              <ConsultantSidebar />
              <ConsultantPatientInfo />
            </>
          }
        />
        <Route
          path="/consultant-appointment"
          element={
            <>
              <ConsultantSidebar />
              <AppointmentConsultant />
            </>
          }
        />
        <Route
          path="/savedarticle"
          element={
            <>
              <LibrarySidebar />
              <SavedArticle />
            </>
          }
        />
        <Route
          path="/library"
          element={
            <>
              <LibrarySidebar />
              <Library />
            </>
          }
        />
        <Route path="/duedate-calculator" element={<DateCalculator />} />
        <Route
          path="/library-item1"
          element={
            <>
              <LibrarySidebar />
              <Library1 />
            </>
          }
        />
        <Route
          path="/library-item2"
          element={
            <>
              <LibrarySidebar />
              <Library2 />
            </>
          }
        />
        <Route
          path="/library-item3"
          element={
            <>
              <LibrarySidebar />
              <Library3 />
            </>
          }
        />
        <Route
          path="/library-item4"
          element={
            <>
              <LibrarySidebar />
              <Library4 />
            </>
          }
        />
        <Route
          path="/library-item5"
          element={
            <>
              <LibrarySidebar />
              <Library5 />
            </>
          }
        />
        <Route
          path="/library-item6"
          element={
            <>
              <LibrarySidebar />
              <Library6 />
            </>
          }
        />
        <Route
          path="/library-item7"
          element={
            <>
              <LibrarySidebar />
              <Library7 />
            </>
          }
        />
        <Route
          path="/library-item8"
          element={
            <>
              <LibrarySidebar />
              <Library8 />
            </>
          }
        />
        <Route
          path="/library-item9"
          element={
            <>
              <LibrarySidebar />
              <Library9 />
            </>
          }
        />
        <Route
          path="/library-item10"
          element={
            <>
              <LibrarySidebar />
              <Library10 />
            </>
          }
        />
        <Route
          path="/library-item13"
          element={
            <>
              <LibrarySidebar />
              <WeeklyPregnancy />
            </>
          }
        />
        {/* ASSISTANT */}
        <Route
          path="/assistant-landing"
          element={
            <>
              <AssistantSidebar />
              <LandingPageAssistant user={parsedUser} />
            </>
          }
        />
        <Route
          path="/library-assistant"
          element={
            <>
              <AssistantSidebar />
              <LibraryAssistant />
            </>
          }
        />
        <Route
          path="/assistant-notification"
          element={<NotificationAssistant />}
        />
        <Route path="/admin-profile" element={<PatientUserManagement />} />
        <Route
          path="/appointment-assistant"
          element={
            <>
              <AssistantSidebar />
              <AppointmentAssistant />
            </>
          }
        />
        <Route path="/patient-records/:userId" element={<PatientRecords />} />
        <Route
          path="/consultant-notification"
          element={<ConsultantNotifications />}
        />
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
