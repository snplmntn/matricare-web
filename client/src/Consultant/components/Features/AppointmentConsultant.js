import React, { useState, useEffect } from "react";
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
    status: "Confirmed",
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
        name === "location" ? value : newAppointment.location,
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
        alert("There's no available doctor for this date.");
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
      status: "Confirmed",
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
    <div
      className="flex h-screen w-[89%] ml-[200px] bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]
      max-[1100px]:flex-col max-[1100px]:ml-0 max-[1100px]:w-full max-[1100px]:h-auto  "
    >
      <main
        className="flex-1 p-5 bg-white/90 rounded-l-[50px]
        max-[1100px]:rounded-none max-[1100px]:w-full max-[1100px]:p-2 max-[1100px]:pt-4"
      >
        <header className="flex justify-end pb-5 mr-8 pt-[54px]">
          <div className="mr-8 text-[1.5rem] text-[#7c459c] ">
            <a href="/consultant-notification">
              <IoNotifications />
            </a>
          </div>
          <div className="flex flex-col mr-5 text-right">
            <h1 className="m-0 text-[18px] max-[600px]:text-[15px]">{`Dr. ${user.name}`}</h1>
            <p className="m-0 text-[14px] text-[#666] max-[600px]:text-[12px]">
              {user && user.role === "Obgyne"
                ? "Obstetrician - gynecologist"
                : user.role}
            </p>
          </div>
          <div>
            <img
              src={
                user.profilePicture
                  ? user.profilePicture
                  : "img/profilePicture.jpg"
              }
              alt="Profile"
              className="h-[40px] w-[40px] rounded-full"
            />
          </div>
        </header>

        <div className="my-5 text-[16px] ml-[50px] max-[600px]:ml-2 max-[600px]:text-[13px]">
          <a
            href="#doctor"
            className="no-underline text-[#040404] text-[20px] font-bold max-[600px]:text-[15px]"
          >
            Doctor
          </a>{" "}
          <span className="mx-1">{">"}</span>{" "}
          <a
            href="#appointments"
            className="text-[#7c459c] no-underline text-[20px] font-bold max-[600px]:text-[15px]"
          >
            Appointments
          </a>
        </div>

        <div className="grid grid-cols-2 gap-5 mt-5 ml-[50px] max-[1100px]:grid-cols-1 max-[1100px]:ml-0">
          <section className="flex flex-col items-start bg-white w-[1500px] h-[700px] max-[1600px]:w-full max-[900px]:h-auto max-[900px]:p-2 max-[900px]:w-full">
            <div className="flex gap-2 ml-10 mt-12 max-[900px]:ml-2 max-[900px]:mt-4">
              <button
                className={`px-5 py-2 rounded text-[14px] ${
                  activeTab === "upcoming"
                    ? "bg-[#e39fa9] text-white"
                    : "bg-[#f4f4f4] "
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Appointments
              </button>
              <button
                className={`px-5 py-2 rounded text-[14px] ${
                  activeTab === "post"
                    ? "bg-[#e39fa9] text-white"
                    : "bg-[#f4f4f4] "
                }`}
                onClick={() => setActiveTab("post")}
              >
                Post Appointments
              </button>
            </div>
            <button
              className="flex items-center text-[#040404] bg-none border-none px-5 py-2 rounded text-[18px] mt-[-35px] ml-[1200px] mb-5 whitespace-nowrap
                max-[1600px]:ml-[600px] max-[1100px]:mt-2 max-[1100px]:ml-2 max-[1100px]:mb-2 max-[1100px]:ml-2"
              onClick={() => setIsFormVisible(true)}
            >
              <IoAddCircleOutline className="mr-2" /> Add Appointment
            </button>

            {/* Appointment Form */}
            {isFormVisible && (
              <div className="fixed top-1/2 left-1/2 z-[1000] bg-white p-5 rounded-lg shadow-lg w-[400px] h-[580px] flex flex-col -translate-x-1/2 -translate-y-1/2 max-[500px]:w-[95vw] max-[500px]:h-auto">
                <h2 className="text-center mb-8 mt-5 text-[22px]">
                  Add Appointment
                </h2>
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  value={newAppointment.patientName}
                  onChange={handleFormChange}
                  required
                  className="my-2 px-3 py-2 border border-gray-300 rounded-lg text-[16px] font-['Lucida_Sans',sans-serif] bg-white"
                />
                <input
                  type="text"
                  name="email"
                  placeholder="Patient Email"
                  value={newAppointment.email}
                  onChange={handleFormChange}
                  required
                  className="my-2 px-3 py-2 border border-gray-300 rounded-lg text-[16px] font-['Lucida_Sans',sans-serif] bg-white"
                />
                <select
                  className="my-2 px-3 py-2 border border-gray-300 rounded-lg text-[16px] font-['Lucida_Sans',sans-serif] bg-white"
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
                  className="my-2 px-3 py-2 border border-gray-300 rounded-lg text-[16px] font-['Lucida_Sans',sans-serif] bg-white"
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
                  className="my-2 px-3 py-2 border border-gray-300 rounded-lg text-[16px] font-['Lucida_Sans',sans-serif] bg-white"
                />

                <select
                  className="my-2 px-3 py-2 border border-gray-300 rounded-lg text-[16px] font-['Lucida_Sans',sans-serif] bg-white"
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
                  className="my-2 px-3 py-2 bg-[#9a6cb4] text-white rounded-[20px] text-[16px] mt-5"
                  onClick={handleFormSubmit}
                >
                  Add Appointment
                </button>
                <button
                  type="button"
                  className="my-2 px-3 py-2 bg-[#e39fa9] text-white rounded-[20px] text-[16px] mt-[-1]"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Conditionally render based on the active tab */}
            {activeTab === "upcoming" && (
              <div className="mb-5 overflow-y-scroll max-h-[500px] w-full scrollbar-hide">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="w-[1300px] p-2 bg-[#f9f9f9] mb-2 rounded-[15px] ml-[120px] flex flex-wrap gap-2  max-[900px]:ml-2"
                  >
                    <div className="flex-1 mr-5 mb-5">
                      <div className="mt-5 ml-5 flex flex-col">
                        <span className="font-bold text-[#444] text-[14px] mb-1">
                          Date:
                        </span>
                        <span className="text-[18px] text-[#040404]">
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 mr-5 mb-5">
                      <div className="mt-5 ml-5 flex flex-col">
                        <span className="font-bold text-[#444] text-[14px] mb-1">
                          Patient Name:
                        </span>
                        <span className="text-[18px] text-[#040404]">
                          {appointment.patientName}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 mr-5 mb-5">
                      <div className="mt-5 ml-5 flex flex-col">
                        <span className="font-bold text-[#444] text-[14px] mb-1">
                          Location:
                        </span>
                        <span className="text-[18px] text-[#040404]">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 mr-5 mb-5">
                      <div className="mt-5 ml-5 flex flex-col">
                        <span className="font-bold text-[#444] text-[14px] mb-1">
                          Category:
                        </span>
                        <span className="text-[18px] text-[#040404]">
                          {appointment.category}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto mt-5">
                      <select
                        className="mt-5 px-4 py-2 border border-gray-300 rounded-full text-[14px] bg-[#e39fa9] w-[150px] text-center text-[#040404] mr-5"
                        value={appointment.status}
                        onChange={(e) => {
                          handleStatusChange(appointment._id, e.target.value);
                        }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Rescheduled">Reschedule</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "post" && (
              <div className="mb-5 overflow-y-scroll max-h-[500px] w-full scrollbar-hide">
                {postAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="w-[1300px] p-2 bg-[#f9f9f9] mb-2 rounded-[15px] ml-[120px] flex flex-wrap gap-2  max-[900px]:ml-2"
                  >
                    <div className="flex-1 mr-5 mb-5">
                      <div className="mt-5 ml-5 flex flex-col">
                        <span className="font-bold text-[#444] text-[14px] mb-1">
                          Date:
                        </span>
                        <span className="text-[18px] text-[#040404]">
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 mr-5 mb-5">
                      <div className="mt-5 ml-5 flex flex-col">
                        <span className="font-bold text-[#444] text-[14px] mb-1">
                          Patient Name:
                        </span>
                        <span className="text-[18px] text-[#040404]">
                          {appointment.patientName}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 mr-5 mb-5">
                      <div className="mt-5 ml-5 flex flex-col">
                        <span className="font-bold text-[#444] text-[14px] mb-1">
                          Location:
                        </span>
                        <span className="text-[18px] text-[#040404]">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 mr-5 mb-5">
                      <div className="mt-5 ml-5 flex flex-col">
                        <span className="font-bold text-[#444] text-[14px] mb-1">
                          Category:
                        </span>
                        <span className="text-[18px] text-[#040404]">
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
