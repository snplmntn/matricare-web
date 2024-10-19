import React, { useState, useEffect } from "react";
import "../../style/features/appointmentassistant.css";
import { IoSearch } from "react-icons/io5";
import moment from "moment";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const AppointmentAssistant = () => {
  const token = getCookie("token");
  const API_URL = process.env.REACT_APP_API_URL;
  const [events, setEvents] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [sortBy, setSortBy] = useState("all");
  const [branchLocation, setBranchLocation] = useState("");

  useEffect(() => {
    const savedUpcomingAppointments = [
      {
        appointmentDate: "October 01, 2024",
        appointmentTime: "2:00 PM",
        name: "John Doe",
        phoneNumber: "123-456-7890",
        branchLocation: "Mary Chiles, Sampaloc Manila",
        appointmentType: "Advise by the Doctor",
      },
      {
        appointmentDate: "October 11, 2024",
        appointmentTime: "12:00 PM",
        name: "Bea Rosal",
        phoneNumber: "987-654-3210",
        branchLocation: "Mary Chiles, Sampaloc Manila",
        appointmentType: "Monthly Check up",
      },
      {
        appointmentDate: "October 12, 2024",
        appointmentTime: "5:00 PM",
        name: "Johanna Tulalian",
        phoneNumber: "987-654-3210",
        branchLocation: "Grace Medical Center, Bulacan",
        appointmentType: "Advise by the Doctor",
      },
      {
        appointmentDate: "October 01, 2024",
        appointmentTime: "10:00 AM",
        name: "Nathaniel MAtias",
        phoneNumber: "987-654-3210",
        branchLocation: "Family Care Tungko, Bulacan",
        appointmentType: "Monthly Check up",
      },
    ];

    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointment`, {
          headers: {
            Authorization: token,
          },
        });
        const sortedAppointments = await response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        // setUpcomingAppointments(sortedAppointments.reverse());
      } catch (error) {
        console.error(error);
      }
    };
    fetchAppointment();
  }, []);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setBranchLocation("");
  };

  const handleBranchLocationChange = (e) => {
    setBranchLocation(e.target.value);
  };

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever events state changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleDetailsClick = (appointment) => {
    // Implement the logic to handle details click
    console.log("Details clicked for appointment:", appointment);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterAppointments = () => {
    let filteredAppointments = upcomingAppointments;
    const today = new Date().toISOString().split("T")[0];

    if (sortBy === "today") {
      filteredAppointments = filteredAppointments.filter(
        (appt) => appt.date && appt.date.split("T")[0] === today
      );
    } else if (sortBy === "branchLocation" && branchLocation) {
      filteredAppointments = filteredAppointments.filter(
        (appt) => appt.location === branchLocation
      );
    }

    if (searchTerm) {
      filteredAppointments = filteredAppointments.filter(
        (appt) =>
          (appt.patientName &&
            appt.patientName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (appt.userId &&
            appt.userId.phoneNumber &&
            appt.userId.phoneNumber.includes(searchTerm)) ||
          (appt.location &&
            appt.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (appt.category &&
            appt.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filteredAppointments;
  };

  return (
    <div className="appointment-assistant-container">
      <div className="appointment-main-container">
        <div className="appointment-assistant-top-search">
          <IoSearch className="assistant-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="appointment-assistant-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="appointment-assistant-content-container">
          <div className="appointment-assistant-content-section">
            <div className="appointment-header">
              <h2>Appointments</h2>
              <div className="sort-by-container">
                <label htmlFor="sortBy">Sort by: </label>
                <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                  <option value="all">All</option>
                  <option value="today">Today's Appointment</option>
                  <option value="branchLocation">Branch Location</option>
                </select>
                {sortBy === "branchLocation" && (
                  <select
                    id="branchLocation"
                    value={branchLocation}
                    onChange={handleBranchLocationChange}
                  >
                    <option value="">Select Branch</option>
                    <option value="Mary Chiles, Sampaloc">
                      Mary Chiles, Sampaloc Manila
                    </option>
                    <option value="Grace Medical Center">
                      Grace Medical Center, Bulacan
                    </option>
                    <option value="Family Care Tungko">
                      Family Care Tungko, Bulacan
                    </option>
                  </select>
                )}
              </div>
            </div>
            <div className="upcoming-appointments-container">
              <table className="upcoming-appointments-table">
                <thead>
                  <tr>
                    <th>Visit Date</th>
                    <th>Visit Time</th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Branch Location</th>
                    <th>Appointment Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterAppointments().map((appointment, index) => (
                    <tr key={index}>
                      <td>
                        {appointment.date &&
                          new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td>
                        {appointment.date &&
                          new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </td>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.userId.phoneNumber}</td>
                      <td>{appointment.location}</td>
                      <td>{appointment.category}</td>
                      <td>
                        <button onClick={() => handleDetailsClick(appointment)}>
                          Details &gt;
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filterAppointments().length === 0 && (
                    <tr>
                      <td colSpan="7">No appointments found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAssistant;
