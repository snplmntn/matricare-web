const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    appointmentType: { type: String, enum: ['Weekly Check up', 'Monthly', 'Advice by Doctor'], required: true },
    appointmentMode: { type: String, enum: ['Virtual Consultation', 'Onsite Consultation'], required: true },
    status: { type: String, enum: ['Approved', 'Cancel', 'Pending', 'Closed'], default: 'Pending' },
    appointmentDateTime: { type: Date, required: true }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
