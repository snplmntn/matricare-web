import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Link } from 'react-router-dom'; // Import Link
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaChartBar, FaCommentDots, FaBell, FaUsers, FaCalendarCheck, FaComment } from "react-icons/fa";
import '../../style/features/appointmentassistant.css';

const localizer = momentLocalizer(moment);

const AppointmentAssistant = () => {
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedAppointments = [
      {
        day: 'Monday',
        time: '2:00 PM',
        patientName: 'John Doe'
      },
      {
        day: 'Wednesday',
        time: '8:00 AM',
        patientName: 'Bea Rosal'
      },
      {
        day: 'Friday',
        time: '9:00 AM',
        patientName: 'Johanna Tulalian'
      },
      {
        day: 'Saturday',
        time: '1:00 PM',
        patientName: 'Nathaniel MAtias'
      }
    ];

    const initialNotifications = [];
    setNotifications(initialNotifications);

    setAppointments(savedAppointments);

    const savedUpcomingAppointments = [
      {
        name: 'John Doe',
        phoneNumber: '123-456-7890',
        appointmentType: 'Weekly Check up',
        appointmentMode: 'Onsite',
        appointmentTime: 'Monday, 2:00 PM'
      },
      {
        name: 'Bea Rosal',
        phoneNumber: '987-654-3210',
        appointmentType: 'Monthly Check up',
        appointmentMode: 'Online',
        appointmentTime: 'Wednesday, 8:00 AM'
      },
      {
        name: 'Johanna Tulalian',
        phoneNumber: '987-654-3210',
        appointmentType: 'Weekly Check up',
        appointmentMode: 'Online',
        appointmentTime: 'Friday, 9:00 AM'
      },
      {
        name: 'Nathaniel MAtias',
        phoneNumber: '987-654-3210',
        appointmentType: 'Monthly Check up',
        appointmentMode: 'Online',
        appointmentTime: 'Saturday, 1:00 PM'
      }
    ];
    setUpcomingAppointments(savedUpcomingAppointments);
  }, []);

  const renderTableCell = (day, time) => {
    const appointment = appointments.find(
      appt => appt.day === day && appt.time === time
    );

    if (appointment) {
      return (
        <td className="schedule-cell booked">
          {appointment.patientName}
        </td>
      );
    }

    return <td className="schedule-cell"></td>;
  };

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever events state changes
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDetailsClick = (appointment) => {
    // Implement the logic to handle details click
    console.log("Details clicked for appointment:", appointment);
  };

  return (
    <div className="appointment-assistant-container">
      <nav className="appointment-assistant-left-nav">
        <div className="appointment-assistant-logo">MatriCare</div>
        <ul className="appointment-assistant-menu">
          <li>
            <Link to="/">
              <FaChartBar />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/chat">
              <FaCommentDots />
              <span>Chat</span>
            </Link>
          </li>
          <li>
            <Link to="/assistant-notification"> 
              <FaBell />
              <span>Notification</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="appointment-assistant-middle-layout">
        <div className="appointment-assistant-top-search">
          <input
            type="text"
            placeholder="Search..."
            className="appointment-assistant-search-input"
          />
        </div>
        <div className="appointment-assistant-main-content">
          <div className="appointment-assistant-content-container">
            <div className="appointment-assistant-content-section">
              <h2>Statistic</h2>
              <div className="statistic-container">
                <div className="statistic-item">
                  <FaUsers />
                  <span className="statistic-number">100</span>
                  <span>Total of Patients</span>
                </div>
                <div className="statistic-item">
                  <FaCalendarCheck />
                  <span className="statistic-number">50</span>
                  <span>Appointments</span>
                </div>
                <div className="statistic-item">
                  <FaComment />
                  <span className="statistic-number">20</span>
                  <span>Feedbacks</span>
                </div>
              </div>
            </div>
            <div className="appointment-assistant-content-section">
              <h2>Schedule</h2>
              <div className="schedule-container">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                      <th>Saturday</th>
                      <th>Sunday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['8:00 AM', '9:00 AM', '10:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'].map((time) => (
                      <tr key={time}>
                        <td>{time}</td>
                        {renderTableCell('Monday', time)}
                        {renderTableCell('Tuesday', time)}
                        {renderTableCell('Wednesday', time)}
                        {renderTableCell('Thursday', time)}
                        {renderTableCell('Friday', time)}
                        {renderTableCell('Saturday', time)}
                        {renderTableCell('Sunday', time)}
                      </tr>
                    ))}
                  </tbody>
                  </table>
              </div>
            </div>

            <div className="appointment-assistant-content-section">
              <h2>Upcoming Appointments</h2>
              <div className="upcoming-appointments-container">
                <table className="upcoming-appointments-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone Number</th>
                      <th>Appointment Type</th>
                      <th>Appointment Mode</th>
                      <th>Appointment Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((appointment, index) => (
                      <tr key={index}>
                        <td>{appointment.name}</td>
                        <td>{appointment.phoneNumber}</td>
                        <td>{appointment.appointmentType}</td>
                        <td>{appointment.appointmentMode}</td>
                        <td>{appointment.appointmentTime}</td>
                        <td>
                          <button onClick={() => handleDetailsClick(appointment)}>Details &gt;</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="appointment-assistant-right-container">
        <div className="appointment-assistant-right-calendar">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 300, width: 300 }} // Adjust width as needed
            views={['month']} // Only show the month view
            toolbar={true} // Enable the toolbar
          />
        </div>
        <div className="last-notification-container">
          <h2>Last Notification</h2>
          <div className="notification-container">
            <div className="notification-item">
              <Link to="/notification-Assistant"> {/* Link to NotificationAssistant */}
                <div className="notification-image">
                  <img src="img/logo2.png" alt="Client" />
                </div>
                <div className="notification-details">
                  <p className="notification-time">Today at 10:00 AM</p>
                  <p className="notification-message">John Doe has made an appointment for next week.</p>
                </div>
              </Link>
            </div>
            <div className="notification-item">
              <Link to="/notification-Assistant"> {/* Link to NotificationAssistant */}
                <div className="notification-image">
                  <img src="img/logo2.png" alt="Client" />
                </div>
                <div className="notification-details">
                  <p className="notification-time">Yesterday at 3:00 PM</p>
                  <p className="notification-message">Jane Smith wants to reschedule her appointment for tomorrow.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAssistant;

               
