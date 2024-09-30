const express = require("express");
const router = express.Router();
const authController = require("../../controller/User/AuthController");

//REGISTER
router.post("/signup", authController.user_signup);

// LOGIN
router.post("/login", authController.user_login);

module.exports = router;
