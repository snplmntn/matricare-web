const express = require("express");
const router = express.Router();
const postAnalyticsController = require("../../controller/Content/PostAnalyticsController");
const generatedArticleController = require("../../controller/Content/GeneratedArticleController");

// Get Post
router.get("/", postAnalyticsController.post_get);

router.get("/article", generatedArticleController.article_get);

router.post("/article", generatedArticleController.article_post);

router.put("/article", generatedArticleController.article_put);

module.exports = router;
