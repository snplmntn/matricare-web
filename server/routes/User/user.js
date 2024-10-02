const express = require("express");
const router = express.Router();
const userController = require("../../controller/User/UserController");

// Get User
router.get("/", userController.user_get);

// Index User
router.get("/a", userController.user_index);

// Get User by Role
router.get("/r", userController.role_get);

// Delete User
router.delete("/", userController.user_delete);

// Update User
router.put("/", userController.user_update);

module.exports = router;
