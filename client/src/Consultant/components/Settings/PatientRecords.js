import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/settings/patientrecords.css";
import { FaMobileAlt, FaFileAlt, FaFilePdf } from "react-icons/fa";
import { IoChevronBackCircle, IoLockClosed, IoTrashOutline } from "react-icons/io5";
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

  const handleDeleteDocument = (docToDelete) => {
    setDocuments(documents.filter(doc => doc !== docToDelete));
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
        // response.data.map((i) => {
        setTasks(response.data);
        // });
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
        setDocuments(response.data);
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
        setObstetricHistory(response.data);
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
        setMedicalHistory(response.data);
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
        setSurgicalHistory(response.data);
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
    // const newDocument = { name: newDocName, date: newDocDate, userId: userID };

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
        await axios.post(
          `${API_URL}/record/obstetric`,
          newEntry,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const updatedHistory =
          currentIndex !== null
            ? obstetricHistory.map((entry, i) =>
                i === currentIndex ? newEntry : entry
              )
            : [...obstetricHistory, newEntry];

        setObstetricHistory(updatedHistory);
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
        await axios.post(
          `${API_URL}/record/medical`,
          newEntry,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const updatedHistory =
          currentIndex !== null
            ? medicalHistory.map((entry, i) =>
                i === currentIndex ? newEntry : entry
              )
            : [...medicalHistory, newEntry];
        setMedicalHistory(updatedHistory);
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
      const updatedHistory =
        currentIndex !== null
          ? surgicalHistory.map((entry, i) =>
              i === currentIndex ? newEntry : entry
            )
          : [...surgicalHistory, newEntry];
      setSurgicalHistory(updatedHistory);

      try {
        await axios.post(
          `${API_URL}/record/surgical`,
          newEntry,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const updatedHistory =
          currentIndex !== null
            ? surgicalHistory.map((entry, i) =>
                i === currentIndex ? newEntry : entry
              )
            : [...surgicalHistory, newEntry];
        setSurgicalHistory(updatedHistory);
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
        <div className="MR-pass-container">
          <div
            className="MR-pass-background-image"
            style={{ backgroundImage: `url('/img/bg6.jpg')` }}
          ></div>
          <div className="MR-pass-overlay"></div>
          <Link to="/app" className="MR-pass-back-button">
            <IoChevronBackCircle />
          </Link>
          <div className="MR-pass-left-section">
            <div className="MR-pass-lock-icon">
              <IoLockClosed />
              <p>MatriCare</p>
            </div>
          </div>
          <h3 className="MR-pass-title">Enter Password</h3>
          <form onSubmit={handlePasswordSubmit} className="MR-pass-form">
            <div className="MR-pass-input-container">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="MR-pass-button">
                Submit
              </button>
            </div>
          </form>
          {error && <p className="MR-pass-error">{error}</p>}
        </div>
      ) : (
        <div className="patient-records-container">
          <main className="patient-records-main-content">
            <div onClick={handleBack} className="PR-back-button">
              <IoMdArrowRoundBack />
            </div>
            <div className="PR-label">
              <h2>Patients</h2>
            </div>
            <div className="PR-top-section">
              <div className="PR-patient-info">
                <img
                  src={
                    patientInfo &&
                    patientInfo.userId &&
                    patientInfo.userId.profilePicture
                      ? patientInfo.userId.profilePicture
                      : "/img/profilePicture.jpg"
                  }
                  alt="Patient Photo"
                />
                <div className="PR-patient-details">
                  <h3>{patientInfo && patientInfo.fullName}</h3>
                  <p>
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
                  <div className="PR-phone-info">
                    <FaMobileAlt className="PR-phone-icon" />
                    <p>{patientInfo && patientInfo.phoneNumber}</p>
                  </div>
                </div>
              </div>
              <div className="PR-info-columns">
                <div className="PR-address-info">
                  <h4>Home Address:</h4>
                  <p>
                    {patientInfo &&
                      patientInfo.userId &&
                      patientInfo.userId.address}
                  </p>
                </div>
                <div className="PR-email-info">
                  <h4>Email Address:</h4>
                  <p>{patientInfo && patientInfo.email}</p>
                </div>
                <div className="PR-partner-info">
                  <h4>Husband/Partner:</h4>
                  <p>
                    {patientInfo &&
                      patientInfo.userId &&
                      patientInfo.userId.husband}
                  </p>
                  <div className="PR-partner-contact">
                    <FaMobileAlt className="PR-phone-icon" />
                    <p>
                      {patientInfo &&
                        patientInfo.userId &&
                        patientInfo.userId.husbandNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="PR-outstanding-tasks">
              <div className="PR-header">
                <h4>Outstanding Tasks</h4>
                <button
                  className="add-task-button"
                  onClick={() => setFormVisible(!formVisible)}
                >
                  {formVisible ? "- Cancel" : "+ Add"}
                </button>
              </div>
              {formVisible && (
                <div className="PR-form">
                  <input
                    type="text"
                    placeholder="Enter Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                  <button
                    className="submit-task-button"
                    onClick={handleAddTask}
                  >
                    Submit
                  </button>
                </div>
              )}
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Task Name</th>
                    <th>Prescribed On</th>
                    <th>Status</th>
                    <th>Prescribed By</th>
                    <th>Order Number</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks &&
                    tasks.map((task, index) => (
                      <tr key={index}>
                        <td>
                          <FaFileAlt />
                        </td>
                        <td>{task.taskName}</td>
                        <td>{task.prescribedDate.split("T")[0]}</td>
                        <td>{task.status ? task.status : status}</td>
                        <td>{task.prescribedBy}</td>
                        <td>{task.orderNumber}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="PR-main-content">
              <div className="PR-panel PR-Obstetric">
                <h4>Obstetric History</h4>
                <ul>
                  {obstetricHistory.map((entry, index) => (
                    <li key={index} onClick={() => handleEntryClick(entry)}>
                      <span className="date">{formatDate(entry.date)}</span>
                      <span className="text">{entry.content}</span>
                      {entry.file && (
                        <span className="file">{entry.file.name}</span>
                      )}
                      <button
                      className="PRM-delete-docu-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the document click event
                        setDocumentToDelete(entry); // Store the document to delete
                        setModalOpen(true); // Open the modal
                      }}
                      aria-label="Delete Document" // Accessibility label
                    >
                      <IoTrashOutline className="PRM-delete-icon" />
                    </button>
                    {issModalOpen && (
                    <div className="PRM-modal-overlay">
                      <div className="PRM-modal-content">
                      <IoTrashOutline className="PRM-delete-icon" />
                      <h3 className="PRM-modal-header">Are you sure you want to delete this?</h3>
                      <button 
                        className="PRM-confirm-button" 
                        onClick={() => {
                          handleDeleteDocument(documentToDelete); // Call delete function
                          setModalOpen(false); // Close the modal
                        }}>
                        Yes
                      </button>
                      <button 
                        className="PRM-cancel-button" 
                        onClick={() => setModalOpen(false)}>
                        No
                      </button>
                      </div>
                    </div>
                  )}
                    </li>
                  ))}
                </ul>

                {selectedEntry && (
                  <div className="modal-overlay">
                    <div className="selected-docu">
                      <button
                        onClick={handleClose}
                        className="selected-docu-close"
                      >
                        &times;
                      </button>
                      <div className="document-info">
                        <p>Date: {formatDate(selectedEntry.date)}</p>
                        <p>Details: {selectedEntry.content}</p>
                      </div>
                      <embed
                        src={selectedEntry.selectedEntry}
                        type="application/pdf"
                        width="100%"
                        height="600px"
                      />
                    </div>
                  </div>
                )}

                <button
                  className="PR-Add"
                  onClick={() => openModal("Obstetric")}
                >
                  Add
                </button>
              </div>

              <div className="PR-panel PR-Medical">
                <h4>Medical History</h4>
                <ul>
                  {medicalHistory.map((entry, index) => (
                    <li key={index} onClick={() => handleEntryClick(entry)}>
                      <div className="diagnosis-info">
                        <span className="diagnosis">{entry.diagnosis}</span>
                        <span className="status">{entry.status}</span>
                      </div>
                      <div className="diagnosis-duration">{entry.duration}</div>
                      {entry.file && (
                        <span className="file">{entry.file.name}</span>
                      )}
                      <button
                      className="PRM-delete-docu-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the document click event
                        setDocumentToDelete(entry); // Store the document to delete
                        setModalOpen(true); // Open the modal
                      }}
                      aria-label="Delete Document" // Accessibility label
                    >
                      <IoTrashOutline className="PRM-delete-icon" />
                    </button>
                    {issModalOpen && (
                    <div className="PRM-modal-overlay">
                      <div className="PRM-modal-content">
                      <IoTrashOutline className="PRM-delete-icon" />
                      <h3 className="PRM-modal-header">Are you sure you want to delete this?</h3>
                      <button 
                        className="PRM-confirm-button" 
                        onClick={() => {
                          handleDeleteDocument(documentToDelete); // Call delete function
                          setModalOpen(false); // Close the modal
                        }}>
                        Yes
                      </button>
                      <button 
                        className="PRM-cancel-button" 
                        onClick={() => setModalOpen(false)}>
                        No
                      </button>
                      </div>
                    </div>
                  )}
                    </li>
                  ))}
                </ul>
                {selectedEntry && (
                  <div className="modal-overlay">
                    <div className="selected-docu">
                      <button
                        onClick={handleClose}
                        className="selected-docu-close"
                      >
                        &times;
                      </button>
                      <div className="document-info">
                        <p>Date: {formatDate(selectedEntry.date)}</p>
                        <p>Diagnosis: {selectedEntry.diagnosis}</p>
                        <p>Status: {selectedEntry.status}</p>
                      </div>
                      <embed
                        src={selectedEntry.selectedEntry}
                        type="application/pdf"
                        width="100%"
                        height="600px"
                      />
                    </div>
                  </div>
                )}

                <button className="PR-Add" onClick={() => openModal("Medical")}>
                  Add
                </button>
              </div>

              <div className="PR-panel PR-Surgical">
                <h4>Surgical History</h4>
                <ul>
                  {surgicalHistory.map((entry, index) => (
                    <li key={index} onClick={() => handleEntryClick(entry)}>
                      <span className="date">{formatDate(entry.date)}</span>
                      <span className="text">{entry.content}</span>
                      {entry.file && (
                        <span className="file">{entry.file.name}</span>
                      )}
                      <button
                      className="PRM-delete-docu-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the document click event
                        setDocumentToDelete(entry); // Store the document to delete
                        setModalOpen(true); // Open the modal
                      }}
                      aria-label="Delete Document" // Accessibility label
                    >
                      <IoTrashOutline className="PRM-delete-icon" />
                    </button>
                    {issModalOpen && (
                    <div className="PRM-modal-overlay">
                      <div className="PRM-modal-content">
                      <IoTrashOutline className="PRM-delete-icon" />
                      <h3 className="PRM-modal-header">Are you sure you want to delete this?</h3>
                      <button 
                        className="PRM-confirm-button" 
                        onClick={() => {
                          handleDeleteDocument(documentToDelete); // Call delete function
                          setModalOpen(false); // Close the modal
                        }}>
                        Yes
                      </button>
                      <button 
                        className="PRM-cancel-button" 
                        onClick={() => setModalOpen(false)}>
                        No
                      </button>
                      </div>
                    </div>
                  )}
                    </li>
                  ))}
                </ul>
                {selectedEntry && (
                  <div className="modal-overlay">
                    <div className="selected-docu">
                      <button
                        onClick={handleClose}
                        className="selected-docu-close"
                      >
                        &times;
                      </button>
                      <div className="document-info">
                        <p>
                          Date:{" "}
                          {selectedEntry && selectedEntry.duration
                            ? selectedEntry.duration
                            : formatDate(selectedEntry.date)}
                        </p>
                        <p>Details: {selectedEntry.content}</p>
                      </div>
                      <embed
                        src={selectedEntry.documentLink}
                        type="application/pdf"
                        width="100%"
                        height="600px"
                      />
                    </div>
                  </div>
                )}
                <button
                  className="PR-Add"
                  onClick={() => openModal("Surgical")}
                >
                  Add
                </button>
              </div>
            </div>

            {isModalOpen && (
              <div className="PR-modal">
                <div className="PR-modal-content">
                  <span className="PR-modal-close" onClick={closeModal}>
                    &times;
                  </span>
                  <h2>{modalData.type} History</h2>
                  <div className="PR-input-row">
                    {modalData.type === "Obstetric" && (
                      <>
                        <input
                          type="date"
                          name="date"
                          value={modalData.date}
                          onChange={handleChange}
                          required
                        />
                        <input
                          type="text"
                          name="content"
                          value={modalData.content}
                          onChange={handleChange}
                          placeholder="Description"
                          required
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
                        />
                        <input
                          type="text"
                          name="status"
                          value={modalData.status}
                          onChange={handleChange}
                          placeholder="Status"
                          required
                        />
                        <input
                          type="text"
                          name="duration"
                          value={modalData.duration}
                          onChange={handleChange}
                          placeholder="Duration"
                          required
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
                        />
                        <input
                          type="text"
                          name="content"
                          value={modalData.content}
                          onChange={handleChange}
                          placeholder="Description"
                          required
                        />
                      </>
                    )}
                  </div>
                  <input type="file" onChange={handleFileChange} />
                  <button className="PR-Save" onClick={saveEntry}>
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="PR-right-panels">
              <div className="PR-weeks-count">
                <div className="PR-text-content">
                  <h4>Weeks Count</h4>
                  <p className="PR-due-date">
                    Estimated Pregnancy <br />
                    Due Date: <br />
                    <strong>
                      {dueDate.isValid()
                        ? dueDate.format("MMMM D, YYYY")
                        : "N/A"}
                    </strong>
                  </p>
                </div>
                <div className="PR-circle">
                  {dueDate.isValid() ? weeksPassed : "N/A"}
                </div>
              </div>
            </div>
            <div className="PR-patient-docu">
              <div className="PR-documents">
                <h4>Documents</h4>
                {documents.map((doc, index) => (
                  <div
                    key={doc._id}
                    className="PR-docu-item"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    <span className="docu-icon">
                      <FaFilePdf />
                    </span>
                    {doc.name}
                    <span className="docu-date">{formatDate(doc.date)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Document Details View */}
            {selectedDocument ? (
              <div className="modal-overlay">
                <div className="selected-docu">
                  <button
                    className="selected-docu-close"
                    onClick={handleClose}
                    aria-label="Close Modal"
                  >
                    &times;
                  </button>
                  <div className="document-info">
                    <p>{formatDate(selectedDocument.date)}</p>
                    <p>{selectedDocument.name}</p>
                    <div className="docu-button">
                      <button
                        onClick={handleDownload}
                        aria-label="Download Document"
                        className="docu-icon"
                      >
                        <FcDownload />
                      </button>
                      <button
                        onClick={handlePrint}
                        aria-label="Print Document"
                        className="docu-icon"
                      >
                        <FcPrint />
                      </button>
                    </div>
                  </div>
                  <embed
                    src={selectedDocument.documentLink}
                    type="application/pdf"
                    width="100%"
                    height="600px"
                  />
                </div>
              </div>
            ) : null}
          </main>
        </div>
      )}
    </>
  );
};

export default PatientRecords;
