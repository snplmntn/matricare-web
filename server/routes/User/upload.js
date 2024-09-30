const express = require("express");
const router = express.Router();
const uploadController = require("../../controller/User/UploadController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// Profile Picture
router.post("/p", upload.single("picture"), uploadController.picture_post);

// Upload Document
router.post("/d", upload.single("document"), uploadController.document_post);

module.exports = router;
