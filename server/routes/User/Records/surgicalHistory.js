const express = require("express");
const router = express.Router();
const surgicalHistoryController = require("../../../controller/User/Records/TaskController");

// Get User
router.get("/", surgicalHistoryController.surgical_history_get);

// Get Task by UserId
router.get("/u", surgicalHistoryController.surgical_history_user_get);

// Index User
router.post("/", surgicalHistoryController.surgical_history_post);

// Update User
router.put("/", surgicalHistoryController.surgical_history_put);

// Delete User
router.delete("/", surgicalHistoryController.surgical_history_delete);

module.exports = router;
