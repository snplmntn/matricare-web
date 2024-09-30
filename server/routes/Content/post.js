const express = require("express");
const router = express.Router();
const postController = require("../../controller/Content/PostController");
const likeController = require("../../controller/Content/PostLikeController");

// Post

// Get Post
router.get("/", postController.post_get);

// Index Post
router.get("/i", postController.post_index);

// Get User Posts
router.get("/u", postController.post_user_get);

// Create Post
router.post("/", postController.post_post);

// Update Post
router.put("/", postController.post_put);

// Delete Post
router.put("/", postController.post_delete);

// Post Interaction

// Create Post
router.post("/like", likeController.like_post);

// Get Like
router.get("/like", likeController.like_get);

// Delete Post
router.put("/like", likeController.like_delete);

module.exports = router;
