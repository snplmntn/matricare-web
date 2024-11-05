import React, { useEffect, useState } from "react";
import {
  IoPersonCircleOutline,
  IoNotificationsSharp,
} from "react-icons/io5";
import "../../style/pages/landingpageassistant.css";
import Slider from "react-slick";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import "../../style/pages/landingpageassistant.css";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

// Register chart components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const LandingPageAssistant = ({}) => {
  const token = getCookie("token");
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState({});
  const [totalPatients, setTotalPatients] = useState(0);
  const [appointment, setAppointment] = useState([]);
  const [allAppointment, setAllAppointment] = useState([]);

  let dateToday = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      parsedUser.name = parsedUser.name.split(" ")[0];
      setUser(parsedUser);
    }

    async function fetchPatients() {
      try {
        const response = await axios.get(`${API_URL}/record/patient`, {
          headers: {
            Authorization: token,
          },
        });
        setTotalPatients(response.data.length);
      } catch (error) {
        console.error();
      }
    }

    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointment`, {
          headers: {
            Authorization: token,
          },
        });
        const sortedAppointments = await response.data
          .filter((appt) => new Date(appt.date) < new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointment(sortedAppointments.reverse());
        setAllAppointment(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    async function fetchBooks() {
      try {
        const response = await axios.get(`${API_URL}/article?status=Approved`, {
          headers: {
            Authorization: token,
          },
        });
        setLibraryItems(response.data.article);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPatients();
    fetchAppointment();
    fetchBooks();
  }, []);

  const lineData = {
    labels: Array.from({ length: dateToday }, (_, i) => (i + 1).toString()), // Labels from 1 to 30
    datasets: [
      {
        label: "Appointments",
        data: Array.from({ length: dateToday }, (_, i) => {
          const day = (i + 1).toString().padStart(2, "0");
          const count = allAppointment.filter(
            (p) => new Date(p.date).getDate() === parseInt(day)
          ).length;
          return count;
        }),
        fill: false,
        backgroundColor: "#9a6cb4",
        borderColor: "#9a6cb4",
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Appointment: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Appointments",
        },
        beginAtZero: true,
      },
    },
  };

  // Sample data for the pie chart
  const pieData = {
    labels: ["Manila", "Bulacan 1", "Bulacan 2"],
    datasets: [
      {
        label: "Patients by Location",
        data: [3, 3, 3], // Example data
        backgroundColor: ["#7c459c", "#9a6cb4", "#cc65fe"],
        borderColor: ["transparent"],
        borderWidth: 2,
        cutout: "80%", // Makes the pie chart into a ring
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: () => "", // Hide the tooltip
        },
      },
      datalabels: {
        display: false, // Disable data labels
      },
    },
  };

  // Sample Appointments
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  const todayStr = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Format date for labels
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Group patients by their appointment date
  const groupedPatients = appointment.reduce((acc, appt) => {
    const formattedDate = formatDate(appt.date);

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(appt);
    return acc;
  }, {});

  // Sample library items
  const [libraryItems, setLibraryItems] = useState([]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const formatDateTime = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [selectedMonth, setSelectedMonth] = useState(months[today.getMonth()]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="landingpage-assistant-container">
      <main className="landingpage-assistant-main-content">
        <header className="landingpage-assistant-header">
          <h1>Dashboard</h1>
          <div className="assistant-profile-icons">
          <a
              href="/userprofile"
              className="assistant-profile-icon"
              title="Profile"
            >
              <IoPersonCircleOutline />
            </a>
          <a
            href="/assistant-notification"
            className="assistant-notification-icon"
            title="Notifications"
          >
            <IoNotificationsSharp />
          </a>
          </div>
          <div className="landingpage-assistant-user-profile">
            <h1>{user.name}</h1>
            <p>{user.role}</p>
            <img
              src={
                user && user.profilePicture
                  ? user.profilePicture
                  : "img/profilePicture.jpg"
              }
              alt="Profile"
            />
          </div>
        </header>

        <section className="assistant-greeting-section">
          <div className="assistant-greeting-text">
            <h2>Good Day,</h2>
            <h3>{` ${user.name?.split(" ")[0]}`}</h3>
            <p>Have a nice day at work</p>
          </div>
          <div className="assistant-greeting-image">
            <img src="img/assistant.png" alt="Good Morning" />
          </div>
        </section>
        <section className="landingpage-assistant-dashboard">
          <div className="landingpage-assistant-dashboard-item landingpage-assistant-patients">
            <h2>Patients</h2>
            <div className="landingpage-assistant-pie-chart">
              <Pie data={pieData} options={pieOptions} />
              <div className="landingpage-assistant-pie-chart-label">
                {totalPatients}
              </div>
            </div>
          </div>

          <div className="landingpage-assistant-dashboard-item landingpage-assistant-total-appointment">
            <h2>Total Appointments</h2>
            <div className="landingpage-assistant-chart">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          <div className="landingpage-assistant-dashboard-item landingpage-assistant-recent-appointments">
            <h2>Recent Appointments</h2>
            <div className="landingpage-assistant-month-selector">
              <select
                id="month-select"
                name="month"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="landingpage-assistant-patients-list">
              {Object.keys(groupedPatients)
                .filter((date) => {
                  const appointmentMonth = new Date(date).toLocaleString(
                    "en-GB",
                    {
                      month: "long",
                    }
                  );
                  return appointmentMonth === selectedMonth;
                })
                .map((date) => (
                  <div
                    key={date}
                    className="landingpage-assistant-patient-date-group"
                  >
                    <h3 className="appointment-date-label">
                      {date === todayStr ? "Today" : date}
                    </h3>
                    {groupedPatients[date].map((appointment) => (
                      <div
                        key={appointment.id}
                        className="landingpage-assistant-patient-item"
                      >
                        <div className="patient-picture">
                          <img
                            src={
                              appointment &&
                              appointment.userId &&
                              appointment.userId.profilePicture
                                ? appointment.userId.profilePicture
                                : "img/profilePicture.jpg"
                            }
                            alt={appointment.patientName}
                          />
                        </div>
                        <div className="patient-details">
                          <div className="patient-name">
                            {appointment.patientName}
                          </div>
                          <div className="branch-location">
                            {appointment.branch}
                          </div>
                        </div>
                        <div className="appointment-date">
                          {formatDateTime(appointment.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPageAssistant;
