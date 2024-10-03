const express = require("express");
const router = express.Router();
const taskController = require("../../../controller/User/Records/TaskController");

// Get Task by Id
router.get("/", taskController.task_get);

// Get Task by UserId
router.get("/u", taskController.task_user_get);

// Index Task
router.post("/", taskController.task_post);

// Update Task
router.put("/", taskController.task_put);

// Delete Task
router.delete("/", taskController.task_delete);

module.exports = router;
