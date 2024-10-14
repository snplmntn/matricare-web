import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/settings/patientrecords.css";
import { FaMobileAlt, FaFileAlt, FaFilePdf } from "react-icons/fa";
import moment from "moment";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";
import { FcPrint, FcDownload } from "react-icons/fc";

const PatientRecords = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { userId } = useParams();
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [patientInfo, setPatientInfo] = useState();
  const [taskName, setTaskName] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [status, setStatus] = useState("..."); // Default status
  const [prescribedBy, setPrescribedBy] = useState("");
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([
    {
      name: "ECG Test Report",
      date: "2024-02-25",
      file: "C:\\Users\\Bea\\Documents\\Capstone\\Code\\ECG_Test_Report.pdf",
    },
    {
      name: "Medical History",
      date: "2024-03-15",
      file: "C:\\Users\\Bea\\Documents\\Capstone\\Code\\ECG_Test_Report.pdf",
    },
  ]);

  const handleAddTask = async () => {
    if (taskName.trim()) {
      // Ensure taskName is not empty
      const newTask = {
        taskName: taskName,
        prescribedDate: new Date().toLocaleDateString(), // Current date
        prescribedBy: prescribedBy,
        orderNumber: `2024-10`, // Generate order number based on the number of tasks
        userId: userId,
      };
      try {
        const response = await axios.post(`${API_URL}/record/task`, newTask, {
          headers: {
            Authorization: token,
          },
        });
        setStatus("On Progress");
        console.log(response);
      } catch (e) {
        console.error(e);
      }
      setTasks([...tasks, newTask]);
      setTaskName("");
      setFormVisible(false); // Hide form after adding
    }
  };

  const conceptionDate =
    patientInfo && patientInfo.userId.pregnancyStartDate
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
    setDetailsVisible(true); // Show details view
  };

  const handleCloseDetails = () => {
    setDetailsVisible(false);
    setSelectedDocument(null);
  };

  //get task
  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await axios.get(
          `${API_URL}/record/patient?id=${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response.data[0]);
        setPatientInfo(response.data[0]);
        // });
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchTasks() {
      try {
        const response = await axios.get(
          `${API_URL}/record/task/u?userId=${userId}`,
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
          `${API_URL}/record/document/u?userId=${userID}`,
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

    fetchPatient();
    fetchCurrentDoctor();
    fetchTasks();
    fetchDocuments();
  }, []);

  const handleClose = () => {
    setSelectedDocument(null);
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

  return (
    <div className="patient-records-container">
      <main className="patient-records-main-content">
        <Link to="/consultant-patientsinfo" className="PR-back-button">
          <IoMdArrowRoundBack />
        </Link>
        <div className="PR-label">
          <h2>Patients</h2>
        </div>
        <div className="PR-top-section">
          <div className="PR-patient-info">
            <img src="img/topic2.jpg" alt="Patient Photo" />
            <div className="PR-patient-details">
              <h3>{patientInfo && patientInfo.fullName}</h3>
              <p>
                {patientInfo && patientInfo.userId.birthdate
                  ? `${formatDate(
                      patientInfo.userId.birthdate
                    )} : ${calculateAge(patientInfo.userId.birthdate)} yrs old`
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
              <p>{patientInfo && patientInfo.userId.address}</p>
            </div>
            <div className="PR-email-info">
              <h4>Email Address:</h4>
              <p>{patientInfo && patientInfo.email}</p>
            </div>
            <div className="PR-partner-info">
              <h4>Husband/Partner:</h4>
              <p>{patientInfo && patientInfo.userId.husband}</p>
              <div className="PR-partner-contact">
                <FaMobileAlt className="PR-phone-icon" />
                <p>{patientInfo && patientInfo.userId.husbandNumber}</p>
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
              <button className="submit-task-button" onClick={handleAddTask}>
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
              <li>
                <span className="date">01/15/2020</span>
                <span className="text">Miscarriage</span>
              </li>
              <li>
                <span className="date">03/31/2020</span>
                <span className="text">Ectopic</span>
              </li>
            </ul>
          </div>
          <div className="PR-panel PR-Medical">
            <h4>Medical History</h4>
            <ul>
              <li>
                <div className="diagnosis-info">
                  <span className="diagnosis">Asthma</span>
                  <span className="status active">Active</span>
                </div>
                <div className="diagnosis-duration">From last 4 Months</div>
              </li>
              <li>
                <div className="diagnosis-info">
                  <span className="diagnosis">Hypertension</span>
                  <span className="status inactive">Inactive</span>
                </div>
                <div className="diagnosis-duration">From last 2 Years</div>
              </li>
            </ul>
          </div>

          <div className="PR-panel PR-Surgical">
            <h4>Surgical History</h4>
            <ul>
              <li>
                <span className="date">01/15/2020</span>
                <span className="text">Appendicitis</span>
              </li>
              <li>
                <span className="date">03/31/2020</span>
                <span className="text">Tubercolosis</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="PR-right-panels">
          <div className="PR-weeks-count">
            <div className="PR-text-content">
              <h4>Weeks Count</h4>
              <p className="PR-due-date">
                Estimated Pregnancy <br />
                Due Date: <br />
                <strong>
                  {dueDate.isValid() ? dueDate.format("MMMM D, YYYY") : "N/A"}
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
            <div
              className="PR-docu-item"
              onClick={() => handleDocumentClick("ECG Test Report")}
            >
              <span className="docu-icon">
                <FaFilePdf />
              </span>{" "}
              ECG Test Report
              <span className="docu-date">02/25/2024</span>
            </div>
            <div
              className="PR-docu-item"
              onClick={() => handleDocumentClick("Medical History")}
            >
              <span className="docu-icon">
                <FaFilePdf />
              </span>{" "}
              Medical History
              <span className="docu-date">03/15/2024</span>
            </div>

            {documents.map((doc, index) => (
              <div
                key={index}
                className="MR-docu-item"
                onClick={() => handleDocumentClick(doc)}
              >
                <span className="MR-doc-name">{doc.name}</span>
                <span className="MR-doc-date">{formatDate(doc.date)}</span>
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
  );
};

export default PatientRecords;
