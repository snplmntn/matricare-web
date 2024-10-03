const express = require("express");
const router = express.Router();
const obstetricHistoryController = require("../../../controller/User/Records/ObstetricHistoryController");

// Get Obstetric History by Id
router.get("/", obstetricHistoryController.obstetric_history_get);

// Get Obstetric History by UserId
router.get("/u", obstetricHistoryController.obstetric_history_user_get);

// Create Obstetric History
router.post("/", obstetricHistoryController.obstetric_history_post);

// Update Obstetric History
router.put("/", obstetricHistoryController.obstetric_history_put);

// Delete Obstetric History
router.delete("/", obstetricHistoryController.obstetric_history_delete);

module.exports = router;
