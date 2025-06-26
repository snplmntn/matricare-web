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
} from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";

const LandingPageConsultant = ({}) => {
  const userID = getCookie("userID");
  const [date, setDate] = useState(new Date());
  const [newPatients, setNewPatients] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [user, setUser] = useState({});
  const [notification, setNotification] = useState([]);
  const [unreadNotification, setUnreadNotification] = useState(0);
  const [appointment, setAppointment] = useState([]);
  const [allAppointment, setAllAppointment] = useState([]);
  const [appointmentNum, setAppointmentNum] = useState(0);

  const token = getCookie("token");
  const API_URL = process.env.REACT_APP_API_URL;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  };

  useEffect(() => {
    const formattedDate = formatDate(date);
    const todaysAppointments = allAppointment.filter(
      (appt) => formatDate(appt.date) === formattedDate
    );
    setAppointment(todaysAppointments);
    setAppointmentNum(todaysAppointments.length);
  }, [date, allAppointment]);

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
        const response = await axios.get(`${API_URL}/appointment/u`, {
          headers: {
            Authorization: token,
          },
        });

        setAllAppointment(response.data);
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
        const fiveMinutesAgo = new Date(
          Date.now() - 5 * 60 * 1000
        ).toISOString();
        const newPatientsToday = response.data.filter(
          (patient) => patient.createdAt >= fiveMinutesAgo
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
    <div
      className="flex h-screen w-[89%] ml-[200px] bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]
      max-[1100px]:flex-col max-[1100px]:ml-0 max-[1100px]:w-full max-[1100px]:h-auto  max-[1100px]:pt-8"
    >
      <main
        className="flex-grow p-5 bg-white/90 rounded-l-[50px]
        max-[1100px]:rounded-none max-[1100px]:w-full max-[1100px]:p-2"
      >
        {/* Greeting Section */}
        <section
          className="flex rounded-[20px] mb-5 ml-[50px] h-[150px] w-[950px] mt-[80px] items-center justify-between px-[30px] bg-white
          max-[1100px]:w-full max-[1100px]:ml-0 max-[1100px]:mt-5 max-[1100px]:px-2 max-[1100px]:h-auto "
        >
          <div className="max-w-[50%] ml-5 max-[1100px]:ml-2 max-[1100px]:max-w-full">
            <h2 className="m-0 text-[26px] text-[#333] max-[600px]:text-[20px]">
              Good Morning,
            </h2>
            <h3 className="mt-1 mb-0 text-[30px] text-[#7c459c] max-[600px]:text-[22px]">{`Doctor ${
              user.name?.split(" ")[0]
            }`}</h3>
            <p className="mt-1 mb-0 text-[16px] text-[#666] max-[600px]:text-[14px]">
              Have a nice day at work
            </p>
          </div>
          <div className="max-w-full -mt-[70px] mr-5 max-[1100px]:mt-2 max-[1100px]:mr-0">
            <img
              src="img/doctor.png"
              alt="Good Morning"
              className="w-[300px] h-auto rounded-[8px] max-[600px]:w-[180px]"
            />
          </div>
        </section>

        {/* Patients Table */}
        <section
          className="bg-transparent p-5 rounded-[10px] w-[950px] ml-[40px] -mt-5
          max-[1100px]:w-full max-[1100px]:ml-0 max-[600px]:p-2"
        >
          <div className="flex justify-between items-center ml-5 max-[600px]:ml-0">
            <h3 className="max-[600px]:text-[16px]">Today's Appointment</h3>
            <a
              href="/consultant-appointment"
              className="bg-[#9a6cb4] text-white px-5 py-2 rounded-[10px] text-[14px] ml-2 hover:bg-[#7c459c] no-underline max-[600px]:px-2 max-[600px]:py-1 max-[600px]:text-[12px]"
            >
              View Appointment
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-[95%] border-separate mt-2 ml-10 rounded-[8px] border-spacing-y-[15px] max-[600px]:ml-0 max-[600px]:w-full">
              <thead>
                <tr>
                  <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left max-[600px]:px-2 max-[600px]:py-2">
                    Name
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left max-[600px]:px-2 max-[600px]:py-2">
                    Location
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left max-[600px]:px-2 max-[600px]:py-2">
                    Date
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left max-[600px]:px-2 max-[600px]:py-2">
                    Time
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left max-[600px]:px-2 max-[600px]:py-2">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointment &&
                  appointment.map((appt, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md max-[600px]:px-2 max-[600px]:py-2">
                        {appt.patientName}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md max-[600px]:px-2 max-[600px]:py-2">
                        {appt.location}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md max-[600px]:px-2 max-[600px]:py-2">
                        {new Date(appt.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md max-[600px]:px-2 max-[600px]:py-2">
                        {new Date(appt.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md max-[600px]:px-2 max-[600px]:py-2">
                        {appt.status}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Sidebar */}
      <aside
        className="w-[450px] bg-white p-5 flex flex-col
        max-[1100px]:w-full max-[1100px]:p-2 max-[1100px]:rounded-none"
      >
        <div className="flex items-center justify-between max-[600px]:items-start">
          <div className="flex items-center justify-center mt-4 mr-2 z-[1001] max-[600px]:mb-2">
            <a
              href="/userprofile"
              className="text-[30px] text-[#7c459c] mr-2"
              title="Profile"
            >
              <IoPersonCircleOutline />
            </a>
            <a
              href="/consultant-notification"
              className="text-[30px] text-[#7c459c] ml-2"
              title="Notifications"
            >
              <IoNotificationsSharp />
            </a>
          </div>
          <div className="fixed right-5 top-5 flex items-center z-[1000] bg-transparent max-[1100px]:static max-[1100px]:mt-2">
            <div className="flex flex-col text-right mr-2">
              <h1 className="m-0 text-[18px] max-[600px]:text-[15px]">{`Doctor ${
                user.name?.split(" ")[0]
              }`}</h1>
              <p className="m-0 text-[14px] text-[#666] max-[600px]:text-[12px]">{`${user.role}`}</p>
            </div>
            <img
              src={
                user && user.profilePicture
                  ? user.profilePicture
                  : "img/profilePicture.jpg"
              }
              alt="Profile"
              className="rounded-full w-[50px] h-[50px] object-cover max-[600px]:w-[36px] max-[600px]:h-[36px]"
            />
          </div>
        </div>

        <div className="mb-5 mt-5">
          <h3 className="mb-2 text-[#042440] max-[600px]:text-[16px]">
            Schedule Calendar
          </h3>
          <Calendar
            onChange={setDate}
            value={date}
            className="consul-custom-calendar !w-full !max-w-[350px] ml-[50px] border-none font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif] "
          />
        </div>

        <div className="mb-5 h-[400px] overflow-y-scroll scrollbar-hide max-[600px]:h-[200px]">
          <h3 className="mb-5 text-[#042440] max-[600px]:text-[16px]">
            Notifications
          </h3>
          <div>
            {notification &&
              notification.map((notif, index) => (
                <div
                  key={index}
                  className="bg-transparent p-2 border border-[#9a6cb4] rounded-[5px] mb-2 text-[#042440] max-[600px]:ml-0 max-[600px]:text-[13px]"
                >
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
