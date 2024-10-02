const express = require("express");
const router = express.Router();
const taskController = require("../../../controller/User/Records/TaskController");

// Get User
router.get("/", taskController.task_get);

// Get Task by UserId
router.get("/u", taskController.task_user_get);

// Index User
router.post("/", taskController.task_post);

// Update User
router.put("/", taskController.task_put);

// Delete User
router.delete("/", taskController.task_delete);

module.exports = router;
