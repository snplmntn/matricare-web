const express = require("express");
const router = express.Router();
const surgicalHistoryController = require("../../../controller/User/Records/SurgicalHistoryController");

// Get Surgical History by Id
router.get("/", surgicalHistoryController.surgical_history_get);

// Get Surgical History by UserId
router.get("/u", surgicalHistoryController.surgical_history_user_get);

// Create Surgical History
router.post("/", surgicalHistoryController.surgical_history_post);

// Update Surgical History
router.put("/", surgicalHistoryController.surgical_history_put);

// Delete Surgical History
router.delete("/", surgicalHistoryController.surgical_history_delete);

module.exports = router;
