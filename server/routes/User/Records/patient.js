const express = require("express");
const router = express.Router();
const patientController = require("../../../controller/User/Records/PatientController");

// Get Patient
router.get("/", patientController.patient_get);

// Get Patient by UserId of Doctor
router.get("/u", patientController.patient_assigned_get);

// Create Patient
router.post("/", patientController.patient_post);

// Update Patient
router.put("/", patientController.patient_put);

// Delete Patient
router.delete("/", patientController.patient_delete);

module.exports = router;
