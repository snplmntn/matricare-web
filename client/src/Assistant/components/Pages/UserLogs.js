import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/pages/userlogs.css";
import { IoPrint } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ConsultantLogs = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [filter, setFilter] = useState("all");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [view, setView] = useState("patients");
  const [editingUserId, setEditingUserId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    assignedId: userID,
    fullName: "",
    phoneNumber: "",
    email: "",
  });
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

  const [showForm, setShowForm] = useState(false); // State for form visibility

  const [filteredUsers, setFilteredUsers] = useState([]);

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

  const handleSaveClick = () => {
    setEditingUserId(null);
  };

  const handleAddPatientClick = () => {
    setShowForm(true); // Show the form when the button is clicked
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setNewPatient((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddPatientSubmit = async (event) => {
    event.preventDefault();
    try {
      const patientForm = {
        assignedId: userID,
        email: newPatient.email,
        fullName: newPatient.fullName,
        phoneNumber: newPatient.phoneNumber,
      };
      const response = await axios.post(
        `${API_URL}/record/patient`,
        patientForm,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPatients([...patients, response.data.newPatient]);
    } catch (error) {
      console.error(error);
    }
    setShowForm(false); // Hide the form
  };

  const handleCancelClick = () => {
    setShowForm(false); // Hide the form
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
    <div className="CPL-container">
      <div className="CPL-main-section">
        <header className="CPL-header">
          <div className="CPL-user-profile">
            <h1>{`${user.name}`}</h1>
            <p>{user.role}</p>
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

        <div className="CPL-type-buttons">
          <button
            className={`CPL-type-button ${view === "patients" ? "active" : ""}`}
            onClick={() => setView("patients")}
          >
            Patient Logs
          </button>
          <button
            className={`CPL-type-button ${view === "admins" ? "active" : ""}`}
            onClick={() => setView("admins")}
          >
            Admin Logs
          </button>
          <button
            className={`CPL-type-button ${
              view === "specialist" ? "active" : ""
            }`}
            onClick={() => setView("specialist")}
          >
            OB Specialists
          </button>
        </div>

        <div className="CPL-view-label">
          {view === "patients" ? (
            <h2>Patient Logs</h2>
          ) : view === "admin" ? (
            <h2>Admin Logs</h2>
          ) : (
            <h2>OB Specialist</h2>
          )}
        </div>

        <div className="CPL-filter-options">
          {view === "patients" && (
            <>
              <div className="CPL-toggle-select">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
                <label htmlFor="selectAll">Select All Users</label>
                <span className="CPL-total-users">
                  ({patients.length} Users)
                </span>
              </div>
              <button className="CPL-download-button" onClick={generatePDF}>
                Download All &nbsp;
                <IoPrint />
              </button>

              <div className="CPL-filter-section">
                <div className="CPL-filter-container">
                  <label htmlFor="filter">Filter by Status:</label>
                  <select id="filter" onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="New">New</option>
                    <option value="On-Going">On-Going</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Admin Filters */}
          {view === "admins" && (
            <>
              <button
                className="CPL-admin-download-button"
                onClick={generatePDF}
              >
                Download All &nbsp;
                <IoPrint />
              </button>

              <div className="CPL-admin-filter-section">
                <div className="CPL-admin-filter-container">
                  <label htmlFor="admin-filter">Filter by Role:</label>
                  <select id="admin-filter" onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="Obgyne">Obgyne</option>
                    <option value="Assistant">Assistant</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {view === "specialist" && (
            <button className="CPL-admin-download-button" onClick={generatePDF}>
              Download All &nbsp;
              <IoPrint />
            </button>
          )}
        </div>

        <table className="CPL-user-table">
          <thead>
            <tr>
              {view === "patients" && <th>Select</th>}
              <th>Patient ID</th>
              <th>Photo</th>
              {view === "patients" && (
                <>
                  <th>Name</th>
                  <th>Phone Number</th> {/* New Phone Number Column */}
                  <th>Date</th> {/* New Date Column */}
                  <th>Log In Time</th>
                  <th>Log Out Time</th>
                </>
              )}
              {view === "admins" && (
                <>
                  <th>Name</th>
                  <th>Phone Number</th> {/* New Phone Number Column */}
                  <th>Date</th> {/* New Date Column */}
                  <th>Log In Time</th>
                  <th>Log Out Time</th>
                  <th>Role</th>
                </>
              )}
              {view === "specialist" && (
                <>
                  <th>Name</th>
                  <th>Phone Number</th> {/* New Phone Number Column */}
                  <th>Date</th> {/* New Date Column */}
                  <th>Log In Time</th>
                  <th>Log Out Time</th>
                  <th>Role</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                {view === "patients" && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleUserSelection(user._id)}
                    />
                  </td>
                )}
                <td>{user.seq}</td>
                <td>
                  {view === "patients" ? (
                    <>
                      <img
                        src={
                          user.userId && user.userId.profilePicture
                            ? user.userId.profilePicture
                            : "img/profilePicture.jpg"
                        }
                        // alt={user.name}
                        className="CPM-user-photo"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={
                          user.profilePicture
                            ? user.profilePicture
                            : "img/profilePicture.jpg"
                        }
                        // alt={user.name}
                        className="CPM-user-photo"
                      />
                    </>
                  )}
                </td>
                {view === "patients" && (
                  <>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td> {/* New Phone Number Field */}
                    <td>
                      {user.userId && user.userId.logInTime
                        ? formatDate(user.userId.logInTime)
                        : "N/A"}
                    </td>
                    {/* New Date Column */}
                    <td>
                      {user.userId && user.userId.logInTime
                        ? formatTime(user.userId.logInTime)
                        : "N/A"}
                    </td>
                    <td>
                      {user.userId &&
                      user.userId.logOutTime &&
                      user.userId.logInTime
                        ? new Date(user.userId.logOutTime) >
                          new Date(user.userId.logInTime)
                          ? formatTime(user.userId.logOutTime)
                          : " - - : - -"
                        : " - - : - -"}
                    </td>
                  </>
                )}
                {view === "admins" && (
                  <>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      {user && user.logInTime
                        ? formatDate(user.logInTime)
                        : "N/A"}
                    </td>
                    {/* New Date Column */}
                    <td>
                      {user && user.logInTime
                        ? formatTime(user.logInTime)
                        : "N/A"}
                    </td>
                    <td>
                      {user && user.logOutTime && user.logInTime
                        ? new Date(user.logOutTime) > new Date(user.logInTime)
                          ? formatTime(user.logOutTime)
                          : " - - : - -"
                        : " - - : - -"}
                    </td>

                    <td>{user.role}</td>
                  </>
                )}
                {view === "specialist" && (
                  <>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      {user && user.logInTime
                        ? formatDate(user.logInTime)
                        : "N/A"}
                    </td>
                    {/* New Date Column */}
                    <td>
                      {user && user.logInTime
                        ? formatTime(user.logInTime)
                        : "N/A"}
                    </td>
                    <td>
                      {user && user.logOutTime && user.logInTime
                        ? new Date(user.logOutTime) > new Date(user.logInTime)
                          ? formatTime(user.logOutTime)
                          : " - - : - -"
                        : " - - : - -"}
                    </td>

                    <td>{user.role}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultantLogs;
