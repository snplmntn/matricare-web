import React, { useEffect, useState } from "react";
import "../../styles/settings/medicalrec.css";
import {
  FaMobileAlt,
  FaFileAlt,
  FaFilePdf,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import moment from "moment";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import { Link } from "react-router-dom";

const MedicalRec = ({ user }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [patient, setPatient] = useState();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [status] = useState("In-Process");
  const prescribedBy = "Dra. Donna Jill A. Tungol";
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState([]);

  //STATE FOR STORING DATAS
  const [documents, setDocuments] = useState([
    { name: "ECG Test Report", date: "2024-02-25" },
    { name: "Medical History", date: "2024-03-15" },
  ]);

  const [obstetricHistory, setObstetricHistory] = useState([
    { date: "2024-02-25", text: "Miscarriage" },
    { date: "2024-02-25", text: "Ectopic" },
  ]);

  const [medicalHistory, setMedicalHistory] = useState([
    { diagnosis: "Asthma", status: "Active", duration: "From last 4 Months" },
    {
      diagnosis: "Hypertension",
      status: "Inactive",
      duration: "From last 2 Years",
    },
  ]);

  const [surgicalHistory, setSurgicalHistory] = useState([
    { date: "2024-02-25", text: "Appendicitis" },
    { date: "2024-02-25", text: "Tuberculosis" },
  ]);

  const conceptionDate = moment("2024-02-14");
  const dueDate = conceptionDate.clone().add(40, "weeks");
  const currentDate = moment();
  const weeksPassed = currentDate.diff(conceptionDate, "weeks");

  //STATES FOR ADDING

  //state for opening modals
  const [openAddObstreticModal, setOpenAddObstreticModal] = useState(false);
  const [openAddSurgicalModal, setOpenAddSurgicalModal] = useState(false);
  const [openAddMedicalModal, setOpenAddMedicalModal] = useState(false);
  const [openAddDocumentModal, setOpenAddDocumentModal] = useState(false);

  //state for add obstetric inputs
  const [obstetricTitle, setObstetricTitle] = useState("");
  const [obstetricDate, setObstetricDate] = useState("");

  //state for add surgical inputs
  const [surgicalTitle, setSurgicalTitle] = useState("");
  const [surgicalDate, setSurgicalDate] = useState("");

  //state for add medical inputs
  const [medicalTitle, setMedicalTitle] = useState("");
  const [addStatus, setAddStatus] = useState("");
  const [medicalDate2, setMedicalDate2] = useState("");

  const handleObstetricTitleChange = (e) => setObstetricTitle(e.target.value);
  const handleObstetricDateChange = (e) => setObstetricDate(e.target.value);

  const handleSurgicalTitleChange = (e) => setSurgicalTitle(e.target.value);
  const handleSurgicalDateChange = (e) => setSurgicalDate(e.target.value);

  const handleMedicalTitleChange = (e) => setMedicalTitle(e.target.value);
  const handleStatus = (e) => setAddStatus(e.target.value);
  const handleMedicalDate2Change = (e) => setMedicalDate2(e.target.value);

  // const handleTitleChange = (e) => {
  //   setTitle(e.target.value);
  // };

  // const handleDateChange = (e) => {
  //   setDate(e.target.value);
  // };

  //

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  //FOR EDITS

  // Handle input change for Obstetric History
  const handleObstetricChange = (index, key, value) => {
    const updatedObstetric = [...obstetricHistory];
    updatedObstetric[index][key] = value;
    setObstetricHistory(updatedObstetric);
  };

  // Handle input change for Medical History
  const handleMedicalChange = (index, key, value) => {
    const updatedMedical = [...medicalHistory];
    updatedMedical[index][key] = value;
    setMedicalHistory(updatedMedical);
  };

  // Handle input change for Surgical History
  const handleSurgicalChange = (index, key, value) => {
    const updatedSurgical = [...surgicalHistory];
    updatedSurgical[index][key] = value;
    setSurgicalHistory(updatedSurgical);
  };

  // Handle document name and date changes
  const handleDocumentChange = (index, field, value) => {
    const updatedDocs = [...documents];
    updatedDocs[index][field] = value;
    setDocuments(updatedDocs);
  };

  // Handle document click (to view or interact with document)
  const handleDocumentClick = (docName) => {
    console.log(`Viewing document: ${docName}`);
  };

  const handleCloseDetails = () => {
    setDetailsVisible(false);
    setSelectedDocument(null);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(
          `${API_URL}/record/task/u?userId=${userID}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setTasks(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTasks();
  }, []);

  //fetch current user
  useEffect(() => {
    async function fetchCurrentPatient() {
      try {
        const response = await axios.get(`${API_URL}/user?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
        setPatient(response.data.other);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCurrentPatient();
  }, []);

  return (
    <>
      <div className="MR-patient-records-container">
        <main className="MR-patient-records-main-content">
          <Link to="/app" className="MR-back-button">
            <IoMdArrowRoundBack />
          </Link>
          <div className="MR-top-section">
            <div className="MR-patient-info">
              <img src="img/topic2.jpg" alt="Patient Photo" />
              <div className="MR-patient-details">
                <h3>{patient && patient.fullName}</h3>
                <p>02/21/1996 (28 yrs old), F</p>
                <div className="MR-phone-info">
                  <FaMobileAlt className="MR-phone-icon" />
                  <p>{patient && patient.phoneNumber}</p>
                </div>
              </div>
            </div>
            <div className="MR-info-columns">
              <div className="MR-address-info">
                <h4>Home Address:</h4>
                <p>{patient && patient.address}</p>
              </div>
              <div className="MR-email-info">
                <h4>Email Address:</h4>
                <p>{patient && patient.email}</p>
              </div>
              <div className="MR-partner-info">
                <h4>Husband/Partner:</h4>
                <p>John Doe</p>
                <div className="MR-partner-contact">
                  <FaMobileAlt className="MR-phone-icon" />
                  <p>+63 905 4562 702</p>
                </div>
              </div>
            </div>
          </div>

          <div className="MR-outstanding-tasks">
            <div className="MR-header">
              <h4>Outstanding Tasks</h4>
            </div>

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
                {tasks.map((task, index) => (
                  <tr key={index}>
                    <td>
                      <FaFileAlt />
                    </td>
                    <td>{task.taskName}</td>
                    <td>{task.prescribedDate.split("T")[0]}</td>
                    <td>
                      <select
                        className="MR-select-status"
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(index, e.target.value)
                        }
                      >
                        <option value="On Progress">On Progress</option>
                        <option value="Complete">Complete</option>
                      </select>
                    </td>
                    <td>Dr. {task.prescribedBy}</td>
                    <td>{task.orderNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="MR-main-content">
            <div className="MR-panel MR-Obstetric">
              <h4>Obstetric History</h4>
              <button
                className="MR-edit-button"
                onClick={() => {
                  toggleEditMode();
                  setOpenAddObstreticModal(!openAddObstreticModal);
                  setOpenAddSurgicalModal(false);
                  setOpenAddMedicalModal(false);
                }}
              >
                {" "}
                {isEditing ? <FaSave /> : <FaEdit />} {isEditing ? "" : ""}{" "}
              </button>
              <ul>
                {obstetricHistory.map((item, index) => (
                  <li key={index}>
                    {isEditing ? (
                      <>
                        <input
                          type="date"
                          className="MR-input"
                          value={item.date}
                          onChange={(e) =>
                            handleObstetricChange(index, "date", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="MR-input"
                          value={item.text}
                          onChange={(e) =>
                            handleObstetricChange(index, "text", e.target.value)
                          }
                        />
                      </>
                    ) : (
                      <>
                        <span className="date">{item.date}</span>
                        <span className="text">{item.text}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="MR-panel MR-Medical">
              <h4>Medical History</h4>
              <button
                className="MR-edit-button"
                onClick={() => {
                  toggleEditMode();
                  setOpenAddMedicalModal(!openAddMedicalModal);

                  setOpenAddObstreticModal(false);
                  setOpenAddSurgicalModal(false);
                }}
              >
                {" "}
                {isEditing ? <FaSave /> : <FaEdit />} {isEditing ? "" : ""}{" "}
              </button>
              <ul>
                {medicalHistory.map((item, index) => (
                  <li key={index}>
                    <div className="diagnosis-info">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            className="MR-input"
                            value={item.diagnosis}
                            onChange={(e) =>
                              handleMedicalChange(
                                index,
                                "diagnosis",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            className="MR-input"
                            value={item.status}
                            onChange={(e) =>
                              handleMedicalChange(
                                index,
                                "status",
                                e.target.value
                              )
                            }
                          />
                        </>
                      ) : (
                        <>
                          <span className="diagnosis">{item.diagnosis}</span>
                          <span
                            className={`status ${
                              item.status === "Active" ? "active" : "inactive"
                            }`}
                          >
                            {item.status}
                          </span>
                        </>
                      )}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        className="MR-input"
                        value={item.duration}
                        onChange={(e) =>
                          handleMedicalChange(index, "duration", e.target.value)
                        }
                      />
                    ) : (
                      <div className="diagnosis-duration">{item.duration}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="MR-panel MR-Surgical">
              <h4>Surgical History</h4>
              <button
                className="MR-edit-button"
                onClick={() => {
                  toggleEditMode();
                  setOpenAddSurgicalModal(!openAddSurgicalModal);

                  setOpenAddObstreticModal(false);
                  setOpenAddMedicalModal(false);
                }}
              >
                {" "}
                {isEditing ? <FaSave /> : <FaEdit />} {isEditing ? "" : ""}{" "}
              </button>
              <ul>
                {surgicalHistory.map((item, index) => (
                  <li key={index}>
                    {isEditing ? (
                      <>
                        <input
                          type="date"
                          className="MR-input"
                          value={item.date}
                          onChange={(e) =>
                            handleSurgicalChange(index, "date", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="MR-input"
                          value={item.text}
                          onChange={(e) =>
                            handleSurgicalChange(index, "text", e.target.value)
                          }
                        />
                      </>
                    ) : (
                      <>
                        <span className="date">{item.date}</span>
                        <span className="text">{item.text}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="MR-right-panels">
            <div className="MR-weeks-count">
              <div className="MR-text-content">
                <h4>Weeks Count</h4>
                <p className="MR-due-date">
                  Estimated Pregnancy <br />
                  Due Date: <br />
                  <strong>{dueDate.format("MMMM D, YYYY")}</strong>
                </p>
              </div>
              <div className="MR-circle">{weeksPassed}</div>
            </div>
          </div>

          <div className="MR-patient-docu">
            <div className="MR-documents">
              <h4>Documents</h4>

              {documents.map((doc, index) => (
                <div key={index} className="MR-docu-item">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="MR-input"
                        value={doc.name}
                        onChange={(e) =>
                          handleDocumentChange(index, "name", e.target.value)
                        }
                      />
                      <input
                        type="date"
                        className="MR-input"
                        value={doc.date}
                        onChange={(e) =>
                          handleDocumentChange(index, "date", e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <>
                      <span className="MR-docu-icon">
                        <FaFilePdf />
                      </span>
                      <span onClick={() => handleDocumentClick(doc.name)}>
                        {doc.name}
                      </span>
                      <span className="MR-docu-date">{doc.date}</span>
                    </>
                  )}
                  <button
                    className="MR-docu-edit-button"
                    onClick={() => toggleEditMode(index)}
                  >
                    {isEditing ? <FaSave /> : <FaEdit />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {detailsVisible && selectedDocument && (
            <div className="MR-document-details">
              <div className="MR-document-details-content">
                <button
                  className="MR-close-details"
                  onClick={handleCloseDetails}
                >
                  Close
                </button>
                <h3>{selectedDocument}</h3>
                {documentImage && (
                  <img src={documentImage} alt={selectedDocument} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      {openAddObstreticModal && (
        <>
          <div className="add-history-modal">
            <input
              type="text"
              className="MR-input"
              placeholder="Title"
              value={obstetricTitle}
              onChange={handleObstetricTitleChange}
            />
            <input
              type="date"
              className="MR-input"
              value={obstetricDate}
              onChange={handleObstetricDateChange}
            />
            <button className="add-btn">Add</button>
          </div>
          <div className="overlay"></div>
        </>
      )}

      {openAddSurgicalModal && (
        <>
          <div className="add-history-modal">
            <input
              type="date"
              className="MR-input"
              value={surgicalDate}
              onChange={handleSurgicalDateChange}
            />
            <input
              type="text"
              className="MR-input"
              placeholder="Title"
              value={surgicalTitle}
              onChange={handleSurgicalTitleChange}
            />
            <button className="add-btn">Add</button>
          </div>
          <div className="overlay"></div>
        </>
      )}

      {openAddMedicalModal && (
        <>
          <div className="add-history-modal">
            <input
              type="text"
              className="MR-input"
              placeholder="Title"
              value={medicalTitle}
              onChange={handleMedicalTitleChange}
            />
            <input
              type="text"
              className="MR-input"
              placeholder="Status"
              value={addStatus}
              onChange={handleStatus}
            />
            <input
              type="text"
              className="MR-input"
              placeholder="From last ? months/year"
              value={medicalDate2}
              onChange={handleMedicalDate2Change}
            />
            <button className="add-btn">Add</button>
          </div>
          <div className="overlay"></div>
        </>
      )}
    </>
  );
};

export default MedicalRec;
