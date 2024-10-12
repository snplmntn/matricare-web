import React, { useEffect, useState } from "react";
import "../../styles/pages/landingpageconsultant.css";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import {
  IoCalendar,
  IoNotificationsSharp,
  IoPeople,
  IoMail,
  IoPersonCircleOutline,
  IoSearch,
} from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";

const LandingPageConsultant = ({}) => {
  const userID = getCookie("userID");
  const [date, setDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newPatients, setNewPatients] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [user, setUser] = useState({});
  const [newPatient, setNewPatient] = useState({
    assignedId: userID,
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const [notification, setNotification] = useState([]);
  const [unreadNotification, setUnreadNotification] = useState(0);
  const [appointment, setAppointment] = useState([]);
  const [appointmentNum, setAppointmentNum] = useState(0);

  const token = getCookie("token");
  const API_URL = process.env.REACT_APP_API_URL;

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleCancelClick = () => {
    setNewPatients(false);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/record/patient`,
        {
          assignedId: userID,
          email: newPatient.email,
          fullName: newPatient.fullName,
          phoneNumber: newPatient.phoneNumber,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTotalPatients(totalPatients + 1);
      setNewPatients(newPatients + 1);
    } catch (error) {
      console.error(error);
    }
    toggleForm();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setNewPatient((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) setUser(JSON.parse(userData));

    const fetchNotification = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/n?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
        // console.log(response);
        const unreadNotifications = response.data.filter(
          (notification) => notification.status === "Unread"
        );
        setUnreadNotification(unreadNotifications.length);
        setNotification(unreadNotifications.reverse());
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/appointment/u?userId=${userID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const today = new Date().toISOString().split("T")[0];
        const todaysAppointments = response.data.filter(
          (appt) => appt.date.split("T")[0] === today
        );
        setAppointment(todaysAppointments);
        setAppointmentNum(todaysAppointments.length);
      } catch (error) {
        console.error(error);
      }
    };

    async function fetchPatients() {
      try {
        const response = await axios.get(`${API_URL}/record/patient`, {
          headers: {
            Authorization: token,
          },
        });
        const today = new Date().toISOString().split("T")[0];
        const newPatientsToday = response.data.filter(
          (patient) => patient.createdAt.split("T")[0] === today
        ).length;
        setNewPatients(newPatientsToday);
        setTotalPatients(response.data.length);
      } catch (error) {
        console.error();
      }
    }

    fetchNotification();
    fetchAppointment();
    fetchPatients();
  }, []);

  return (
    <div className="consultant-dashboard-container">
      <main className="consultant-main-content">
        <header className="consultant-header">
          <div className="consultant-search-bar">
            <IoSearch className="consultant-search-icon" />
            <input
              type="text"
              className="consultant-search-input"
              placeholder="Search Appointments..."
            />
          </div>
          <div className="consultant-header-controls">
            <button className="add-patient-btn" onClick={toggleForm}>
              + Add Patients
            </button>
          </div>
        </header>

        <section className="consultant-greeting-section">
          <div className="consultant-greeting-text">
            <h2>Good Morning,</h2>
            <h3>{`Doctor ${user.name?.split(" ")[0]}`}</h3>
            <p>Have a nice day at work</p>
          </div>
          <div className="consultant-greeting-image">
            <img src="img/doctor.png" alt="Good Morning" />
          </div>
        </section>
        <section className="consultant-weekly-reports">
          <div className="consultant-report-card total-patients">
            <div className="consul-icon">
              <IoPeople />
            </div>
            <div className="consul-text">Total Patients</div>
            <div className="consul-number">{totalPatients}</div>
          </div>
          <div className="consultant-report-card phone-calls">
            <div className="consul-icon" style={{ color: "#7c459c" }}>
              <IoPeople />
            </div>
            <div className="consul-text">New Patients</div>
            <div className="consul-number">{newPatients}</div>
          </div>
          <div className="consultant-report-card appointments">
            <div className="consul-icon" style={{ color: "#e39fa9" }}>
              <IoCalendar />
            </div>
            <div className="consul-text">Appointments</div>
            <div className="consul-number">{appointmentNum}</div>
          </div>
          <div className="consultant-report-card unread-mails">
            <div className="consul-icon" style={{ color: "#9a6cb4" }}>
              <IoMail />
            </div>
            <div className="consul-text">Unread Mails</div>
            <div className="consul-number">{unreadNotification}</div>
          </div>
        </section>

        <section className="consultant-patients-table">
          <div className="patients-header">
            <h3>Today's Appointment</h3>
            <a href="/consultant-patientsinfo" className="view-all-patients">
              View Patients
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointment &&
                appointment.map((appt, index) => (
                  <tr key={index}>
                    <td>{appt.patientName}</td>
                    <td>{appt.location}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>
                      {new Date(appt.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{appt.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        {isFormOpen && (
          <div className="add-patient">
            <div className="add-patient-content">
              <h2>Add New Patient</h2>
              <form onSubmit={handleAddPatient}>
                <div className="CPM-add-form">
                  <label htmlFor="patientName">Name:</label>
                  <input
                    type="text"
                    id="patientName"
                    name="fullName"
                    value={newPatient.fullName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="CPM-add-form">
                  <label htmlFor="patientMobile">Mobile Number:</label>
                  <input
                    type="tel"
                    id="patientMobile"
                    name="phoneNumber"
                    value={newPatient.phoneNumber}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="CPM-add-form">
                  <label htmlFor="patientEmail">Email:</label>
                  <input
                    type="email"
                    id="patientEmail"
                    name="email"
                    value={newPatient.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <button type="submit" className="CPM-add-submit">
                  Add Patient
                </button>
                <button
                  type="button"
                  className="CPM-add-cancel"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <aside className="consultant-right-sidebar">
        <div className="consultant-profile">
          <a
            href="/consultant-patientsinfo"
            className="consul-profile-icon"
            title="Profile"
          >
            <IoPersonCircleOutline />
          </a>
          <a
            href="/consultant-notification"
            className="consul-notification-icon"
            title="Notifications"
          >
            <IoNotificationsSharp />
          </a>
          <div className="consultant-profile-text">
            <h1>{`Doctor ${user.name?.split(" ")[0]}`}</h1>
            <p>{`${user.role}`}</p>
          </div>
          <img src="img/LOGO.png" alt="Profile" />
        </div>

        <div className="consultant-schedule-calendar">
          <h3>Schedule Calendar</h3>
          <Calendar
            onChange={setDate}
            value={date}
            className="consul-custom-calendar"
          />
        </div>

        <div className="consultant-notifications">
          <h3>Notifications</h3>
          <div className="notifications-list">
            {notification &&
              notification.map((notif, index) => (
                <div key={index} className="notification-item">
                  {notif.message}
                </div>
              ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LandingPageConsultant;
