const express = require("express");
const router = express.Router();
const verifyController = require("../../controller/User/VerifyController");

// Send Email
router.put("/", verifyController.verification_mail);

// Verify Token from Email
router.get("/", verifyController.verify_email);

module.exports = router;
