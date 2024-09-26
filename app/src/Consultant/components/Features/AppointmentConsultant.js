import React, { useState } from 'react';
import '../../styles/features/appointmentconsultant.css';
import { IoAddCircleOutline, IoNotifications } from 'react-icons/io5';

const initialAppointments = [
  {
    date: "Sept 4, 10 am",
    patientName: "Ella Cruz",
    location: "Mary Chiles",
    category: "Advice by the Doctor",
    status: "pending"
  },
  {
    date: "Sept 22, 1 pm",
    patientName: "Mary Andres",
    location: "Grace Medical Center",
    category: "Monthly Check-up",
    status: "pending"
  },
  {
    date: "Sept 24, 3 pm",
    patientName: "Sarah Smith",
    location: "Family Care Tungko",
    category: "Monthly Check-up",
    status: "confirmed"
  },
];

const AppointmentConsultant = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState('upcoming'); // Track the active tab

  const handleStatusChange = (index, newStatus) => {
    const updatedAppointments = appointments.map((appointment, i) => {
      if (i === index) {
        return { ...appointment, status: newStatus };
      }
      return appointment;
    });
    setAppointments(updatedAppointments);
  };

  const upcomingAppointments = appointments.filter(appointment => appointment.status === 'pending');
  const postAppointments = appointments.filter(appointment => appointment.status === 'confirmed');

  return (
    <div className="appointmentConsultant-dashboard">
      <main className="appointmentConsultant-main">
        <header className="appointmentConsultant-header">
          <div className="appointmentConsultant-notificationIcon">
          <a href="/consultant-notification">
        <IoNotifications />
      </a>
          </div>
          <div className="appointmentConsultant-headerUser">
            <h1>Dra. Donna Jill Tungol</h1>
            <p>Obstetrician-gynecologist</p>
          </div>
          <div className="appointmentConsultant-headerImage">
            <img src="img/LOGO.png" alt="Profile" />
          </div>
        </header>

        <div className="appointmentConsultant-breadcrumb">
          <a href="#doctor">Doctor</a> <span>&gt;</span> <a href="#appointments" className="breadcrumb-active">Appointments</a>
        </div>

        <div className="appointmentConsultant-content">
          <section className="appointmentConsultant-appointments">
            <div className="appointmentConsultant-tabs">
              <button
                className={`appointmentConsultant-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Appointments
              </button>
              <button
                className={`appointmentConsultant-tab ${activeTab === 'post' ? 'active' : ''}`}
                onClick={() => setActiveTab('post')}
              >
                Post Appointments
              </button>
            </div>
            <button className="appointmentConsultant-addAppointmentBtn">
              <IoAddCircleOutline /> Add Appointment
            </button>

            {/* Conditionally render based on the active tab */}
            {activeTab === 'upcoming' && (
              <div className="appointmentConsultant-appointmentList">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="appointmentConsultant-appointmentItem">
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">Date:</span>
                        <span className="appointmentConsultant-text">{appointment.date}</span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">Patient Name:</span>
                        <span className="appointmentConsultant-text">{appointment.patientName}</span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">Location:</span>
                        <span className="appointmentConsultant-text">{appointment.location}</span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">Category:</span>
                        <span className="appointmentConsultant-text">{appointment.category}</span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-action">
                      <select
                        className="appointmentConsultant-statusSelect"
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(index, e.target.value)}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'post' && (
              <div className="appointmentConsultant-appointmentList">
                {postAppointments.map((appointment, index) => (
                  <div key={index} className="appointmentConsultant-appointmentItem">
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">Date:</span>
                        <span className="appointmentConsultant-text">{appointment.date}</span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">Patient Name:</span>
                        <span className="appointmentConsultant-text">{appointment.patientName}</span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">Location:</span>
                        <span className="appointmentConsultant-text">{appointment.location}</span>
                      </div>
                    </div>
                    <div className="appointmentConsultant-detail">
                      <div className="appointmentConsultant-detailContent">
                        <span className="appointmentConsultant-label">Category:</span>
                        <span className="appointmentConsultant-text">{appointment.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AppointmentConsultant;
