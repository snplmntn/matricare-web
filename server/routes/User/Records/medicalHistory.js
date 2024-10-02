const express = require("express");
const router = express.Router();
const medicalHistoryController = require("../../../controller/User/Records/MedicalHistoryController");

// Get User
router.get("/", medicalHistoryController.medical_history_get);

// Get Task by UserId
router.get("/u", medicalHistoryController.medical_history_user_get);

// Index User
router.post("/", medicalHistoryController.medical_history_post);

// Update User
router.put("/", medicalHistoryController.medical_history_put);

// Delete User
router.delete("/", medicalHistoryController.medical_history_delete);

module.exports = router;
