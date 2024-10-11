const express = require("express");
const router = express.Router();
const authController = require("../../controller/User/AuthController");
const checkAuth = require("../../Utilities/checkAuth");

// REGISTER
router.post("/signup", authController.user_signup);

// LOGIN
router.post("/login", authController.user_login);

// LOGOUT
router.get("/logout", checkAuth, authController.user_logout);

// FIND USER
router.get("/find", authController.user_find);

// RECOVER USER
router.put("/recover", authController.user_recover);

module.exports = router;
