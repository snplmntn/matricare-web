const express = require("express");
const router = express.Router();
const postController = require("../../controller/Content/PostController");

// Get Post
router.get("/", postController.post_get);

// Index Post
router.get("/i", postController.post_index);

// Get User Posts
router.get("/u", postController.post_user_get);

module.exports = router;
