import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch, IoChevronBackCircle, IoAlbumsOutline, IoClipboardOutline, IoCalendarOutline, IoLockClosed } from "react-icons/io5";
import '../../styles/settings/consultantrecord.css';

const ConsultRecord = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(""); 
  const [activeTable, setActiveTable] = useState(null); // New state for active table
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const correctPassword = "securePassword123"; 

  const handleLogin = (event) => {
    event.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      setError("Incorrect password. Please try again."); 
    }
  };


  const renderTable = () => {
    switch (activeTable) {
      case 'medical-history':
        return (
          <div className="medical-history-form">
            <input type="date" placeholder="Date" />
            <input type="text" placeholder="Assessment" />
            <button className="submit-button">Submit</button>
          </div>
        );
      case 'laboratory-records':
        return (
          <div className="laboratory-records-form">
            <input type="text" placeholder="Laboratory Test" />
            <input type="date" placeholder="Date Issued" />
            <input type="text" placeholder="Diagnosis" />
            <input type="text" placeholder="Result" />
            <button className="submit-button">Submit</button>
          </div>
        );
      default:
        return null;
    }
  };
  

  return (
    <div className="consultrecords-container">
      {!authenticated ? (
            <div className="consultrecords-password-container">
              <div className="background-image-consultrecords" style={{ backgroundImage: `url('/img/bg6.jpg')` }}></div>
               <div className="overlay"></div>
              <Link to="/consultant-landing" className="back-button-consultrecords1"><IoChevronBackCircle /></Link>
              <div className="left-section">
        <div className="lock-icon">
          <IoLockClosed />
          <p>MatriCare</p>
        </div>
      </div>
      <h3 className="password-title">Enter Password</h3>
      <form onSubmit={handleLogin} className="consultrecords-password-form">
        <div className="password-input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="consultrecords-button">Submit</button>
        </div>
      </form>
      {error && <p className="consultrecords-error">{error}</p>}
    </div>
          ) : (
            <div className="consultrecords-main-content">
              <div className="consultrecords-nav">
                <img src="/img/logo3.png" alt="Logo" className="logo-image-consultrecords" />
              </div>
              <div className="consultrecords-content">
                <div className="consultrecords-header-container" style={{ backgroundImage: "url('img/bg5.jpg')" }}>
                  <Link to="/consultant-landing" className="back-button-consultrecords"><IoChevronBackCircle /></Link>
                  <h2 className="consultrecords-title">MEDICAL</h2>
                  <h1 className="consultrecords-title2">RECORDS</h1>
                </div>
                <div className="consultrecords-button-container">
                  <div className="consultrecords-button-box">
                    <button 
                      onClick={() => setActiveTable('medical-history')} 
                      className="consultrecords-button-record"
                    >
                      <IoAlbumsOutline className="consultrecords-button-icon" />
                      <span className="consultrecords-button-text">Medical History</span>
                    </button>
                  </div>
                  <div className="consultrecords-button-box">
                    <button 
                      onClick={() => setActiveTable('laboratory-records')} 
                      className="consultrecords-button-record"
                    >
                      <IoClipboardOutline className="consultrecords-button-icon" />
                      <span className="consultrecords-button-text">Laboratory Records</span>
                    </button>
                  </div>
                </div>
                <div className="consultrecords-table-container">
                  {renderTable()}
                </div>
              </div>
            </div>
          )}
        </div>
  );
};

export default ConsultRecord;
