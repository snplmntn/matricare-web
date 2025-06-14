import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";

const PatientUserManagement = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [filter, setFilter] = useState("all");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [view, setView] = useState("patients");
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

  const [showForm, setShowForm] = useState(false);

  const filteredUsers =
    view === "patients"
      ? patients.filter((user) => filter === "all" || user.status === filter)
      : view === "specialist"
      ? obGyneSpecialist
      : admins;

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedUsers(selectAll ? [] : filteredUsers.map((user) => user._id));
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

  const handleAddPatientClick = () => {
    setShowForm(true);
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
    setShowForm(false);
  };

  const handleCancelClick = () => {
    setShowForm(false);
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

  const handleStatusChange = async (userId, newStatus) => {
    const isVerified = newStatus === "Verified" ? true : false;
    try {
      await axios.put(
        `${API_URL}/user?userId=${userId}`,
        {
          verified: isVerified,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const updatedSetObgyneSpecialist = obGyneSpecialist.map((specialist) =>
        specialist._id === userId
          ? { ...specialist, verified: isVerified }
          : specialist
      );
      setObGyneSpecialist(updatedSetObgyneSpecialist);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-full lg:w-[89%] lg:ml-[200px] bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]">
      <main className="flex-grow p-4 lg:p-5 bg-white/90 lg:rounded-l-[50px]">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-5">
          {/* Mobile Header */}
          <div className="flex justify-between items-center w-full lg:hidden mb-4">
            <h1 className="text-2xl font-bold text-[#7c459c]">
              User Management
            </h1>
          </div>

          {/* Desktop Header - Exact positioning */}
          <div className="hidden lg:flex lg:justify-between lg:items-center lg:mb-5 lg:ml-[1280px] lg:-mt-5">
            <div className="flex flex-col text-right lg:mt-[30px]">
              <h1 className="m-0 text-lg lg:mr-[70px]">{user.name}</h1>
              <p className="m-0 text-sm text-gray-600 lg:mr-[70px]">
                Assistant
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
              <button
                className="bg-[#9a6cb4] hover:bg-[#e39fa9] hover:text-[#333] text-white w-[150px] h-10 rounded-[30px] border-none lg:-mt-10 lg:-ml-[170px]"
                onClick={() => navigate("/user-logs")}
              >
                View Logs
              </button>
              <button
                className="bg-[#9a6cb4] hover:bg-[#e39fa9] hover:text-[#333] text-white w-[150px] h-10 rounded-[30px] border-none lg:-mt-10"
                onClick={handleAddPatientClick}
              >
                + Add Patients
              </button>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex gap-2 w-full lg:hidden">
            <button
              className="bg-[#9a6cb4] hover:bg-[#e39fa9] hover:text-[#333] text-white px-4 py-2 rounded-full border-none flex-1"
              onClick={() => navigate("/user-logs")}
            >
              View Logs
            </button>
            <button
              className="bg-[#9a6cb4] hover:bg-[#e39fa9] hover:text-[#333] text-white px-4 py-2 rounded-full border-none flex-1"
              onClick={handleAddPatientClick}
            >
              + Add Patients
            </button>
          </div>
        </header>

        {/* Type Buttons */}
        <div className="flex flex-wrap justify-start mb-5 mt-4 lg:mt-[50px] lg:ml-10 gap-2 lg:gap-0">
          <button
            className={`px-4 py-2 lg:px-[70px] lg:py-5 lg:mr-2.5 border-none rounded cursor-pointer bg-white text-black text-sm lg:text-lg ${
              view === "patients"
                ? "border-b-2 lg:border-b-[3px] border-[#e39fa9]"
                : ""
            } hover:bg-[#7c459c] hover:text-white`}
            onClick={() => setView("patients")}
          >
            Patients
          </button>
          <button
            className={`px-4 py-2 lg:px-[70px] lg:py-5 lg:mr-2.5 border-none rounded cursor-pointer bg-white text-black text-sm lg:text-lg ${
              view === "specialist"
                ? "border-b-2 lg:border-b-[3px] border-[#e39fa9]"
                : ""
            } hover:bg-[#7c459c] hover:text-white`}
            onClick={() => setView("specialist")}
          >
            Ob-Gyne Specialist
          </button>
          <button
            className={`px-4 py-2 lg:px-[70px] lg:py-5 lg:mr-2.5 border-none rounded cursor-pointer bg-white text-black text-sm lg:text-lg ${
              view === "admins"
                ? "border-b-2 lg:border-b-[3px] border-[#e39fa9]"
                : ""
            } hover:bg-[#7c459c] hover:text-white`}
            onClick={() => setView("admins")}
          >
            Admins
          </button>
        </div>

        {/* View Label */}
        <div className="mb-2.5 text-left mt-4 lg:mt-[50px] lg:ml-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#4a4a4a] mt-2.5">
            {view === "patients"
              ? "Patients"
              : view === "admins"
              ? "Admins"
              : view === "specialist"
              ? "Ob-Gyne Specialists"
              : "Default Title"}
          </h2>
        </div>

        {/* Filter Options */}
        <div className="flex flex-col lg:flex-row justify-between mb-2.5 gap-4 lg:gap-0">
          {view === "patients" && (
            <div className="flex items-center lg:ml-[180px] lg:-mt-[50px]">
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
          )}
          {view === "patients" && (
            <div className="flex items-center lg:-mt-[50px] lg:mr-10">
              <label htmlFor="filter" className="mr-2 lg:mt-2">
                Filter:
              </label>
              <select
                id="filter"
                onChange={handleFilterChange}
                className="px-2 py-1 rounded border border-[#ccc] w-[150px]"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="w-full h-[400px] lg:h-[600px] overflow-y-auto mt-2.5 lg:mt-2.5 lg:ml-2.5 rounded-lg scrollbar-hide">
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded-lg shadow-md border"
              >
                <div className="flex items-center mb-3">
                  {view === "patients" && (
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelection(user.id)}
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
                      {view === "patients" ? user.fullName : user.fullName}
                    </div>
                    <div className="text-sm text-gray-500">ID: {user.seq}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {user.phoneNumber}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {user.email}
                  </div>

                  {view === "specialist" && (
                    <>
                      <div>
                        <span className="font-medium">PRC ID:</span>{" "}
                        {user.prcId && user.prcId.length > 0 ? (
                          <a
                            href={user.prcId[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View File
                          </a>
                        ) : (
                          "No ID Found"
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Selfie with ID:</span>{" "}
                        {user.prcId && user.prcId.length > 0 ? (
                          <a
                            href={user.prcId[1]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View File
                          </a>
                        ) : (
                          "No Selfie with ID Found"
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        {user.prcId && user.prcId.length > 0 ? (
                          <select
                            value={user.verified ? "Verified" : "On Process"}
                            onChange={(e) =>
                              handleStatusChange(user._id, e.target.value)
                            }
                            className="ml-2 px-2 py-1 border border-[#ccc] rounded text-sm"
                          >
                            <option value="Verified">Verified</option>
                            <option value="On Process">On Process</option>
                          </select>
                        ) : (
                          "No ID Found"
                        )}
                      </div>
                    </>
                  )}

                  {view === "admins" && (
                    <div>
                      <span className="font-medium">Role:</span> {user.role}
                    </div>
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
                  <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                    Select
                  </th>
                )}
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                  ID
                </th>
                <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                  Photo
                </th>
                {view === "patients" && (
                  <>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                      Patient Name
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Phone Number
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Email Address
                    </th>
                  </>
                )}
                {view === "specialist" && (
                  <>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                      Specialist Name
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      PRC ID
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Selfie with ID
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Phone Number
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Email Address
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Verification Status
                    </th>
                  </>
                )}
                {view === "admins" && (
                  <>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left text-center">
                      Name
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Phone Number
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Email Address
                    </th>
                    <th className="bg-[#9a6cb4] font-bold text-white px-4 py-3 text-left">
                      Role
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  {view === "patients" && (
                    <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words text-center">
                    {user.seq}
                  </td>
                  <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words text-center">
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
                  {view === "patients" && (
                    <>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words text-center">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.email}
                      </td>
                    </>
                  )}
                  {view === "specialist" && (
                    <>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words text-center">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.prcId && user.prcId.length > 0 ? (
                          <a
                            href={user.prcId[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View File
                          </a>
                        ) : (
                          "No ID Found"
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.prcId && user.prcId.length > 0 ? (
                          <a
                            href={user.prcId[1]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View File
                          </a>
                        ) : (
                          "No Selfie with ID Found"
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.prcId && user.prcId.length > 0 ? (
                          <select
                            value={user.verified ? "Verified" : "On Process"}
                            onChange={(e) =>
                              handleStatusChange(user._id, e.target.value)
                            }
                            className="p-1 w-[100px] rounded border text-base bg-white text-[#333] focus:border-blue-500 focus:outline-none"
                          >
                            <option value="Verified">Verified</option>
                            <option value="On Process">On Process</option>
                          </select>
                        ) : (
                          "No ID Found"
                        )}
                      </td>
                    </>
                  )}
                  {view === "admins" && (
                    <>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words text-center">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-[#333] text-left bg-white shadow-md break-words">
                        {user.role}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Patient Form Modal */}
      {showForm && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[1000] p-4">
          <div className="bg-white p-6 lg:p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#7c459c]">
              Add New Patient
            </h2>
            <form onSubmit={handleAddPatientSubmit}>
              <div className="mb-4">
                <label htmlFor="patientName" className="block mb-2 font-medium">
                  Name:
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="fullName"
                  value={newPatient.fullName}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-[#ccc] rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="patientMobile"
                  className="block mb-2 font-medium"
                >
                  Mobile Number:
                </label>
                <input
                  type="tel"
                  id="patientMobile"
                  name="phoneNumber"
                  value={newPatient.phoneNumber}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-[#ccc] rounded"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="patientEmail"
                  className="block mb-2 font-medium"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="patientEmail"
                  name="email"
                  value={newPatient.email}
                  onChange={handleFormChange}
                  required
                  className="w-full p-2 border border-[#ccc] rounded"
                />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="bg-[#9a6cb4] text-white px-6 py-2 rounded-lg border-none cursor-pointer text-base hover:bg-[#7c459c] transition-colors"
                >
                  Add Patient
                </button>
                <button
                  type="button"
                  className="bg-[#e39fa9] text-white px-6 py-2 rounded-lg border-none cursor-pointer text-base hover:bg-[#cc8a94] transition-colors"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientUserManagement;
