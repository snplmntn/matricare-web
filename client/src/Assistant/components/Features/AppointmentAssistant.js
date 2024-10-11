import React, { useState, useEffect } from 'react';
import '../../style/features/appointmentassistant.css';
import { IoSearch} from 'react-icons/io5';
import moment from 'moment';


const AppointmentAssistant = () => {
  const [events, setEvents] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [sortBy, setSortBy] = useState('all');
  const [branchLocation, setBranchLocation] = useState('');

  useEffect(() => {
    const savedUpcomingAppointments = [
      {
        appointmentDate: 'October 01, 2024',
        appointmentTime: '2:00 PM',
        name: 'John Doe',
        phoneNumber: '123-456-7890',
        branchLocation: 'Mary Chiles, Sampaloc Manila',
        appointmentType: 'Advise by the Doctor',
      },
      {
        appointmentDate: 'October 11, 2024',
        appointmentTime: '12:00 PM',
        name: 'Bea Rosal',
        phoneNumber: '987-654-3210',
        branchLocation: 'Mary Chiles, Sampaloc Manila',
        appointmentType: 'Monthly Check up',
      },
      {
        appointmentDate: 'October 12, 2024',
        appointmentTime: '5:00 PM',
        name: 'Johanna Tulalian',
        phoneNumber: '987-654-3210',
        branchLocation: 'Grace Medical Center, Bulacan',
        appointmentType: 'Advise by the Doctor',
      },
      {
        appointmentDate: 'October 01, 2024',
        appointmentTime: '10:00 AM',
        name: 'Nathaniel MAtias',
        phoneNumber: '987-654-3210',
        branchLocation: 'Family Care Tungko, Bulacan',
        appointmentType: 'Monthly Check up',
      }
    ];
    setUpcomingAppointments(savedUpcomingAppointments);
  }, []);

 
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setBranchLocation(''); 
  };

 
  const handleBranchLocationChange = (e) => {
    setBranchLocation(e.target.value);
  };

  
  const filterAppointments = () => {
    const today = moment().format('MMMM DD, YYYY');

    if (sortBy === 'today') {
      return upcomingAppointments.filter(appt => appt.appointmentDate === today);
    } else if (sortBy === 'branchLocation' && branchLocation) {
      return upcomingAppointments.filter(appt => appt.branchLocation === branchLocation);
    }

    // Default: show all appointments
    return upcomingAppointments;
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
      <div className="appointment-main-container">
        <div className="appointment-assistant-top-search">
        <IoSearch className="assistant-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="appointment-assistant-search-input"
          />
        </div>
          <div className="appointment-assistant-content-container">
            <div className="appointment-assistant-content-section">
            <div className="appointment-header">
              <h2>Appointments</h2>
              <div className="sort-by-container">
                <label htmlFor="sortBy">Sort by: </label>
                <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                  <option value="all">All</option>
                  <option value="today">Today's Appointment</option>
                  <option value="branchLocation">Branch Location</option>
                </select>
                {sortBy === 'branchLocation' && (
                  <select
                    id="branchLocation"
                    value={branchLocation}
                    onChange={handleBranchLocationChange}
                  >
                    <option value="">Select Branch</option>
                    <option value="Mary Chiles, Sampaloc Manila">Mary Chiles, Sampaloc Manila</option>
                    <option value="Grace Medical Center, Bulacan">Grace Medical Center, Bulacan</option>
                    <option value="Family Care Tungko, Bulacan">Family Care Tungko, Bulacan</option>
                  </select>
                )}
              </div>
            </div>
              <div className="upcoming-appointments-container">
                <table className="upcoming-appointments-table">
                  <thead>
                    <tr>
                      <th>Visit Date</th>
                      <th>Visit Time</th>
                      <th>Name</th>
                      <th>Phone Number</th>
                      <th>Branch Location</th>
                      <th>Appointment Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filterAppointments().map((appointment, index) => (
                      <tr key={index}>
                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.appointmentTime}</td>
                        <td>{appointment.name}</td>
                        <td>{appointment.phoneNumber}</td>
                        <td>{appointment.branchLocation}</td>
                        <td>{appointment.appointmentType}</td>
                        <td>
                          <button onClick={() => handleDetailsClick(appointment)}>Details &gt;</button>
                        </td>
                      </tr>
                    ))}
                    {filterAppointments().length === 0 && (
                    <tr>
                      <td colSpan="7">No appointments found</td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AppointmentAssistant;

               
