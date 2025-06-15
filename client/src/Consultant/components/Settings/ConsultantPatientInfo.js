import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPencil, IoTrash, IoSave } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";

const ConsultantPatientInfo = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    assignedId: userID,
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const [obGyneSpecialist, setObGyneSpecialist] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      parsedUserData.name = parsedUserData.name.split(" ")[0];
      setUser(parsedUserData);
    }
  }, []);

  const [admins, setAdmins] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const filteredUsers =
    view === "patients"
      ? patients.filter((user) => filter === "all" || user.status === filter)
      : view === "specialist"
      ? obGyneSpecialist
      : admins;

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleRowClick = (userId) => {
    if (view === "patients") {
      navigate(`/patient-records/${userId}`);
    }
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
      await axios.post(`${API_URL}/record/patient`, patientForm, {
        headers: {
          Authorization: token,
        },
      });
      setPatients([...patients, patientForm]);
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
            "Content-Type": "multipart/form-data",
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

  return (
    <div
      className="flex h-screen w-[90%] ml-[200px] bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]
      max-[1100px]:flex-col max-[1100px]:ml-0 max-[1100px]:w-full max-[1100px]:h-auto"
    >
      <div
        className="flex-grow flex flex-col p-5 bg-white/90 rounded-l-[50px]
        max-[1100px]:rounded-none max-[1100px]:w-full max-[1100px]:p-2 max-[1100px]:pt-16"
      >
        <header className="flex justify-end items-center mb-5 max-[600px]:flex-col max-[600px]:items-end max-[600px]:gap-2">
          <div className="flex gap-4 text-right mt-8">
            <button
              className="bg-[#9a6cb4] text-white px-5 py-2 rounded-[10px] hover:bg-[#7c459c] transition-colors duration-300 max-[900px]:mr-0 max-[900px]:ml-0 max-[600px]:px-2 max-[600px]:py-1 max-[600px]:text-[12px]"
              onClick={handleAddPatientClick}
            >
              + Add Patients
            </button>
            <img
              src={
                user.profilePicture
                  ? user.profilePicture
                  : "img/profilePicture.jpg"
              }
              alt="Profile"
              className="rounded-full w-[50px] h-[50px] object-cover max-[600px]:w-[36px] max-[600px]:h-[36px]"
            />
            <div>
              <h1 className="m-0 text-[18px] mr-16 max-[600px]:text-[15px] max-[1100px]:ml-0">{`Dr. ${user.name}`}</h1>
              <p className="m-0 text-[14px] text-[#666] mr-16 max-[600px]:text-[12px] max-[1100px]:ml-0 ">
                {user.role === "Obgyne"
                  ? "Obstetrician-gynecologist"
                  : user.role}
              </p>
            </div>
          </div>
        </header>

        <div className="flex justify-start mb-5 mt-5 ml-10 max-[600px]:flex-col max-[600px]:ml-0">
          <button
            className={`px-8 py-5 mr-2 rounded bg-white text-[#040404] text-[18px] ${
              view === "patients"
                ? "border-b-4 border-[#e39fa9]"
                : "hover:bg-[#7c459c] hover:text-white"
            } max-[600px]:w-full max-[600px]:mb-2`}
            onClick={() => setView("patients")}
          >
            Patients
          </button>
          <button
            className={`px-8 py-5 mr-2 rounded bg-white text-[#040404] text-[18px] ${
              view === "specialist"
                ? "border-b-4 border-[#e39fa9]"
                : "hover:bg-[#7c459c] hover:text-white"
            } max-[600px]:w-full max-[600px]:mb-2`}
            onClick={() => setView("specialist")}
          >
            Ob-Gyne Specialist
          </button>
          <button
            className={`px-8 py-5 mr-2 rounded bg-white text-[#040404] text-[18px] ${
              view === "admins"
                ? "border-b-4 border-[#e39fa9]"
                : "hover:bg-[#7c459c] hover:text-white"
            } max-[600px]:w-full max-[600px]:mb-2`}
            onClick={() => setView("admins")}
          >
            Admins
          </button>
        </div>

        <div className="mb-2 text-left mt-2 ml-10 max-[600px]:ml-0">
          {view === "patients" ? (
            <h2 className="text-[30px] font-bold text-[#4a4a4a] mt-2 max-[600px]:text-[20px]">
              Patients
            </h2>
          ) : view === "admins" ? (
            <h2 className="text-[30px] font-bold text-[#4a4a4a] mt-2 max-[600px]:text-[20px]">
              Admins
            </h2>
          ) : view === "specialist" ? (
            <h2 className="text-[30px] font-bold text-[#4a4a4a] mt-2 max-[600px]:text-[20px]">
              Ob-Gyne Specialists
            </h2>
          ) : (
            <h2 className="text-[30px] font-bold text-[#4a4a4a] mt-2 max-[600px]:text-[20px]">
              Default Title
            </h2>
          )}
        </div>

        <div className="flex justify-between mb-2 max-[600px]:flex-col max-[600px]:gap-2">
          <div className="flex items-center ml-10 max-[600px]:ml-0">
            <span className="font-bold text-[#ccc] text-[14px] mt-1">
              ({filteredUsers.length} Users)
            </span>
          </div>
          {view === "patients" && (
            <div className="flex items-center mt-[-30px] mr-10 max-[600px]:mr-0 max-[600px]:mt-0">
              <label htmlFor="filter" className="mr-2 mt-2">
                Filter:
              </label>
              <select
                id="filter"
                onChange={handleFilterChange}
                className="px-2 py-1 rounded border border-gray-300 w-[150px]"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-[95%] border-separate mt-2 ml-10 rounded-[8px] border-spacing-y-[15px] max-[600px]:ml-0 max-[600px]:w-full">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                  ID
                </th>
                {/* Photo column for Specialist and Admins only */}
                {(view === "specialist" || view === "admins") && (
                  <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                    Photo
                  </th>
                )}
                {view === "patients" && (
                  <>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Patient Name
                    </th>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Phone Number
                    </th>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Email Address
                    </th>
                  </>
                )}
                {view === "specialist" && (
                  <>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Specialist Name
                    </th>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Phone Number
                    </th>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Email Address
                    </th>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Verification Status
                    </th>
                  </>
                )}
                {view === "admins" && (
                  <>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Name
                    </th>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Phone Number
                    </th>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Email Address
                    </th>
                    <th className="bg-[#9a6cb4] text-white px-4 py-3 text-left">
                      Role
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user._id)}
                  className="hover:bg-[#f4f4f4] cursor-pointer"
                >
                  <td className="px-4 py-3 text-[#333] text-center bg-white shadow-md">
                    {user.seq}
                  </td>
                  {/* Photo for Specialist and Admins only */}
                  {(view === "specialist" || view === "admins") && (
                    <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                      <img
                        src={
                          user.profilePicture
                            ? user.profilePicture
                            : "img/profilePicture.jpg"
                        }
                        alt="Profile"
                        className="rounded-full w-[40px] h-[40px] object-cover"
                      />
                    </td>
                  )}
                  {view === "patients" && (
                    <>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.email}
                      </td>
                    </>
                  )}
                  {view === "specialist" && (
                    <>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.prcId
                          ? user.verified
                            ? "Verified"
                            : "On Process"
                          : "No ID Found"}
                      </td>
                    </>
                  )}
                  {view === "admins" && (
                    <>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-[#333] bg-white shadow-md">
                        {user.role}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-8 rounded-[10px] w-[400px] shadow-lg max-[500px]:w-[95vw]">
            <form onSubmit={handleAddPatientSubmit}>
              <div className="mb-4">
                <label htmlFor="patientName" className="block mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="fullName"
                  value={newPatient.fullName}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="patientMobile" className="block mb-2">
                  Mobile Number:
                </label>
                <input
                  type="tel"
                  id="patientMobile"
                  name="phoneNumber"
                  value={newPatient.phoneNumber}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="patientEmail" className="block mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="patientEmail"
                  name="email"
                  value={newPatient.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="my-2 px-3 py-2 bg-[#9a6cb4] text-white rounded-[8px] text-[16px] w-[150px] ml-[70px] max-[500px]:ml-0"
              >
                Add Patient
              </button>
              <br />
              <button
                type="button"
                className="my-2 px-3 py-2 bg-[#e39fa9] text-white rounded-[8px] text-[16px] w-[100px] ml-[97px] max-[500px]:ml-2"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantPatientInfo;
