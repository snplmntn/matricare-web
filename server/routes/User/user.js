const express = require("express");
const router = express.Router();
const userController = require("../../controller/User/UserController");
const notificationController = require("./../../controller/Content/NotificationController");

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

// Add Saved Post / Article
router.get("/save", userController.save_article_put);

// Remove Saved Post / Article
router.delete("/unsave", userController.remove_saved_article);

// Get User by Role
router.get("/n", notificationController.notification_get);

// Update Notification
router.put("/n", notificationController.notification_put);

module.exports = router;
