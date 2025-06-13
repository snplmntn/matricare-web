import React, { useState, useEffect } from "react";
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
        setUpcomingAppointments(sortedAppointments.reverse());
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
    <div className="flex h-screen w-full lg:w-[89%] lg:ml-[200px] bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]">
      <div className="flex-grow p-4 lg:p-5 bg-white/90 lg:rounded-l-[50px] flex flex-col">
        {/* Search Bar */}
        <div className="relative flex items-center w-full lg:w-[30%] rounded-lg lg:ml-2.5 mb-4 lg:mb-0">
          <IoSearch className="absolute left-1 lg:left-[5px] text-base text-[#042440] z-10" />
          <input
            type="text"
            placeholder="Search..."
            className="border-2 border-white lg:border-[#ccc] rounded-[20px] lg:rounded-[5px] w-full lg:w-[98%] h-[40px] lg:h-[30px] pl-8 lg:pl-[35px] lg:-ml-2.5 text-[#042440] focus:outline-none focus:border-[#9a6cb4]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full mb-4 lg:mb-2.5">
            <h2 className="text-black text-xl lg:text-2xl font-semibold ml-0 lg:ml-2.5 mt-4 lg:mt-[50px] mb-4 lg:mb-0">
              Appointments
            </h2>

            {/* Sort Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-0 lg:whitespace-nowrap lg:mt-10">
              <label
                htmlFor="sortBy"
                className="lg:mr-2 text-sm lg:text-base font-medium"
              >
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="p-1 lg:p-[5px] rounded border border-[#ccc] bg-white cursor-pointer w-full lg:w-[210px]"
              >
                <option value="all">All</option>
                <option value="today">Today's Appointment</option>
                <option value="branchLocation">Branch Location</option>
              </select>

              {sortBy === "branchLocation" && (
                <select
                  id="branchLocation"
                  value={branchLocation}
                  onChange={handleBranchLocationChange}
                  className="p-1 lg:p-[5px] rounded border border-[#ccc] bg-white cursor-pointer w-full lg:w-[210px] mt-2 lg:mt-0 lg:ml-2"
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

          {/* Table Container */}
          <div className="w-full min-h-[400px] lg:h-[700px] overflow-y-auto mt-2 lg:mt-2.5 rounded-lg scrollbar-hide">
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {filterAppointments().map((appointment, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md border"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-[#333] text-lg mb-1">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.userId?.phoneNumber || "N/A"}
                      </div>
                    </div>
                    <button className="bg-transparent text-[#9a6cb4] border-none cursor-pointer text-sm hover:underline">
                      Details &gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Date:</span>
                      <div className="text-[#333]">
                        {appointment.date &&
                          new Date(appointment.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Time:</span>
                      <div className="text-[#333]">
                        {appointment.date &&
                          new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-600">
                        Location:
                      </span>
                      <div className="text-[#333]">{appointment.location}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-600">Type:</span>
                      <div className="text-[#333]">{appointment.category}</div>
                    </div>
                  </div>
                </div>
              ))}

              {filterAppointments().length === 0 && (
                <div className="bg-white p-8 rounded-lg shadow-md border text-center">
                  <p className="text-gray-500">No appointments found</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <table className="hidden lg:table w-full border-separate rounded-lg border-spacing-y-[15px]">
              <thead className="bg-white">
                <tr>
                  <th className="bg-[#9a6cb4] font-bold text-white px-3 lg:px-[15px] py-3 text-left">
                    Visit Date
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-3 lg:px-[15px] py-3 text-left">
                    Visit Time
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-3 lg:px-[15px] py-3 text-left">
                    Name
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-3 lg:px-[15px] py-3 text-left">
                    Phone Number
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-3 lg:px-[15px] py-3 text-left">
                    Branch Location
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-3 lg:px-[15px] py-3 text-left">
                    Appointment Type
                  </th>
                  <th className="bg-[#9a6cb4] font-bold text-white px-3 lg:px-[15px] py-3 text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterAppointments().map((appointment, index) => (
                  <tr key={index}>
                    <td className="px-3 lg:px-[15px] py-3 text-[#333] text-left bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]">
                      {appointment.date &&
                        new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 lg:px-[15px] py-3 text-[#333] text-left bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]">
                      {appointment.date &&
                        new Date(appointment.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </td>
                    <td className="px-3 lg:px-[15px] py-3 text-[#333] text-left bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]">
                      {appointment.patientName}
                    </td>
                    <td className="px-3 lg:px-[15px] py-3 text-[#333] text-left bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]">
                      {appointment.userId?.phoneNumber || "N/A"}
                    </td>
                    <td className="px-3 lg:px-[15px] py-3 text-[#333] text-left bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]">
                      {appointment.location}
                    </td>
                    <td className="px-3 lg:px-[15px] py-3 text-[#333] text-left bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]">
                      {appointment.category}
                    </td>
                    <td className="px-3 lg:px-[15px] py-3 text-[#333] text-left bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]">
                      <button className="py-1 px-2 lg:py-[5px] lg:px-2.5 bg-transparent text-[#9a6cb4] border-none cursor-pointer hover:underline">
                        Details &gt;
                      </button>
                    </td>
                  </tr>
                ))}

                {filterAppointments().length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-3 lg:px-[15px] py-8 text-[#333] text-center bg-white shadow-[0px_2px_5px_rgba(0,0,0,0.1)]"
                    >
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAssistant;
