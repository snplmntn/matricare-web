const express = require("express");
const router = express.Router();
const medicalHistoryController = require("../../../controller/User/Records/MedicalHistoryController");

// Get Medical History by Id
router.get("/", medicalHistoryController.medical_history_get);

// Get Medical History by UserId
router.get("/u", medicalHistoryController.medical_history_user_get);

// Create Medical History
router.post("/", medicalHistoryController.medical_history_post);

// Update Medical History
router.put("/", medicalHistoryController.medical_history_put);

// Delete Medical History
router.delete("/", medicalHistoryController.medical_history_delete);

module.exports = router;
