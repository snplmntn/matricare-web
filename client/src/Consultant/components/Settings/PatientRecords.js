import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/settings/patientrecords.css";
import { FaMobileAlt, FaFileAlt, FaFilePdf } from "react-icons/fa";
import moment from "moment";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { getCookie } from "../../../utils/getCookie";
import axios from "axios";

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

  const conceptionDate = moment("2024-02-14");

  // Calculate estimated due date (40 weeks later)
  const dueDate = conceptionDate.clone().add(40, "weeks");

  // Get current date and calculate weeks passed since conception
  const currentDate = moment();
  const weeksPassed = currentDate.diff(conceptionDate, "weeks");

  const handleDocumentClick = (docName) => {
    // Set selected document and its image URL
    setSelectedDocument(docName);
    // Example image URLs, replace with actual URLs
    const images = {
      "ECG Test Report": "path_to_ecg_test_report_image.jpg",
      "Medical History": "path_to_medical_history_image.jpg",
    };
    setDocumentImage(images[docName] || null);
    setDetailsVisible(true); // Show details view
  };

  const handleCloseDetails = () => {
    setDetailsVisible(false);
    setSelectedDocument(null);
  };

  //selected patient
  useEffect(() => {
    async function fetchCurrentPatient() {
      try {
        const response = await axios.get(`${API_URL}/user?userId=${userId}`, {
          headers: {
            Authorization: token,
          },
        });
        setPatientInfo(response.data.other);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCurrentPatient();
  }, []);

  //current doctor
  useEffect(() => {
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
    fetchCurrentDoctor();
  }, []);

  //get task
  useEffect(() => {
    async function fetchTasks() {
      console.log("patient user Id: " + userId);

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
        console.log(tasks);
        // });
      } catch (error) {
        console.error(error);
      }
    }
    fetchTasks();
  }, []);

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
            <img
              src={patientInfo ? patientInfo.profilePicture : "img/topic2.jpg"}
              alt="Patient Photo"
            />
            <div className="PR-patient-details">
              <h3>{patientInfo && patientInfo.fullName}</h3>
              <p>02/21/1996 (28 yrs old), F</p>
              <div className="PR-phone-info">
                <FaMobileAlt className="PR-phone-icon" />
                <p>{patientInfo && patientInfo.phoneNumber}</p>
              </div>
            </div>
          </div>
          <div className="PR-info-columns">
            <div className="PR-address-info">
              <h4>Home Address:</h4>
              <p>{patientInfo && patientInfo.address}</p>
            </div>
            <div className="PR-email-info">
              <h4>Email Address:</h4>
              <p>{patientInfo && patientInfo.email}</p>
            </div>
            <div className="PR-partner-info">
              <h4>Husband/Partner:</h4>
              <p>John Doe</p>
              <div className="PR-partner-contact">
                <FaMobileAlt className="PR-phone-icon" />
                <p>+63 905 4562 702</p>
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
                <strong>{dueDate.format("MMMM D, YYYY")}</strong>
              </p>
            </div>
            <div className="PR-circle">{weeksPassed}</div>
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
          </div>
        </div>

        {/* Document Details View */}
        {detailsVisible && selectedDocument && (
          <div className="document-details">
            <div className="document-details-content">
              <h4>{selectedDocument}</h4>
              <button onClick={handleCloseDetails}>x</button>
              <img
                src="img/History.png"
                alt={`Detailed view of ${selectedDocument}`}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientRecords;
