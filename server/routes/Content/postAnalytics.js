const express = require("express");
const router = express.Router();
const postAnalyticsController = require("../../controller/Content/PostAnalyticsController");

// Get Post
router.get("/", postAnalyticsController.post_get);

module.exports = router;
