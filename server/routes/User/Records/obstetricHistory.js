const express = require("express");
const router = express.Router();
const obstetricHistoryController = require("../../../controller/User/Records/ObstetricHistoryController");

// Get User
router.get("/", obstetricHistoryController.obstetric_history_get);

// Get Task by UserId
router.get("/u", obstetricHistoryController.obstetric_history_user_get);

// Index User
router.post("/", obstetricHistoryController.obstetric_history_post);

// Update User
router.put("/", obstetricHistoryController.obstetric_history_put);

// Delete User
router.delete("/", obstetricHistoryController.obstetric_history_delete);

module.exports = router;
