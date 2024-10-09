const express = require("express");
const router = express.Router();
const articleController = require("../../controller/Content/ArticleController");
const checkAuth = require("../../Utilities/checkAuth");

// Get Articles
router.get("/", articleController.article_get);

// Index Task
router.post("/", checkAuth, articleController.article_post);

// Update Task
router.put("/", checkAuth, articleController.article_put);

// Delete Task
router.delete("/", checkAuth, articleController.article_delete);

module.exports = router;
