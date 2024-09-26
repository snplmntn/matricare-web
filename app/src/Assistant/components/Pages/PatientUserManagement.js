import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/pages/patientusermanagement.css';
import { IoHome, IoCalendar, IoChatbubbles, IoLibrary, IoPerson, IoPencil, IoTrash, IoSave } from 'react-icons/io5';

const PatientUserManagement = () => {
    const [filter, setFilter] = useState('all');
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [view, setView] = useState('patients'); // Manage view
    const [editingUserId, setEditingUserId] = useState(null); // Track the editing user
    const [patients, setPatients] = useState([
        { id: 1, photo: 'img/topic1.jpg', name: 'Alice Guo', mobile: '123-456-7890', email: 'john@example.com', status: 'active' },
        { id: 2, photo: 'img/topic1.jpg', name: 'Jane Smith', mobile: '098-765-4321', email: 'jane@example.com', status: 'inactive' },
        // Add more patients here
    ]);

    const [admins, setAdmins] = useState([
        { id: 3, photo: 'img/topic1.jpg', name: 'Dr. Emily Clark', mobile: '123-456-7890', email: 'john@example.com', role: 'Doctor' },
        { id: 4, photo: 'img/topic1.jpg', name: 'Anna Taylor', mobile: '123-456-7890', email: 'john@example.com', role: 'Assistant' },
        // Add more admins here
    ]);

    const filteredUsers = view === 'patients' 
        ? patients.filter(user => filter === 'all' || user.status === filter)
        : admins;

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedUsers(selectAll ? [] : filteredUsers.map(user => user.id));
    };

    const handleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleEditClick = (userId) => {
        setEditingUserId(userId);
    };

    const handleDeleteClick = (userId) => {
        if (view === 'patients') {
            const updatedPatients = patients.filter(patient => patient.id !== userId);
            setPatients(updatedPatients);
        } else if (view === 'admins') {
            const updatedAdmins = admins.filter(admin => admin.id !== userId);
            setAdmins(updatedAdmins);
        }
    };

    const handleStatusChange = (event, userId) => {
        const updatedPatients = patients.map(patient => {
            if (patient.id === userId) {
                return { ...patient, status: event.target.value };
            }
            return patient;
        });
        setPatients(updatedPatients);
    };

    const handleSaveClick = () => {
        setEditingUserId(null);
    };

    return (
        <div className="PatientUserManagement-container">
            <nav className="PUM-navbar">
                <div className="PUM-navbar-options">
                    <div className="PUM-sidebar-logo">
                        <img src="img/logo_consultant.png" alt="Logo" />
                    </div>
                    <div className="PUM-sidebar-menu">
                        <Link to="/assistant-profile" className="PUM-sidebar-item">
                            <IoPerson className="PUM-icon" />
                        </Link>
                        <Link to="/assistant-landing" className="PUM-sidebar-item">
                            <IoHome className="PUM-icon" />
                        </Link>
                        <Link to="/appointment-assistant" className="PUM-sidebar-item">
                            <IoCalendar className="PUM-icon" />
                        </Link>
                        <Link to="/library" className="PUM-sidebar-item">
                            <IoLibrary className="PUM-icon" />
                        </Link>
                        <Link to="/belly-talk" className="PUM-sidebar-item">
                            <IoChatbubbles className="PUM-icon" />
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="PUM-main-section">
                <header className="PUM-header">
                    <div className="PUM-user-profile">
                        <h1>Mary Anne B. Santos</h1>
                        <p>Assistant</p>
                        <img src="img/LOGO.png" alt="Profile" />
                    </div>
                </header>

                <div className="PUM-type-buttons">
                    <button
                        className={`PUM-type-button ${view === 'patients' ? 'active' : ''}`}
                        onClick={() => setView('patients')}
                    >
                        Patients
                    </button>
                    <button
                        className={`PUM-type-button ${view === 'admins' ? 'active' : ''}`}
                        onClick={() => setView('admins')}
                    >
                        Admins
                    </button>
                </div>

                <div className="PUM-view-label">
                    {view === 'patients' ? <h2>Patients</h2> : <h2>Admins</h2>}
                </div>

                <div className="PUM-filter-options">
                    {view === 'patients' && (
                        <div className="PUM-toggle-select">
                            <input
                                type="checkbox"
                                id="selectAll"
                                checked={selectAll}
                                onChange={toggleSelectAll}
                            />
                            <label htmlFor="selectAll">Select All Users</label>
                            <span className="PUM-total-users">({patients.length} Users)</span>
                        </div>
                    )}
                    {view === 'patients' && (
                        <div className="PUM-filter-section">
                            <div className="PUM-filter-container">
                                <label htmlFor="filter">Filter:</label>
                                <select id="filter" onChange={handleFilterChange}>
                                    <option value="all">All</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <table className="PUM-user-table">
                    <thead>
                        <tr>
                            {view === 'patients' && <th>Select</th>}
                            <th>Photo</th>
                            {view === 'patients' && <>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Status</th>
                            </>}
                            {view === 'admins' && <>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Role</th>
                            </>}
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                {view === 'patients' && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleUserSelection(user.id)}
                                        />
                                    </td>
                                )}
                                <td><img src={user.photo} alt={user.name} className="PUM-user-photo" /></td>
                                {view === 'patients' && <>
                                    <td>{user.name}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {editingUserId === user.id ? (
                                            <select 
                                                value={user.status} 
                                                onChange={(event) => handleStatusChange(event, user.id)} 
                                                className="PUM-status-select"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        ) : (
                                            user.status
                                        )}
                                    </td>
                                </>}
                                {view === 'admins' && <>
                                    <td>{user.name}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </>}
                                <td>
                                    {editingUserId === user.id ? (
                                        <button 
                                            className="PUM-operation-btn"
                                            onClick={handleSaveClick}
                                        >
                                            <IoSave /> {/* Use an appropriate icon for saving */}
                                        </button>
                                    ) : (
                                        <button 
                                            className="PUM-operation-btn"
                                            onClick={() => handleEditClick(user.id)}
                                        >
                                            <IoPencil /> {/* Edit icon */}
                                        </button>
                                    )}
                                    <button 
                                        className="PUM-operation-btn PUM-delete-btn"
                                        onClick={() => handleDeleteClick(user.id)}
                                    >
                                        <IoTrash /> {/* Delete icon */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientUserManagement;
