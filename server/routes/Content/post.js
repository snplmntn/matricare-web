const express = require("express");
const router = express.Router();
const postController = require("../../controller/Content/PostController");
const likeController = require("../../controller/Content/PostLikeController");
const commentController = require("../../controller/Content/PostCommentController");
const aiResponseController = require("../../controller/Content/AIResponseController");

// =============== Post ==================

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
router.delete("/", postController.post_delete);

// ============ Post Interaction ===============

// Create Like
router.post("/like", likeController.like_post);

// Get Like
router.get("/like", likeController.like_get);

// Delete Post
router.delete("/like", likeController.like_delete);

// Create Comment
router.post("/comment", commentController.comment_post);

// Get Comment
router.get("/comment", commentController.comment_get);

// Delete Comment
router.delete("/comment", commentController.comment_delete);

// ============ AI Response ===============

// Generate AI Response
router.post("/ai-response", aiResponseController.ai_response_generate);

// Get AI Response
router.get("/ai-response", aiResponseController.ai_response_get);

// Delete AI Response
router.delete("/ai-response", aiResponseController.ai_response_delete);

module.exports = router;
