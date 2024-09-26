import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/settings/consultantpatientsinfo.css';
import { IoPencil, IoTrash, IoSave } from 'react-icons/io5';

const ConsultantPatientInfo = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [view, setView] = useState('patients');
    const [editingUserId, setEditingUserId] = useState(null);
    const [patients, setPatients] = useState([
        { id: 1, PatientID: '1', photo: 'img/topic1.jpg', name: 'Alice Guo', mobile: '123-456-7890', email: 'john@example.com', status: 'active' },
        { id: 2, PatientID: '2', photo: 'img/topic1.jpg', name: 'Jane Smith', mobile: '098-765-4321', email: 'jane@example.com', status: 'inactive' },
        // Add more patients here
    ]);

    const [admins, setAdmins] = useState([
        { id: 3, photo: 'img/topic1.jpg', name: 'Dra. Donna Jill A. Tungol', mobile: '123-456-7890', email: 'john@example.com', role: 'Doctor' },
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
        if (window.confirm('Are you sure you want to delete this user?')) {
            if (view === 'patients') {
                setPatients(patients.filter(user => user.id !== userId));
            } else {
                setAdmins(admins.filter(user => user.id !== userId));
            }
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
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

    const handleRowClick = (userId) => {
        navigate('/patient-records');
    };

    return (
        <div className="CPM-container">
            <div className="CPM-main-section">
                <header className="CPM-header">
                    <div className="CPM-user-profile">
                        <h1>Dra. Donna Jill A. Tungol</h1>
                        <p>Obstetrician-gynecologist</p>
                        <img src="img/LOGO.png" alt="Profile" />
                    </div>
                </header>

                <div className="CPM-type-buttons">
                    <button
                        className={`CPM-type-button ${view === 'patients' ? 'active' : ''}`}
                        onClick={() => setView('patients')}
                    >
                        Patients
                    </button>
                    <button
                        className={`CPM-type-button ${view === 'admins' ? 'active' : ''}`}
                        onClick={() => setView('admins')}
                    >
                        Admins
                    </button>
                </div>

                <div className="CPM-view-label">
                    {view === 'patients' ? <h2>Patients</h2> : <h2>Admins</h2>}
                </div>

                <div className="CPM-filter-options">
                    {view === 'patients' && (
                        <div className="CPM-toggle-select">
                            <input
                                type="checkbox"
                                id="selectAll"
                                checked={selectAll}
                                onChange={toggleSelectAll}
                            />
                            <label htmlFor="selectAll">Select All Users</label>
                            <span className="CPM-total-users">({patients.length} Users)</span>
                        </div>
                    )}
                    {view === 'patients' && (
                        <div className="CPM-filter-section">
                            <div className="CPM-filter-container">
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

                <table className="CPM-user-table">
                    <thead>
                        <tr>
                            {view === 'patients' && <th>Select</th>}

                            <th>Patient ID</th>
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
                            <tr key={user.id} onClick={() => handleRowClick(user.id)}>
                                {view === 'patients' && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleUserSelection(user.id)}
                                        />
                                    </td>
                                )}
                                <td>{user.PatientID}</td>
                                <td><img src={user.photo} alt={user.name} className="CPM-user-photo" /></td>
                                {view === 'patients' && <>
                                    <td>{user.name}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {editingUserId === user.id ? (
                                            <select 
                                                value={user.status} 
                                                onChange={(event) => handleStatusChange(event, user.id)} 
                                                className="CPM-status-select"
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
                                            className="CPM-operation-btn"
                                            onClick={handleSaveClick}
                                        >
                                            <IoSave />
                                        </button>
                                    ) : (
                                        <button 
                                            className="CPM-operation-btn"
                                            onClick={() => handleEditClick(user.id)}
                                        >
                                            <IoPencil />
                                        </button>
                                    )}
                                    <button 
                                        className="CPM-operation-btn CPM-delete-btn"
                                        onClick={() => handleDeleteClick(user.id)}
                                    >
                                        <IoTrash />
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

export default ConsultantPatientInfo;