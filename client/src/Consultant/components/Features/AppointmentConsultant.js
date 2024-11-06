import React, { useState, useEffect } from "react";
import "../../styles/features/appointmentconsultant.css";
import { IoAddCircleOutline, IoNotifications } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const AppointmentConsultant = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    patientName: "",
    email: "",
    location: "",
    category: "",
    status: "Pending",
  });
  const [user, setUser] = useState({});

  const availableTimes = {
    "Mary Chiles, Sampaloc": {
      Monday: [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "12:30 PM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM",
      ],
      Saturday: [
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
        "04:30 PM",
      ],
    },
    "Grace Medical Center": {
      Tuesday: [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
      ],
      Friday: ["03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"],
      Sunday: [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
      ],
    },
    "Family Care Tungko": {
      Friday: ["01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"],
      Saturday: [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
      ],
    },
  };

  // Function to get the day of the week from the selected date
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { weekday: "long" });
  };

  const [timeOptions, setTimeOptions] = useState([]);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));

    // Check if location or date is changed
    if (name === "location" || name === "date") {
      checkAvailability(
        newAppointment.location,
        name === "date" ? value : newAppointment.date
      );
    }
  };

  // Function to check availability based on location and selected date
  const checkAvailability = (location, date) => {
    if (location && date) {
      const selectedDay = new Date(date).toLocaleString("en-US", {
        weekday: "long",
      });
      const availableDays = availableTimes[location];

      // Check if the selected date's day is in the available days for the selected location
      if (!availableDays || !availableDays[selectedDay]) {
        alert("There's no available schedule.");
        setTimeOptions([]); // Clear time options if no availability
      } else {
        // Set available times for the selected day
        setTimeOptions(availableDays[selectedDay]);
      }
    }
  };

  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const userID = getCookie("userID");

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      parsedUserData.name = parsedUserData.name.split(" ")[0];
      setUser(parsedUserData);
    }
  }, []);

  const categoryOptions = ["Follow-up Check up", "New Patient"];

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/appointment?id=${id}&userId=${userID}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const updatedAppointments = appointments.map((appointment) => {
        if (appointment._id === id) {
          return { ...appointment, status: newStatus };
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error(error);
    }
  };

  const upcomingAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    return appointmentDate >= now;
  });

  const postAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const now = new Date();
      return appointmentDate < now;
    })
    .reverse();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { date, time, patientName, location, category, email } =
      newAppointment;
    if (date && time && patientName && location && category) {
      const fullDateTime = `${date}, ${time}`;
      const selectedDateTime = new Date(fullDateTime);
      const now = new Date();

      if (selectedDateTime < now) {
        return alert("The selected date and time is already past.");
      }

      const appointmentObj = {
        email: email,
        patientName: patientName,
        location: location,
        category: category,
        date: selectedDateTime,
      };

      try {
        const response = await axios.post(
          `${API_URL}/appointment`,
          appointmentObj,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setAppointments([...appointments, response.data.newAppointment]);
      } catch (error) {
        console.error("Resend email error:", error);
      }
      setIsFormVisible(false);
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setNewAppointment({
      date: "",
      time: "",
      patientName: "",
      location: "",
      category: "",
      status: "pending",
    });
  };

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await axios.get(`${API_URL}/appointment/u`, {
          headers: {
            Authorization: token,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="appointmentConsultant-dashboard">
      <main className="appointmentConsultant-main">
        <header className="appointmentConsultant-header">
          <div className="appointmentConsultant-notificationIcon">
            <a href="/consultant-notification">
              <IoNotifications />
            </a>
          </div>
          <div className="appointmentConsultant-headerUser">
            <h1>{`Dr. ${user.name}`}</h1>
            <p>
              {user && user.role === "Obgyne"
                ? "Obstetrician - gynecologist"
                : user.role}
            </p>
          </div>
          <div className="appointmentConsultant-headerImage">
            <img
              src={
                user.profilePicture
                  ? user.profilePicture
                  : "img/profilePicture.jpg"
              }
              alt="Profile"
            />
          </div>
        </header>

        <div className="appointmentConsultant-breadcrumb">
          <a href="#doctor">Doctor</a> <span>&gt;</span>{" "}
          <a href="#appointments" className="breadcrumb-active">
            Appointments
          </a>
        </div>

        <div className="appointmentConsultant-content">
          <section className="appointmentConsultant-appointments">
            <div className="appointmentConsultant-tabs">
              <button
                className={`appointmentConsultant-tab ${
                  activeTab === "upcoming" ? "active" : ""
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Appointments
              </button>
              <button
                className={`appointmentConsultant-tab ${
                  activeTab === "post" ? "active" : ""
                }`}
                onClick={() => setActiveTab("post")}
              >
                Post Appointments
              </button>
            </div>
            <button
              className="appointmentConsultant-addAppointmentBtn"
              onClick={() => setIsFormVisible(true)}
            >
              <IoAddCircleOutline /> Add Appointment
            </button>

            {/* Appointment Form */}
            {isFormVisible && (
              <div className="appointmentConsultant-appointmentForm">
                <h2>Add Appointment</h2>
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  value={newAppointment.patientName}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="text"
                  name="email"
                  placeholder="Patient Email"
                  value={newAppointment.email}
                  onChange={handleFormChange}
                  required
                />
                <select
                  className="appointment-select"
                  name="category"
                  value={newAppointment.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categoryOptions.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  className="appointment-select"
                  name="location"
                  value={newAppointment.location}
                  onChange={handleFormChange}
                  required
                >
                  <option value="" disabled>
                    Select Location
                  </option>
                  {Object.keys(availableTimes).map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="date"
                  value={newAppointment.date}
                  onChange={handleFormChange}
                  required
                />

                <select
                  className="appointment-select"
                  name="time"
                  value={newAppointment.time}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Time</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="appointment-add-button"
                  onClick={handleFormSubmit}
                >
                  Add Appointment
                </button>
                <button
                  type="button"
                  className="appointment-cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Conditionally render based on the active tab */}
            {activeTab === "upcoming" && (
              <div className="appointmentConsultant-appointmentList">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="appointmentConsultant-appointmentItem"
                  >
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Date:
                        </span>
                        <span className="appointmentConsultant-text">
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Patient Name:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.patientName}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Location:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Category:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.category}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-action">
                      <select
                        className="appointmentConsultant-statusSelect"
                        value={appointment.status}
                        onChange={(e) => {
                          handleStatusChange(appointment._id, e.target.value);
                        }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Rescheduled">Reschedule</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "post" && (
              <div className="appointmentConsultant-appointmentList">
                {postAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="appointmentConsultant-appointmentItem"
                  >
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Date:
                        </span>
                        <span className="appointmentConsultant-text">
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Patient Name:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.patientName}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Location:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">
                          Category:
                        </span>
                        <span className="appointmentConsultant-text">
                          {appointment.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AppointmentConsultant;
