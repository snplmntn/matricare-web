import React, { useState } from 'react';
import '../../styles/pages/landingpageconsultant.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import {IoCalendar, IoNotificationsSharp, IoPeople, IoMail, IoPersonCircleOutline, IoSearch } from 'react-icons/io5';


const LandingPageConsultant = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="consultant-dashboard-container">
      <main className="consultant-main-content">
        <header className="consultant-header">
        <div className="consultant-search-bar">
        <IoSearch className="consultant-search-icon" />
        <input type="text" className="consultant-search-input" placeholder="Search Appointments..." />
        </div>
          <div className="consultant-header-controls">
            <button className="add-patient-btn">+ Add Patients</button>
          </div>
        </header>

        <section className="consultant-greeting-section">
          <div className="consultant-greeting-text">
            <h2>Good Morning,</h2>
            <h3>Dra. Donna Jill A. Tungol</h3>
            <p>Have a nice day at work</p>
          </div>
          <div className="consultant-greeting-image">
            <img src="img/doctor.png" alt="Good Morning" />
          </div>
        </section>
        <section className="consultant-weekly-reports">
            <div className="consultant-report-card total-patients">
            <div className="consul-icon"><IoPeople /></div>
            <div className="consul-text">Total Patients</div>
            <div className="consul-number">54</div>
          </div>
          <div className="consultant-report-card phone-calls">
            <div className="consul-icon"style={{ color: '#7c459c' }}><IoPeople /></div>
            <div className="consul-text">New Patients</div>
            <div className="consul-number">2</div>
          </div>
          <div className="consultant-report-card appointments">
            <div className="consul-icon"style={{ color: '#e39fa9' }}><IoCalendar /></div>
            <div className="consul-text">Appointments</div>
            <div className="consul-number">8</div>
          </div>
          <div className="consultant-report-card unread-mails">
            <div className="consul-icon"style={{ color: '#9a6cb4' }}><IoMail /></div>
            <div className="consul-text">Unread Mails</div>
            <div className="consul-number">10</div>
          </div>
        </section>

        <section className="consultant-patients-table">
        <div className="patients-header">
          <h3>Today's Appointment</h3>
          <a href="/consultant-patientsinfo" className="view-all-patients">View Patients</a>
        </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ella Cruz</td>
                <td>Mary Chiles</td>
                <td>30 Sept 2021</td>
                <td>10:00 AM</td>
                <td>Pending</td>
              </tr>
              <tr>
                <td>Mary Andres</td>
                <td>Mary Chiles</td>
                <td>30 Sept 2021</td>
                <td>01:00 PM</td>
                <td>Confirmed</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <aside className="consultant-right-sidebar">
      <div className="consultant-profile">
      <a href="/consultant-patientsinfo" className="consul-profile-icon" title="Profile">
        <IoPersonCircleOutline />
      </a>
      <a href="/consultant-notification" className="consul-notification-icon" title="Notifications">
        <IoNotificationsSharp />
      </a>
      <div className="consultant-profile-text">
        <h1>Dra. Donna Jill A. Tungol</h1>
        <p>Obstetrician-gynecologist</p>
      </div>
      <img src="img/LOGO.png" alt="Profile" />
    </div>

      <div className="consultant-schedule-calendar">
            <h3>Schedule Calendar</h3>
            <Calendar 
                onChange={setDate} 
                value={date} 
                className="consul-custom-calendar"
            />
        </div>

        <div className="consultant-notifications">
          <h3>Notifications</h3>
          <div className="notifications-list">
            <div className="notification-item">New patient appointment: Ella Cruz - 03:00 PM</div>
            <div className="notification-item">Appointment reminder: Mary - 05:00 PM</div>
            <div className="notification-item">Follow-up needed: Mikkaella - 08:00 PM</div>
            <div className="notification-item">New message from Mikkaella Rodriguez - 03:00 PM</div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LandingPageConsultant;
