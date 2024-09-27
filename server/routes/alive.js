const express = require("express");
const router = express.Router();
const aliveController = require("../controller/AliveController");

// Get User
router.get("/", aliveController.alive);

module.exports = router;
