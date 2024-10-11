import React, { useEffect, useState } from "react";
import "../../styles/settings/medicalrec.css";
import moment from "moment";
import { IoArrowBackSharp , IoCalendarOutline, IoDocumentAttachOutline, IoFolderOpenOutline, IoFileTrayStackedOutline, IoPhonePortraitOutline  } from "react-icons/io5";
import { FcPrint, FcDownload  } from "react-icons/fc";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import { Link } from "react-router-dom";


const MedicalRec = ({ user }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [patient, setPatient] = useState();
  const [status] = useState("In-Process");
  const prescribedBy = "Dra. Donna Jill A. Tungol";
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newDocName, setNewDocName] = useState("");
  const [newDocDate, setNewDocDate] = useState("");
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newDocFile, setNewDocFile] = useState(null);



  //STATE FOR STORING DATAS
  const [documents, setDocuments] = useState([
    { name: "ECG Test Report", date: "2024-02-25", file: "C:\\Users\\Bea\\Documents\\Capstone\\Code\\ECG_Test_Report.pdf" },
    { name: "Medical History", date: "2024-03-15", file: "C:\\Users\\Bea\\Documents\\Capstone\\Code\\ECG_Test_Report.pdf" },
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

  const handleClose = () => {
    setIsAddingDocument(false); 
    setNewDocName('');
    setNewDocDate('');
    setNewDocFile(null);
    setSelectedDocument(null);
  };

  const handleAddDocument = () => {
    if (newDocName && newDocDate) {
      const newDocument = { name: newDocName, date: newDocDate };
      setDocuments([...documents, newDocument]);
      setNewDocName("");
      setNewDocDate("");
      setIsAddingDocument(false); 
    }
  };

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedDocument.file; // Use the file URL from selectedDocument
    link.download = selectedDocument.name; // Set the download filename
    link.click(); // Simulate click to trigger download
  };

  const handlePrint = () => {
    const printWindow = window.open(selectedDocument.file, '_blank');
    printWindow.onload = () => {
      printWindow.print(); // Trigger print when the document is loaded
    };
  };


  // Handle document name and date changes
  const handleDocumentChange = (index, field, value) => {
    const updatedDocs = [...documents];
    updatedDocs[index][field] = value;
    setDocuments(updatedDocs); 
  };


  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/record/task?id=${id}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const updatedTasks = tasks.map((task) =>
        task._id === id ? { ...task, status: status } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
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
            <IoArrowBackSharp  />
          </Link>
          <div className="MR-top-section">
            <div className="MR-patient-info">
              <img src="img/topic2.jpg" alt="Patient Photo" />
              <div className="MR-patient-details">
                <h3>{patient && patient.fullName}</h3>
                <p>02/21/1996 (28 yrs old), F</p>
                <div className="MR-phone-info">
                  <IoPhonePortraitOutline  className="MR-phone-icon" />
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
                <p>{patient && patient.husband}</p>
                <div className="MR-partner-contact">
                  <IoPhonePortraitOutline  className="MR-phone-icon" />
                  <p>{patient && patient.husbandNumber}</p>
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
                      <IoFileTrayStackedOutline  />
                    </td>
                    <td>{task.taskName}</td>
                    <td>{task.prescribedDate.split("T")[0]}</td>
                    <td>
                      <select
                        className="MR-select-status"
                        value={task.status}
                        onChange={(e) => {
                          handleStatusChange(task._id, e.target.value, index);
                        }}
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
              <ul>
                {obstetricHistory.map((item, index) => (
                  <li key={index}>
                    {isEditing ? (
                      <>
                        <input
                          type="date"
                          className="MR-input"
                          value={item.date}
                        />
                        <input
                          type="text"
                          className="MR-input"
                          value={item.text}
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
                          />
                          <input
                            type="text"
                            className="MR-input"
                            value={item.status}
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
              <ul>
                {surgicalHistory.map((item, index) => (
                  <li key={index}>
                    {isEditing ? (
                      <>
                        <input
                          type="date"
                          className="MR-input"
                          value={item.date}
                        />
                        <input
                          type="text"
                          className="MR-input"
                          value={item.text}
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

              {!isAddingDocument && (
                <button
                  className="MR-add-docu-button"
                  onClick={() => setIsAddingDocument(true)} 
                >
                  +
                </button>
              )}


              {documents.map((doc, index) => (
                <div key={index} className="MR-docu-item" onClick={() => handleDocumentClick(doc)}>
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
                      <span className="MR-doc-name">{doc.name}</span>
                      <span className="MR-doc-date">{doc.date}</span>
                    </>
                  )}
                </div>
              ))}
            
            {isAddingDocument && (
              <div className="modal-overlay">
                <div className="add-modal-content">
                  <h3>Add Document</h3>
                  <button className="add-docu-close" onClick={handleClose}>x</button>
                  <hr className="add-hr" />
                  <div className="MR-add-docu-form">
                    <div className="input-icon-wrapper">
                      <IoFolderOpenOutline className="input-icon" />
                      <input
                        type="text"
                        placeholder="Document Name"
                        value={newDocName}
                        className="MR-input"
                        onChange={(e) => setNewDocName(e.target.value)}
                      />
                    </div>
                    <div className="input-icon-wrapper">
                      <IoCalendarOutline className="input-icon" />
                      <input
                        type="date"
                        placeholder="Document Date"
                        value={newDocDate}
                        className="MR-input"
                        onChange={(e) => setNewDocDate(e.target.value)}
                      />
                    </div>
                    <div className="input-icon-wrapper">
                      <IoDocumentAttachOutline className="input-icon" />
                      <input
                        type="file"
                        className="MR-input"
                        onChange={(e) => setNewDocFile(e.target.files[0])}
                      />
                    </div>
                    <button
                      className="MR-save-docu-button"
                      onClick={handleAddDocument}
                    >
                      Save Document
                    </button>
                  </div>
                </div>
              </div>
            )}
            {selectedDocument ? (
            <div className="modal-overlay">
              <div className="selected-docu">
              <button className="selected-docu-close" onClick={handleClose} aria-label="Close Modal">
                &times;
              </button>
              <div className="document-info">
              <p>{selectedDocument.date}</p>
                <p>{selectedDocument.name}</p>
                <div className="docu-button">
                  <button onClick={handleDownload} aria-label="Download Document" className="docu-icon">
                    <FcDownload />
                  </button>
                  <button onClick={handlePrint} aria-label="Print Document" className="docu-icon">
                    <FcPrint />
                  </button>
                </div>
              </div>
              </div>
            </div>
            ) : null}
            </div>
          </div>
        
        </main>
      </div>
    </>
  );
};

export default MedicalRec;
