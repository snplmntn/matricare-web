const express = require("express");
const router = express.Router();
const appointmentController = require("../../controller/User/AppointmentController");

// Get Appointment by Id
router.get("/", appointmentController.appointment_get);

// Get Appointment by UserId
router.get("/u", appointmentController.appointment_user_get);

// Index Appointment
router.post("/", appointmentController.appointment_post);

// Update Appointment
router.put("/", appointmentController.appointment_put);

// Delete Appointment
router.delete("/", appointmentController.appointment_delete);

module.exports = router;
