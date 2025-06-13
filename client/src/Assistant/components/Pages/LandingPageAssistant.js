import React, { useEffect, useState } from "react";
import { IoPersonCircleOutline, IoNotificationsSharp } from "react-icons/io5";
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
    labels: Array.from({ length: dateToday }, (_, i) => (i + 1).toString()),
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

  const pieData = {
    labels: ["Manila", "Bulacan 1", "Bulacan 2"],
    datasets: [
      {
        label: "Patients by Location",
        data: [3, 3, 3],
        backgroundColor: ["#7c459c", "#9a6cb4", "#cc65fe"],
        borderColor: ["transparent"],
        borderWidth: 2,
        cutout: "80%",
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: () => "",
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const groupedPatients = appointment.reduce((acc, appt) => {
    const formattedDate = formatDate(appt.date);

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(appt);
    return acc;
  }, {});

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
    <div className="flex h-screen w-full lg:w-[89%] lg:ml-[200px] bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]">
      <main className="flex-grow p-4 lg:p-5 bg-white/90 lg:rounded-l-[50px]">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-5">
          {/* Mobile Header */}
          <div className="flex justify-between items-center w-full lg:hidden mb-4">
            <h1 className="text-2xl font-bold text-[#7c459c]">Dashboard</h1>
            <div className="flex items-center gap-3">
              <a
                href="/userprofile"
                className="text-[#7c459c] hover:text-[#e39fa9] text-2xl"
                title="Profile"
              >
                <IoPersonCircleOutline />
              </a>
              <a
                href="/assistant-notification"
                className="text-[#7c459c] hover:text-[#e39fa9] text-2xl"
                title="Notifications"
              >
                <IoNotificationsSharp />
              </a>
            </div>
          </div>

          {/* Desktop Header - Exact positioning */}
          <h1 className="hidden lg:block lg:ml-10 lg:mt-10 text-3xl font-bold text-[#7c459c]">
            Dashboard
          </h1>

          {/* Desktop Profile Icons - Exact positioning */}
          <div className="hidden lg:flex items-center lg:mr-[-1200px] z-[1001] lg:mt-[30px]">
            <a
              href="/userprofile"
              className="text-[#7c459c] hover:text-[#e39fa9] lg:mr-2.5 text-[30px]"
              title="Profile"
            >
              <IoPersonCircleOutline />
            </a>
            <a
              href="/assistant-notification"
              className="text-[#7c459c] hover:text-[#e39fa9] lg:ml-2.5 text-[30px]"
              title="Notifications"
            >
              <IoNotificationsSharp />
            </a>
          </div>

          {/* Desktop User Profile - Exact positioning */}
          <div className="hidden lg:flex flex-col text-right lg:mr-20 lg:mt-[30px]">
            <h1 className="m-0 text-lg lg:mr-[70px]">{user.name}</h1>
            <p className="m-0 text-sm text-gray-600 lg:mr-[70px]">
              {user.role}
            </p>
            <img
              src={
                user && user.profilePicture
                  ? user.profilePicture
                  : "img/profilePicture.jpg"
              }
              alt="Profile"
              className="rounded-full w-[50px] h-[50px] lg:ml-[290px] lg:-mt-[45px]"
            />
          </div>

          {/* Mobile User Profile */}
          <div className="flex items-center gap-3 w-full lg:hidden p-3 bg-white rounded-lg shadow-sm">
            <img
              src={
                user && user.profilePicture
                  ? user.profilePicture
                  : "img/profilePicture.jpg"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-base font-semibold text-[#7c459c]">
                {user.name}
              </h2>
              <p className="text-sm text-gray-600">{user.role}</p>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <div className="relative">
          {/* Greeting Section */}
          <section className="flex flex-col lg:flex-row rounded-lg lg:rounded-[20px] mb-4 lg:mb-5 ml-0 lg:ml-[50px] h-auto lg:h-[150px] w-full lg:w-[700px] mt-4 lg:mt-[80px] items-center justify-between p-4 lg:p-0 bg-white">
            <div className="text-center lg:text-left lg:max-w-[50%] lg:ml-5 mb-4 lg:mb-0 lg:p-[30px]">
              <h2 className="m-0 text-xl lg:text-[26px] text-[#333]">
                Good Day,
              </h2>
              <h3 className="my-1 lg:my-[5px] text-2xl lg:text-[30px] text-[#7c459c]">
                {user.name?.split(" ")[0]}
              </h3>
              <p className="my-1 lg:my-[5px] text-sm lg:text-base text-gray-600">
                Have a nice day at work
              </p>
            </div>
            <div className="max-w-full lg:-mt-[70px] lg:mr-5">
              <img
                src="img/doctor.png"
                alt="Good Morning"
                className="w-60 lg:w-[350px] h-auto rounded-lg"
              />
            </div>
          </section>

          {/* Dashboard Grid - Mobile: Stacked, Desktop: Grid */}
          <section className="space-y-6 lg:space-y-0">
            {/* Top Row - Patients and Total Appointments */}
            <div className="flex flex-col w-50% lg:mt-20 lg:ml-20 lg:flex-row gap-4 space-y-6 lg:space-y-0">
              {/* Patients Card */}
              <div className="bg-[#e39fa9] lg:w-[300px] lg:h-[300px]  p-5 rounded-[25px] shadow-lg">
                <h2 className="text-black lg:mt-2.5 lg:ml-2.5 text-xl font-semibold mb-4">
                  Patients
                </h2>
                <div className="relative lg:w-[200px] lg:h-[200px] lg:ml-[50px] lg:mt-[30px] w-48 h-48 mx-auto">
                  <Pie data={pieData} options={pieOptions} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white h-20 w-20 lg:h-[100px] lg:w-[100px] rounded-full font-bold text-[#7c459c] z-[1] text-3xl lg:text-[50px] flex items-center justify-center">
                    {totalPatients}
                  </div>
                </div>
              </div>

              {/* Total Appointments Card */}
              <div className="bg-white lg:w-[300px] lg:h-[300px] lg:top-0 p-5 rounded-[25px] shadow-lg">
                <h2 className="text-[#7c459c] lg:mt-2.5 lg:ml-2.5 mb-4 lg:mb-[50px] text-xl font-semibold">
                  Total Appointments
                </h2>
                <div className="w-full h-48 lg:h-[200px]">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>
            </div>

            {/* Recent Appointments Card - Right side on desktop */}
            <div className="bg-white lg:h-[660px] lg:w-[700px] lg:absolute lg:right-0 lg:top-0 p-5 rounded-[25px] shadow-lg  scrollbar-none lg:z-[1]">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-[50px]">
                <h2 className="text-[#7c459c] lg:mt-2.5 lg:ml-2.5 mb-4 lg:mb-0 text-xl font-semibold">
                  Recent Appointments
                </h2>

                {/* Month Selector */}
                <div className="w-full lg:w-auto ">
                  <select
                    id="month-select"
                    name="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="text-base p-2 border border-[#ccc] rounded bg-white w-full lg:w-[200px] shadow-sm focus:border-[#007bff] focus:outline-none"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
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
                    <div key={date} className="mb-5">
                      <h3 className="text-lg font-bold mb-2.5 text-[#a39f9f]">
                        {date === todayStr ? "Today" : date}
                      </h3>
                      {groupedPatients[date].map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center p-2.5 bg-white rounded mb-2.5 last:border-b-0"
                        >
                          <div className="mr-[15px]">
                            <img
                              src={
                                appointment &&
                                appointment.userId &&
                                appointment.userId.profilePicture
                                  ? appointment.userId.profilePicture
                                  : "img/profilePicture.jpg"
                              }
                              alt={appointment.patientName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-base text-[#333]">
                              {appointment.patientName}
                            </div>
                            <div className="text-sm text-[#777]">
                              {appointment.branch}
                            </div>
                          </div>
                          <div className="text-sm text-[#555]">
                            {formatDateTime(appointment.date)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPageAssistant;
