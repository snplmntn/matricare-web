const express = require("express");
const router = express.Router();
const patientController = require("../../../controller/User/Records/PatientController");

// Get User
router.get("/", patientController.patient_get);

// Get Task by UserId
router.get("/u", patientController.patient_assigned_get);

// Index User
router.post("/", patientController.patient_post);

// Update User
router.put("/", patientController.patient_put);

// Delete User
router.delete("/", patientController.patient_delete);

module.exports = router;
