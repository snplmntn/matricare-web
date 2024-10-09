const express = require("express");
const router = express.Router();
const uploadController = require("../../controller/Content/UploadController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// Upload Profile Picture
router.post("/p", upload.single("picture"), uploadController.picture_post);

// Upload Picture by Belly Talk
router.post(
  "/b",
  upload.single("picture"),
  uploadController.belly_talk_picture_post
);

router.post(
  "/a",
  upload.single("picture"),
  uploadController.article_picture_post
);

// Upload Document
router.post("/d", upload.single("document"), uploadController.document_post);

module.exports = router;
