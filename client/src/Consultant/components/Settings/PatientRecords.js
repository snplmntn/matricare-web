import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/settings/patientrecords.css";
import { FaMobileAlt, FaFileAlt, FaFilePdf } from "react-icons/fa";
import {
  IoChevronBackCircle,
  IoLockClosed,
  IoTrashOutline,
} from "react-icons/io5";
import moment from "moment";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";
import { FcPrint, FcDownload } from "react-icons/fc";

const PatientRecords = ({ user }) => {
  const { username } = user.current;
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { userId } = useParams();
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [patientUserId, setPatientUserId] = useState();
  const [patientInfo, setPatientInfo] = useState();
  const [taskName, setTaskName] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [status, setStatus] = useState("..."); // Default status
  const [prescribedBy, setPrescribedBy] = useState("");
  const [tasks, setTasks] = useState([]);
  const [modalData, setModalData] = useState({
    type: "",
    date: "",
    content: "",
    diagnosis: "",
    status: "",
    duration: "",
    file: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [typeToDelete, setTypeToDelete] = useState("");
  const [issModalOpen, setModalOpen] = useState(false);

  const handleAddTask = async () => {
    if (taskName.trim()) {
      // Ensure taskName is not empty
      const newTask = {
        taskName: taskName,
        prescribedDate: new Date().toLocaleDateString(), // Current date
        prescribedBy: prescribedBy,
        orderNumber: `2024-10`, // Generate order number based on the number of tasks
        userId: patientUserId,
      };
      try {
        const response = await axios.post(`${API_URL}/record/task`, newTask, {
          headers: {
            Authorization: token,
          },
        });
        setStatus("On Progress");
        setTasks([...tasks, response.data.newTask]);
      } catch (e) {
        console.error(e);
      }
      setTaskName("");
      setFormVisible(false); // Hide form after adding
    }
  };

  const handleDeleteDocument = async (docToDelete) => {
    if (typeToDelete === "obstetric") {
      setObstetricHistory(
        obstetricHistory.filter((doc) => doc !== docToDelete)
      );
    } else if (typeToDelete === "medical") {
      setMedicalHistory(medicalHistory.filter((doc) => doc !== docToDelete));
    } else if (typeToDelete === "surgical") {
      setSurgicalHistory(surgicalHistory.filter((doc) => doc !== docToDelete));
    } else {
      setDocuments(documents.filter((doc) => doc !== docToDelete));
    }

    try {
      await axios.delete(
        `${API_URL}/record/${typeToDelete}?id=${docToDelete._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(`${API_URL}/auth/login`, {
        username: username,
        password: password,
      });
      setIsAuthenticated(true);
      setError("");
    } catch (error) {
      if (error.response.status === 401) {
        setError("Incorrect password");
      } else {
        console.error(error);
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const conceptionDate =
    patientInfo && patientInfo.userId && patientInfo.userId.pregnancyStartDate
      ? moment(patientInfo.userId.pregnancyStartDate)
      : moment.invalid();

  // Calculate estimated due date (40 weeks later)
  const dueDate = conceptionDate.clone().add(40, "weeks");
  // Get current date and calculate weeks passed since conception
  const currentDate = moment();
  const weeksPassed = currentDate.diff(conceptionDate, "weeks");

  const handleDocumentClick = (docName) => {
    // Set selected document and its image URL
    setSelectedDocument(docName);
  };

  //get task
  useEffect(() => {
    let patientId;
    async function fetchPatient() {
      try {
        const response = await axios.get(
          `${API_URL}/record/patient/u?id=${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setPatientInfo(response.data);
        setPatientUserId(response.data.userId._id);
        patientId = response.data.userId._id;

        fetchTasks();
        fetchDocuments();
        fetchObstetricHistory();
        fetchMedicalHistory();
        fetchSurgicalHistory();
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchTasks() {
      try {
        const response = await axios.get(
          `${API_URL}/record/task/u?userId=${patientId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchCurrentDoctor() {
      try {
        const response = await axios.get(`${API_URL}/user?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
        setPrescribedBy(response.data.other.fullName);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchDocuments() {
      try {
        const response = await axios.get(
          `${API_URL}/record/document/u?userId=${patientId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setDocuments(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchObstetricHistory() {
      try {
        const response = await axios.get(
          `${API_URL}/record/obstetric/u?userId=${patientId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setObstetricHistory(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchMedicalHistory() {
      try {
        const response = await axios.get(
          `${API_URL}/record/medical/u?userId=${patientId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setMedicalHistory(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchSurgicalHistory() {
      try {
        const response = await axios.get(
          `${API_URL}/record/surgical/u?userId=${patientId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setSurgicalHistory(response.data.reverse());
      } catch (error) {
        console.error(error);
      }
    }

    fetchPatient();
    fetchCurrentDoctor();
  }, []);

  const handleClose = () => {
    setSelectedDocument(null);
    setSelectedEntry(null);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = selectedDocument.documentLink; // Use the file URL from selectedDocument
    link.setAttribute("download", selectedDocument.name); // Set the download attribute with the filename
    link.setAttribute("target", "_blank"); // Open in a new tab
    document.body.appendChild(link); // Append the link to the body
    link.click(); // Simulate click to trigger download
    document.body.removeChild(link); // Remove the link from the document
  };

  const handlePrint = () => {
    const printWindow = window.open(selectedDocument.documentLink, "_blank");
    printWindow.onload = () => {
      printWindow.print(); // Trigger print when the document is loaded
    };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const [obstetricHistory, setObstetricHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [surgicalHistory, setSurgicalHistory] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleFileChange = (event) => {
    setModalData({ ...modalData, file: event.target.files[0] });
  };

  const openModal = (type, index = null) => {
    if (index !== null) {
      const existingEntry =
        type === "Obstetric"
          ? obstetricHistory[index]
          : type === "Medical"
          ? medicalHistory[index]
          : surgicalHistory[index];
      setModalData({ ...existingEntry, type });
      setCurrentIndex(index);
    } else {
      setModalData({ type });
      setCurrentIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({
      type: "",
      date: "",
      text: "",
      diagnosis: "",
      status: "",
      duration: "",
      file: null,
    });
  };

  const saveEntry = async () => {
    const { type, file } = modalData;

    if (!file) return alert("Please select a file to upload.");

    if (type === "Obstetric" || type === "Surgical") {
      if (!modalData.date) return alert("Please select a date.");
      if (!modalData.content) return alert("Please enter a description.");
    } else if (type === "Medical") {
      if (!modalData.diagnosis) return alert("Please enter a diagnosis.");
      if (!modalData.status) return alert("Please enter the status.");
      if (!modalData.duration) return alert("Please enter the duration.");
    }

    const formData = new FormData();
    formData.append("document", file);
    let documentLink;

    try {
      const response = await axios.post(
        `${API_URL}/upload/d?userId=${patientUserId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      documentLink = response.data.documentLink;
    } catch (err) {
      console.error(err);
    }

    if (type === "Obstetric") {
      const newEntry = {
        date: modalData.date,
        content: modalData.content,
        documentLink: documentLink,
        userId: patientUserId,
      };

      try {
        const response = await axios.post(
          `${API_URL}/record/obstetric`,
          newEntry,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setObstetricHistory((prev) => [
          response.data.newObstetricHistory,
          ...prev,
        ]);
      } catch (err) {
        console.error(err);
      }
    } else if (type === "Medical") {
      const newEntry = {
        diagnosis: modalData.diagnosis,
        status: modalData.status,
        duration: modalData.duration,
        documentLink: documentLink,
        userId: patientUserId,
      };

      try {
        const response = await axios.post(
          `${API_URL}/record/medical`,
          newEntry,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setMedicalHistory((prev) => [response.data.newMedicalHistory, ...prev]);
      } catch (err) {
        console.error(err);
      }
    } else if (type === "Surgical") {
      const newEntry = {
        date: modalData.date,
        content: modalData.content,
        documentLink: documentLink,
        userId: patientUserId,
      };

      try {
        const response = await axios.post(
          `${API_URL}/record/surgical`,
          newEntry,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setSurgicalHistory((prev) => [
          response.data.newSurgicalHistory,
          ...prev,
        ]);
      } catch (err) {
        console.error(err);
      }
    }

    closeModal();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center">
          <div className="absolute inset-0 bg-[#7c459cda] z-0"></div>
          <Link
            to="/app"
            className="absolute top-4 left-4 text-white text-[40px] z-10 p-2 rounded hover:bg-[#9a6cb4]"
          >
            <IoChevronBackCircle />
          </Link>
          <div className="relative z-10 flex flex-col items-center px-4">
            <div className="flex items-center mb-4">
              <IoLockClosed className="text-white text-[40px] mr-2" />
              <p className="text-white text-[32px] italic font-bold">
                MatriCare
              </p>
            </div>
            <h3 className="text-white text-[22px] mb-4">Enter Password</h3>
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col items-center"
            >
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-4 rounded-full border border-gray-300 w-[250px] mb-4"
              />
              <button
                type="submit"
                className="bg-[#e39fa9] text-white rounded-full px-6 py-2 text-[16px] hover:bg-[#7c459c]"
              >
                Submit
              </button>
            </form>
            {error && <p className="text-[#e39fa9] mt-2">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen bg-[#9a6cb4] font-['Lucida_Sans','Lucida_Sans_Regular','Lucida_Grande','Lucida_Sans_Unicode',Geneva,Verdana,sans-serif]">
          <main className="flex-1 p-4 lg:p-5 bg-white/90 relative">
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 lg:top-[50px] lg:left-[70px] text-[#7c459c] text-[30px] z-10 hover:text-[#e39fa9]"
            >
              <IoMdArrowRoundBack />
            </button>

            <div className="mb-6 mt-12 ml-4 lg:mb-8 lg:mt-[30px] lg:ml-[100px]">
              <h2 className="text-[24px] lg:text-[30px] text-[#7c459c] text-left">
                Patients
              </h2>
            </div>

            {/* Main Content Container */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
              {/* Left Column */}
              <div className="w-full lg:w-[70%] lg:ml-[40px]">
                {/* Patient Info Section */}
                <div className="bg-white rounded-[10px] p-4 lg:p-5 shadow-lg flex flex-col gap-5 mb-6">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <img
                      src={
                        patientInfo &&
                        patientInfo.userId &&
                        patientInfo.userId.profilePicture
                          ? patientInfo.userId.profilePicture
                          : "/img/profilePicture.jpg"
                      }
                      alt="Patient Photo"
                      className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] rounded-full object-cover lg:mt-[-5px] lg:ml-[30px]"
                    />
                    <div className="flex flex-col gap-2 lg:ml-[30px] lg:mt-[-20px]">
                      <h3 className="mb-[-5px] text-lg lg:text-xl">
                        {patientInfo && patientInfo.fullName}
                      </h3>
                      <p className="text-sm lg:text-base">
                        {patientInfo &&
                        patientInfo.userId &&
                        patientInfo.userId.birthdate
                          ? `${formatDate(
                              patientInfo.userId.birthdate
                            )} : ${calculateAge(
                              patientInfo.userId.birthdate
                            )} yrs old`
                          : "Birthdate not set"}
                      </p>
                      <div className="flex items-center gap-1">
                        <FaMobileAlt className="text-[16px] text-[#333]" />
                        <p className="text-sm lg:text-base">
                          {patientInfo && patientInfo.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row w-full lg:ml-[50px] p-2 gap-4 lg:gap-5">
                      <div className="flex flex-col gap-2 lg:border-l-2 border-[#ccc] lg:pl-5">
                        <h4 className="font-bold text-[#666] text-[12px] m-0">
                          Home Address:
                        </h4>
                        <p className="text-sm">
                          {patientInfo &&
                            patientInfo.userId &&
                            patientInfo.userId.address}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 lg:border-l-2 border-[#ccc] lg:pl-5">
                        <h4 className="font-bold text-[#666] text-[12px] m-0">
                          Email Address:
                        </h4>
                        <p className="text-sm">
                          {patientInfo && patientInfo.email}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 lg:border-l-2 border-[#ccc] lg:pl-5">
                        <h4 className="font-bold text-[#666] text-[12px] m-0">
                          Husband/Partner:
                        </h4>
                        <p className="text-sm">
                          {patientInfo &&
                            patientInfo.userId &&
                            patientInfo.userId.husband}
                        </p>
                        <div className="flex items-center gap-1">
                          <FaMobileAlt className="text-[16px] text-[#333]" />
                          <p className="text-sm">
                            {patientInfo &&
                              patientInfo.userId &&
                              patientInfo.userId.husbandNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-[10px] p-4 lg:p-5 shadow-lg overflow-x-auto mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[16px] lg:text-[18px] font-bold">
                      Outstanding Tasks
                    </h4>
                    <button
                      className="bg-transparent text-[#7c459c] border-none text-[14px] lg:text-[16px] font-bold hover:text-[#e39fa9]"
                      onClick={() => setFormVisible(!formVisible)}
                    >
                      {formVisible ? "- Cancel" : "+ Add"}
                    </button>
                  </div>

                  {formVisible && (
                    <div className="flex flex-col lg:flex-row gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Enter Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="p-2 rounded border border-[#ccc] flex-1 min-w-0"
                      />
                      <button
                        className="bg-[#7c459c] text-white px-4 py-2 rounded hover:bg-[#6a3e8a] whitespace-nowrap"
                        onClick={handleAddTask}
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-[95%] border-separate mt-2 ml-10 rounded-[8px] border-spacing-y-[15px] max-[600px]:ml-0 max-[600px]:w-full">
                      <thead>
                        <tr>
                          <th className="p-2 text-center border-b border-[#ddd]"></th>
                          <th className="p-2 text-center border-b border-[#ddd] text-sm lg:text-base">
                            Task Name
                          </th>
                          <th className="p-2 text-center border-b border-[#ddd] text-sm lg:text-base">
                            Prescribed On
                          </th>
                          <th className="p-2 text-center border-b border-[#ddd] text-sm lg:text-base">
                            Status
                          </th>
                          <th className="p-2 text-center border-b border-[#ddd] text-sm lg:text-base">
                            Prescribed By
                          </th>
                          <th className="p-2 text-center border-b border-[#ddd] text-sm lg:text-base">
                            Order Number
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks &&
                          tasks.map((task, index) => (
                            <tr key={index}>
                              <td className="p-2 text-center">
                                <FaFileAlt />
                              </td>
                              <td className="p-2 text-center text-sm lg:text-base">
                                {task.taskName}
                              </td>
                              <td className="p-2 text-center text-sm lg:text-base">
                                {task.prescribedDate.split("T")[0]}
                              </td>
                              <td className="p-2 text-center text-sm lg:text-base">
                                {task.status ? task.status : status}
                              </td>
                              <td className="p-2 text-center text-sm lg:text-base">
                                {task.prescribedBy}
                              </td>
                              <td className="p-2 text-center text-sm lg:text-base">
                                {task.orderNumber}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                  {/* Obstetric */}
                  <div className="bg-white rounded-[10px] p-4 lg:p-5 shadow-lg h-[300px] flex flex-col justify-between">
                    <h4 className="mb-2 text-[18px] mt-2">Obstetric History</h4>
                    <ul className="list-none p-0 m-0 overflow-y-auto flex-grow mt-2">
                      {obstetricHistory.map((entry, index) => (
                        <li
                          key={index}
                          className="mb-5 p-2 border-b border-[#cccccca8] cursor-pointer"
                          onClick={() => handleEntryClick(entry)}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                            <span className="text-sm lg:text-base">
                              {formatDate(entry.date)}
                            </span>
                            <span className="text-sm lg:text-base mt-1 lg:mt-0">
                              {entry.content}
                            </span>
                            <button
                              className="bg-transparent border-none mt-2 lg:mt-0 self-start lg:self-center"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setTypeToDelete("obstetric");
                                setDocumentToDelete(entry);
                                setModalOpen(true);
                              }}
                              aria-label="Delete Document"
                            >
                              <IoTrashOutline className="text-red-600 cursor-pointer text-[20px]" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="bg-[#9a6cb4] border-none text-white text-[14px] rounded px-3 py-1 mt-2"
                      onClick={() => openModal("Obstetric")}
                    >
                      Add
                    </button>
                  </div>

                  {/* Medical */}
                  <div className="bg-white rounded-[10px] p-4 lg:p-5 shadow-lg h-[300px] flex flex-col justify-between">
                    <h4 className="mb-2 text-[18px] mt-2">Medical History</h4>
                    <ul className="list-none p-0 m-0 overflow-y-auto flex-grow mt-2">
                      {medicalHistory.map((entry, index) => (
                        <li
                          key={index}
                          className="mb-5 p-2 border-b border-[#cccccca8] cursor-pointer"
                          onClick={() => handleEntryClick(entry)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex flex-col lg:flex-row lg:justify-between">
                                <span className="text-sm lg:text-base">
                                  {entry.diagnosis}
                                </span>
                                <span className="text-sm lg:text-base mt-1 lg:mt-0">
                                  {entry.status}
                                </span>
                              </div>
                              <div className="text-[12px] mt-1">
                                {entry.duration}
                              </div>
                            </div>
                            <button
                              className="bg-transparent border-none ml-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setTypeToDelete("medical");
                                setDocumentToDelete(entry);
                                setModalOpen(true);
                              }}
                              aria-label="Delete Document"
                            >
                              <IoTrashOutline className="text-red-600 cursor-pointer text-[20px]" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="bg-[#9a6cb4] border-none text-white text-[14px] rounded px-3 py-1 mt-2"
                      onClick={() => openModal("Medical")}
                    >
                      Add
                    </button>
                  </div>

                  {/* Surgical */}
                  <div className="bg-white rounded-[10px] p-4 lg:p-5 shadow-lg h-[300px] flex flex-col justify-between">
                    <h4 className="mb-2 text-[18px] mt-2">Surgical History</h4>
                    <ul className="list-none p-0 m-0 overflow-y-auto flex-grow mt-2">
                      {surgicalHistory.map((entry, index) => (
                        <li
                          key={index}
                          className="mb-5 p-2 border-b border-[#cccccca8] cursor-pointer"
                          onClick={() => handleEntryClick(entry)}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                            <span className="text-sm lg:text-base">
                              {formatDate(entry.date)}
                            </span>
                            <span className="text-sm lg:text-base mt-1 lg:mt-0">
                              {entry.content}
                            </span>
                            <button
                              className="bg-transparent border-none mt-2 lg:mt-0 self-start lg:self-center"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setTypeToDelete("surgical");
                                setDocumentToDelete(entry);
                                setModalOpen(true);
                              }}
                              aria-label="Delete Document"
                            >
                              <IoTrashOutline className="text-red-600 cursor-pointer text-[20px]" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="bg-[#9a6cb4] border-none text-white text-[14px] rounded px-3 py-1 mt-2"
                      onClick={() => openModal("Surgical")}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="w-full lg:w-[400px] lg:ml-6 flex flex-col gap-5">
                {/* Weeks Count */}
                <div className="bg-white p-4 lg:p-5 rounded-[8px] shadow-lg h-auto lg:h-[200px]">
                  <div className="flex flex-col lg:flex-row justify-between items-center mt-5 w-full gap-4">
                    <div className="flex flex-col justify-center items-start flex-grow lg:ml-1">
                      <h4 className="mb-4 lg:mb-10 mt-0 lg:mt-[-30px]">
                        Weeks Count
                      </h4>
                      <p className="text-sm lg:text-base">
                        Estimated Pregnancy <br />
                        Due Date: <br />
                        <strong>
                          {dueDate.isValid()
                            ? dueDate.format("MMMM D, YYYY")
                            : "N/A"}
                        </strong>
                      </p>
                    </div>
                    <div className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] rounded-full border-[8px] border-[#e39fa9] flex justify-center items-center text-[32px] lg:text-[46px] font-bold text-[#7c459c] lg:ml-5">
                      {dueDate.isValid() ? weeksPassed : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white p-4 lg:p-5 rounded-[8px] shadow-lg h-[400px] lg:h-[460px] overflow-y-auto">
                  <div>
                    <h4 className="mt-2 mb-4">Documents</h4>
                    {documents.map((doc, index) => (
                      <div
                        key={doc._id}
                        className="flex justify-between items-center p-2 cursor-pointer mb-2 hover:bg-[#e39fa972] hover:p-4 hover:rounded"
                        onClick={() => handleDocumentClick(doc)}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <span className="mr-2 text-[#7c459c] text-[20px] flex-shrink-0">
                            <FaFilePdf />
                          </span>
                          <span className="text-sm lg:text-base truncate">
                            {doc.name}
                          </span>
                        </div>
                        <span className="text-[12px] lg:text-[14px] text-[#666] ml-2 flex-shrink-0">
                          {formatDate(doc.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {issModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                <div className="flex flex-col items-center p-5 rounded bg-white shadow-lg w-full max-w-sm">
                  <IoTrashOutline className="text-red-600 text-[50px] mb-2" />
                  <h3 className="font-bold mb-4 text-center">
                    Are you sure you want to delete this?
                  </h3>
                  <button
                    className="bg-[#9a6cb4] text-white px-4 py-2 rounded mb-2 w-full"
                    onClick={() => {
                      handleDeleteDocument(documentToDelete);
                      setModalOpen(false);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-[#ccc] text-[#333] px-4 py-2 rounded w-full"
                    onClick={() => setModalOpen(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {/* Selected Entry Modal */}
            {selectedEntry && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                <div className="bg-white p-4 lg:p-5 rounded shadow-lg w-full max-w-2xl h-[90vh] lg:h-[800px] relative flex flex-col">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-[24px] bg-transparent hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    &times;
                  </button>
                  <div className="text-left ml-2 lg:ml-6 mt-6 mb-4">
                    <p className="text-sm lg:text-base">
                      Date:{" "}
                      {selectedEntry && selectedEntry.duration
                        ? selectedEntry.duration
                        : formatDate(selectedEntry.date)}
                    </p>
                    {selectedEntry.content && (
                      <p className="text-sm lg:text-base">
                        Details: {selectedEntry.content}
                      </p>
                    )}
                    {selectedEntry.diagnosis && (
                      <p className="text-sm lg:text-base">
                        Diagnosis: {selectedEntry.diagnosis}
                      </p>
                    )}
                    {selectedEntry.status && (
                      <p className="text-sm lg:text-base">
                        Status: {selectedEntry.status}
                      </p>
                    )}
                  </div>
                  <embed
                    src={selectedEntry.documentLink}
                    type="application/pdf"
                    width="100%"
                    className="flex-1 min-h-0"
                  />
                </div>
              </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                <div className="bg-white p-4 lg:p-5 rounded-[10px] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative">
                  <span
                    className="absolute top-4 right-4 text-[28px] font-bold cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={closeModal}
                  >
                    &times;
                  </span>
                  <h2 className="border-l-[15px] border-[#9a6cb4] text-left pl-5 mb-4 text-lg lg:text-xl">
                    {modalData.type} History
                  </h2>
                  <div className="flex flex-col gap-3 mb-4 mt-6 lg:mt-10">
                    {modalData.type === "Obstetric" && (
                      <>
                        <input
                          type="date"
                          name="date"
                          value={modalData.date}
                          onChange={handleChange}
                          required
                          className="w-full p-2 border border-[#ccc] rounded"
                        />
                        <input
                          type="text"
                          name="content"
                          value={modalData.content}
                          onChange={handleChange}
                          placeholder="Description"
                          required
                          className="w-full p-2 border border-[#ccc] rounded"
                        />
                      </>
                    )}
                    {modalData.type === "Medical" && (
                      <>
                        <input
                          type="text"
                          name="diagnosis"
                          value={modalData.diagnosis}
                          onChange={handleChange}
                          placeholder="Diagnosis"
                          required
                          className="w-full p-2 border border-[#ccc] rounded"
                        />
                        <input
                          type="text"
                          name="status"
                          value={modalData.status}
                          onChange={handleChange}
                          placeholder="Status"
                          required
                          className="w-full p-2 border border-[#ccc] rounded"
                        />
                        <input
                          type="text"
                          name="duration"
                          value={modalData.duration}
                          onChange={handleChange}
                          placeholder="Duration"
                          required
                          className="w-full p-2 border border-[#ccc] rounded"
                        />
                      </>
                    )}
                    {modalData.type === "Surgical" && (
                      <>
                        <input
                          type="date"
                          name="date"
                          value={modalData.date}
                          onChange={handleChange}
                          required
                          className="w-full p-2 border border-[#ccc] rounded"
                        />
                        <input
                          type="text"
                          name="content"
                          value={modalData.content}
                          onChange={handleChange}
                          placeholder="Description"
                          required
                          className="w-full p-2 border border-[#ccc] rounded"
                        />
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4 w-full"
                  />
                  <button
                    className="bg-[#9a6cb4] text-white rounded-[10px] px-6 py-2 w-full lg:w-auto lg:ml-auto mt-4 hover:bg-[#7c459c]"
                    onClick={saveEntry}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Document Details View */}
            {selectedDocument && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                <div className="bg-white p-4 lg:p-5 rounded shadow-lg w-full max-w-2xl h-[90vh] lg:h-[800px] relative flex flex-col">
                  <button
                    className="absolute top-4 right-4 text-[24px] bg-transparent hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={handleClose}
                    aria-label="Close Modal"
                  >
                    &times;
                  </button>
                  <div className="text-left ml-2 lg:ml-6 mt-6 mb-4">
                    <p className="text-sm lg:text-base">
                      {formatDate(selectedDocument.date)}
                    </p>
                    <p className="text-sm lg:text-base">
                      {selectedDocument.name}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleDownload}
                        aria-label="Download Document"
                        className="mr-2 text-[20px] text-[#7c459c] hover:bg-gray-100 p-1 rounded"
                      >
                        <FcDownload />
                      </button>
                      <button
                        onClick={handlePrint}
                        aria-label="Print Document"
                        className="text-[20px] text-[#7c459c] hover:bg-gray-100 p-1 rounded"
                      >
                        <FcPrint />
                      </button>
                    </div>
                  </div>
                  <embed
                    src={selectedDocument.documentLink}
                    type="application/pdf"
                    width="100%"
                    className="flex-1 min-h-0"
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default PatientRecords;
