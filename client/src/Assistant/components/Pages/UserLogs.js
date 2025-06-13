import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPrint, IoArrowBack } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ConsultantLogs = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [view, setView] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      parsedUserData.name = parsedUserData.name.split(" ")[0];
      setUser(parsedUserData);
    }
  }, []);

  const [obGyneSpecialist, setObGyneSpecialist] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleBackClick = () => {
    navigate("/user-management");
  };

  useEffect(() => {
    const filterUsers = () => {
      if (view === "patients") {
        setFilteredUsers(
          patients.filter((user) => filter === "all" || user.status === filter)
        );
      } else if (view === "admins") {
        setFilteredUsers(
          admins.filter((admin) => filter === "all" || admin.role === filter)
        );
      } else if (view === "specialist") {
        setFilteredUsers(obGyneSpecialist);
      }
    };

    filterUsers();
  }, [view, filter, patients, admins]);

  useEffect(() => {
    if (view === "patients") {
      setFilteredUsers(patients);
    } else if (view === "admins") {
      setFilteredUsers(admins);
    } else if (view === "specialist") {
      setFilteredUsers(obGyneSpecialist);
    }
  }, [view, patients, admins]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedUsers(selectAll ? [] : filteredUsers.map((user) => user.id));
  };

  const handleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await axios.get(`${API_URL}/record/patient`, {
          headers: {
            Authorization: token,
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error();
      }
    }

    async function fetchAdmins() {
      try {
        const response = await axios.get(`${API_URL}/user/a`, {
          headers: {
            Authorization: token,
          },
        });
        const filteredAdmins = response.data.filter(
          (admin) => admin.role === "Assistant" || admin.role === "Obgyne"
        );
        const filteredObgyneSpecialist = response.data.filter(
          (user) => user.role === "Ob-gyne Specialist"
        );
        setAdmins(filteredAdmins);
        setObGyneSpecialist(filteredObgyneSpecialist);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPatients();
    fetchAdmins();
  }, []);

  // Function to generate the PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set the font style for the title
    doc.setFont("Lucida Sans", "normal");
    doc.setFontSize(16);

    // Center the title based on the view
    const title =
      view === "patients"
        ? "Patient Logs Report"
        : view === "admins"
        ? "Admin Logs Report"
        : "OB Specialist Logs Report"; // Change title based on view
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 35);

    // Get the current date and time
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString(); // Format date
    const timeString = currentDate.toLocaleTimeString(); // Format time

    // Position the date below the title
    doc.setFontSize(12); // Set font size for the date and time
    const dateText = `Printed On: ${dateString} at ${timeString}`; // Create the date string
    const dateX = (pageWidth - doc.getTextWidth(dateText)) / 2; // Center the date
    doc.text(dateText, dateX, 45); // Adjust vertical position as needed

    // Draw a horizontal line below the date
    doc.setLineWidth(0.5); // Set line width
    const lineY = 50; // Y position for the line
    doc.line(10, lineY, pageWidth - 10, lineY);

    // Prepare data for the table
    const rows = filteredUsers;
    const tableData = rows.map((row, index) => {
      if (view === "patients") {
        return [
          index + 1,
          row.fullName,
          row.phoneNumber,
          row.userId && row.userId.logInTime
            ? formatDate(row.userId.logInTime)
            : "N/A",
          row.userId && row.userId.logInTime
            ? formatTime(row.userId.logInTime)
            : "N/A",
          row.userId && row.userId.logOutTime && row.userId.logInTime
            ? new Date(row.userId.logOutTime).toDateString() ===
              new Date(row.userId.logInTime).toDateString()
              ? formatTime(row.userId.logOutTime)
              : `${formatDate(row.userId.logOutTime)} ${formatTime(
                  row.userId.logOutTime
                )}`
            : " - - : - -",
        ];
      } else if (view === "admins") {
        return [
          index + 1,
          row.fullName,
          row.phoneNumber,
          row.email,
          row && row.logInTime ? formatDate(row.logInTime) : "N/A",
          row && row.logInTime ? formatTime(row.logInTime) : "N/A",
          row && row.logOutTime && row.logInTime
            ? new Date(row.logOutTime).toDateString() ===
              new Date(row.logInTime).toDateString()
              ? formatTime(row.logOutTime)
              : `${formatDate(row.logOutTime)} ${formatTime(row.logOutTime)}`
            : " - - : - -",
          row.role, // Role for admins
        ];
      } else if (view === "specialist") {
        return [
          index + 1,
          row.fullName,
          row.phoneNumber,
          row.email,
          row && row.logInTime ? formatDate(row.logInTime) : "N/A",
          row && row.logInTime ? formatTime(row.logInTime) : "N/A",
          row && row.logOutTime && row.logInTime
            ? new Date(row.logOutTime).toDateString() ===
              new Date(row.logInTime).toDateString()
              ? formatTime(row.logOutTime)
              : `${formatDate(row.logOutTime)} ${formatTime(row.logOutTime)}`
            : " - - : - -",
          row.role, // Role for specialists
        ];
      }
    });

    // Determine table header based on view
    const tableHead =
      view === "patients"
        ? [
            [
              "No.",
              "Name",
              "Phone Number",
              "Date",
              "Log In Time",
              "Log Out Time",
            ],
          ] // Header for patients
        : [
            [
              "No.",
              "Name",
              "Phone Number",
              "Email",
              "Date",
              "Log In Time",
              "Log Out Time",
              "Role",
            ],
          ]; // Header for admins

    // Add a table
    doc.autoTable({
      head: tableHead,
      body: tableData, // Table body
      startY: 55, // Start after the title and date
      margin: { horizontal: 10 },
      styles: {
        font: "Lucida Sans", // Set the font style for the table
        fontSize: 12,
        halign: "center", // Center the text in the table body
      },
      headStyles: {
        fillColor: [124, 69, 156], // RGB for #7c459c
        textColor: [255, 255, 255], // White text color for contrast
        halign: "center", // Center the text in the header
      },
    });

    // Save the PDF
    doc.save(view === "patients" ? "patient-logs.pdf" : "admin-logs.pdf"); // Different file names based on view
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex h-screen w-full lg:w-[90%] lg:ml-[200px] bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]">
      <main className="flex-grow p-4 lg:p-5 flex flex-col bg-white/90 lg:rounded-l-[50px]">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-5">
          {/* Mobile Header */}
          <div className="flex justify-between items-center w-full lg:hidden mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackClick}
                className="p-2 text-[#7c459c] hover:bg-[#7c459c] hover:text-white rounded-lg transition-colors duration-200"
                title="Back to User Management"
              >
                <IoArrowBack size={24} />
              </button>
            </div>
          </div>

          {/* Desktop Back Button and Title */}
          <div className="hidden lg:flex items-center gap-4 lg:ml-10 lg:mt-5">
            <button
              onClick={handleBackClick}
              className="p-2 text-[#7c459c] hover:bg-[#7c459c] hover:text-white rounded-lg transition-colors duration-200"
              title="Back to User Management"
            >
              <IoArrowBack size={28} />
            </button>
          </div>

          {/* Desktop Header - Exact positioning */}
          <div className="hidden lg:flex lg:justify-between lg:items-center lg:mb-5 lg:ml-[1000px] lg:-mt-5">
            <div className="flex flex-col text-right lg:mt-[30px]">
              <h1 className="m-0 text-lg lg:mr-[70px]">{user.name}</h1>
              <p className="m-0 text-sm text-gray-600 lg:mr-[70px]">
                {user.role}
              </p>
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : "img/profilePicture.jpg"
                }
                alt="Profile"
                className="rounded-full w-[50px] h-[50px] lg:ml-[290px] lg:-mt-[45px]"
              />
            </div>
          </div>

          {/* Mobile User Profile */}
          <div className="flex items-center gap-3 w-full lg:hidden p-3 bg-white rounded-lg shadow-sm">
            <img
              src={
                user.profilePicture
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

        {/* Type Buttons */}
        <div className="flex flex-wrap justify-start mb-5 mt-4 lg:mt-5 lg:ml-10 gap-2 lg:gap-0">
          <button
            className={`px-4 py-2 lg:px-[70px] lg:py-5 lg:mr-2.5 border-none rounded cursor-pointer bg-white text-black text-sm lg:text-lg ${
              view === "patients"
                ? "border-b-2 lg:border-b-[3px] border-[#e39fa9]"
                : ""
            } hover:bg-[#7c459c] hover:text-white`}
            onClick={() => setView("patients")}
          >
            Patient Logs
          </button>
          <button
            className={`px-4 py-2 lg:px-[70px] lg:py-5 lg:mr-2.5 border-none rounded cursor-pointer bg-white text-black text-sm lg:text-lg ${
              view === "admins"
                ? "border-b-2 lg:border-b-[3px] border-[#e39fa9]"
                : ""
            } hover:bg-[#7c459c] hover:text-white`}
            onClick={() => setView("admins")}
          >
            Admin Logs
          </button>
          <button
            className={`px-4 py-2 lg:px-[70px] lg:py-5 lg:mr-2.5 border-none rounded cursor-pointer bg-white text-black text-sm lg:text-lg ${
              view === "specialist"
                ? "border-b-2 lg:border-b-[3px] border-[#e39fa9]"
                : ""
            } hover:bg-[#7c459c] hover:text-white`}
            onClick={() => setView("specialist")}
          >
            OB Specialists
          </button>
        </div>

        {/* View Label */}
        <div className="mb-2.5 text-left mt-2.5 lg:mt-2.5 lg:ml-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#4a4a4a] mt-2.5">
            {view === "patients"
              ? "Patient Logs"
              : view === "admins"
              ? "Admin Logs"
              : "OB Specialist"}
          </h2>
        </div>

        {/* Filter Options */}
        <div className="flex flex-col lg:flex-row justify-between mb-2.5 gap-4 lg:gap-0">
          {/* Patient Filters */}
          {view === "patients" && (
            <>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0">
                <div className="flex items-center lg:ml-[250px] lg:-mt-[50px]">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="mr-1"
                  />
                  <label
                    htmlFor="selectAll"
                    className="ml-1 text-sm lg:text-base lg:mt-1"
                  >
                    Select All Users
                  </label>
                  <span className="font-bold text-[#ccc] text-xs lg:text-sm ml-2.5 mt-1">
                    ({patients.length} Users)
                  </span>
                </div>

                <button
                  className="bg-white text-black border-none px-4 py-2 lg:px-[15px] lg:py-2.5 text-center no-underline inline-block text-sm lg:text-base cursor-pointer rounded lg:-mt-[45px] lg:ml-[650px] mb-2.5 hover:bg-[#7c459c] hover:text-white flex items-center gap-2"
                  onClick={generatePDF}
                >
                  Download All <IoPrint />
                </button>
              </div>

              <div className="flex items-center lg:-mt-[50px] lg:mr-10">
                <label htmlFor="filter" className="mr-2 lg:mt-2">
                  Filter by Status:
                </label>
                <select
                  id="filter"
                  onChange={handleFilterChange}
                  className="px-2 py-1 rounded border border-[#ccc] w-[150px]"
                >
                  <option value="all">All</option>
                  <option value="New">New</option>
                  <option value="On-Going">On-Going</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </>
          )}

          {/* Admin Filters */}
          {view === "admins" && (
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0">
              <button
                className="bg-white text-black border-none px-4 py-2 lg:px-[15px] lg:py-2.5 text-center no-underline inline-block text-sm lg:text-base cursor-pointer rounded lg:-mt-10 lg:ml-[1150px] hover:bg-[#7c459c] hover:text-white flex items-center gap-2"
                onClick={generatePDF}
              >
                Download All <IoPrint />
              </button>

              <div className="flex items-center lg:-mt-[50px] lg:mr-10">
                <label htmlFor="admin-filter" className="mr-2">
                  Filter by Role:
                </label>
                <select
                  id="admin-filter"
                  onChange={handleFilterChange}
                  className="px-2 py-1 rounded border border-[#ccc] w-[150px] ml-2.5"
                >
                  <option value="all">All</option>
                  <option value="Obgyne">Obgyne</option>
                  <option value="Assistant">Assistant</option>
                </select>
              </div>
            </div>
          )}

          {/* Specialist Filters */}
          {view === "specialist" && (
            <button
              className="bg-white text-black border-none px-4 py-2 lg:px-[15px] lg:py-2.5 text-center no-underline inline-block text-sm lg:text-base cursor-pointer rounded lg:-mt-10 lg:ml-[1150px] hover:bg-[#7c459c] hover:text-white flex items-center gap-2"
              onClick={generatePDF}
            >
              Download All <IoPrint />
            </button>
          )}
        </div>

        {/* Table Container */}
        <div className="w-full lg:w-[95%] h-[400px] lg:h-[700px] overflow-y-auto mt-2.5 lg:mt-2.5 lg:ml-10 rounded-lg scrollbar-hide">
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-lg shadow-md border"
              >
                <div className="flex items-center mb-3">
                  {view === "patients" && (
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserSelection(user._id)}
                      className="mr-3"
                    />
                  )}
                  <img
                    src={
                      view === "patients"
                        ? user.userId && user.userId.profilePicture
                          ? user.userId.profilePicture
                          : "img/profilePicture.jpg"
                        : user.profilePicture
                        ? user.profilePicture
                        : "img/profilePicture.jpg"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-lg object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-[#333]">
                      {user.fullName}
                    </div>
                    <div className="text-sm text-gray-500">ID: {user.seq}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {user.phoneNumber}
                  </div>

                  {view === "patients" && (
                    <>
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {user.userId && user.userId.logInTime
                          ? formatDate(user.userId.logInTime)
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Log In:</span>{" "}
                        {user.userId && user.userId.logInTime
                          ? formatTime(user.userId.logInTime)
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Log Out:</span>{" "}
                        {user.userId &&
                        user.userId.logOutTime &&
                        user.userId.logInTime
                          ? new Date(user.userId.logOutTime) >
                            new Date(user.userId.logInTime)
                            ? formatTime(user.userId.logOutTime)
                            : " - - : - -"
                          : " - - : - -"}
                      </div>
                    </>
                  )}

                  {(view === "admins" || view === "specialist") && (
                    <>
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {user && user.logInTime
                          ? formatDate(user.logInTime)
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Log In:</span>{" "}
                        {user && user.logInTime
                          ? formatTime(user.logInTime)
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Log Out:</span>{" "}
                        {user && user.logOutTime && user.logInTime
                          ? new Date(user.logOutTime) > new Date(user.logInTime)
                            ? formatTime(user.logOutTime)
                            : " - - : - -"
                          : " - - : - -"}
                      </div>
                      <div>
                        <span className="font-medium">Role:</span> {user.role}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <table className="hidden lg:table w-[95%] border-separate mt-2.5 ml-10 rounded-lg border-spacing-y-[15px] table-auto">
            <thead className="bg-white">
              <tr>
                {view === "patients" && (
                  <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                    Select
                  </th>
                )}
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                  Patient ID
                </th>
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                  Photo
                </th>
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                  Name
                </th>
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                  Phone Number
                </th>
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                  Date
                </th>
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                  Log In Time
                </th>
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                  Log Out Time
                </th>
                {(view === "admins" || view === "specialist") && (
                  <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                    Role
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  {view === "patients" && (
                    <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md text-center">
                    {user.seq}
                  </td>
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md text-center">
                    <img
                      src={
                        view === "patients"
                          ? user.userId && user.userId.profilePicture
                            ? user.userId.profilePicture
                            : "img/profilePicture.jpg"
                          : user.profilePicture
                          ? user.profilePicture
                          : "img/profilePicture.jpg"
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md text-center">
                    {user.fullName}
                  </td>
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md">
                    {user.phoneNumber}
                  </td>
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md">
                    {view === "patients"
                      ? user.userId && user.userId.logInTime
                        ? formatDate(user.userId.logInTime)
                        : "N/A"
                      : user && user.logInTime
                      ? formatDate(user.logInTime)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md">
                    {view === "patients"
                      ? user.userId && user.userId.logInTime
                        ? formatTime(user.userId.logInTime)
                        : "N/A"
                      : user && user.logInTime
                      ? formatTime(user.logInTime)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md">
                    {view === "patients"
                      ? user.userId &&
                        user.userId.logOutTime &&
                        user.userId.logInTime
                        ? new Date(user.userId.logOutTime) >
                          new Date(user.userId.logInTime)
                          ? formatTime(user.userId.logOutTime)
                          : " - - : - -"
                        : " - - : - -"
                      : user && user.logOutTime && user.logInTime
                      ? new Date(user.logOutTime) > new Date(user.logInTime)
                        ? formatTime(user.logOutTime)
                        : " - - : - -"
                      : " - - : - -"}
                  </td>
                  {(view === "admins" || view === "specialist") && (
                    <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md">
                      {user.role}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ConsultantLogs;
