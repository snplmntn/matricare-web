const Appointment = require('../models/Appointment');

exports.create = async (req, res) => {
    const { fullName, email, phoneNumber, appointmentType, appointmentMode, appointmentDateTime } = req.body;
    try {
        const appointment = new Appointment({ fullName, email, phoneNumber, appointmentType, appointmentMode, status: "Pending", appointmentDateTime });
        await appointment.save();
        res.json({
            appointmentId: appointment._id,
            fullName: appointment.fullName,
            email: appointment.email,
            phoneNumber: appointment.phoneNumber,
            appointmentType: appointment.appointmentType,
            appointmentMode: appointment.appointmentMode,
            status: appointment.status,
            appointmentTime: appointment.appointmentTime
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};

exports.update = async (req, res) => {
    const { appointmentId } = req.params;
    const { fullName, email, phoneNumber, appointmentType, appointmentMode, appointmentDateTime } = req.body;
    try {
        let appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ msg: "Appointment not found" });
        }
        appointment.fullName = fullName;
        appointment.email = email;
        appointment.phoneNumber = phoneNumber;
        appointment.appointmentType = appointmentType;
        appointment.appointmentMode = appointmentMode;
        appointment.appointmentDateTime = appointmentDateTime;
        await appointment.save();
        res.json({
            appointmentId: appointment._id,
            fullName: appointment.fullName,
            email: appointment.email,
            phoneNumber: appointment.phoneNumber,
            appointmentType: appointment.appointmentType,
            appointmentMode: appointment.appointmentMode,
            status: appointment.status,
            appointmentTime: appointment.appointmentTime
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};

exports.get = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ msg: "Appointment not found" });
        }
        res.json({
            appointmentId: appointment._id,
            fullName: appointment.fullName,
            email: appointment.email,
            phoneNumber: appointment.phoneNumber,
            appointmentType: appointment.appointmentType,
            appointmentMode: appointment.appointmentMode,
            status: appointment.status,
            appointmentTime: appointment.appointmentTime
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};

exports.updateStatus = async (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;
    try {
        let appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ msg: "Appointment not found" });
        }
        if((appointment.status !== 'Pending' && status === 'Approved') || (appointment.status !== 'Pending' && appointment.status !== 'Approved')) {
            return res.status(404).json({ msg: "Not allowed, appointment was already being processed or closed!" });
        }
        if(appointment.status !== 'Approved' && status === 'Closed') {
            return res.status(404).json({ msg: "Not allowed, appointment was not yet approved!" });
        }
        if(appointment.status === 'Approved' && status === 'Cancel') {
            return res.status(404).json({ msg: "Not allowed, appointment was already being approved!" });
        }
        appointment.status = status;
        await appointment.save();
        res.json({
            appointmentId: appointment._id,
            fullName: appointment.fullName,
            email: appointment.email,
            phoneNumber: appointment.phoneNumber,
            appointmentType: appointment.appointmentType,
            appointmentMode: appointment.appointmentMode,
            status: appointment.status,
            appointmentTime: appointment.appointmentTime
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};

exports.delete = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ msg: "Appointment not found" });
        }

        await Appointment.findByIdAndDelete(appointmentId);

        res.json({
            appointmentId: appointment._id,
            fullName: appointment.fullName,
            email: appointment.email,
            phoneNumber: appointment.phoneNumber,
            appointmentType: appointment.appointmentType,
            appointmentMode: appointment.appointmentMode,
            status: appointment.status,
            appointmentTime: appointment.appointmentTime
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};
