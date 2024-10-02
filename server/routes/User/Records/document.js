const express = require("express");
const router = express.Router();
const documentController = require("../../../controller/User/Records/DocumentController");

// Get User
router.get("/", documentController.document_get);

// Get Task by UserId
router.get("/u", documentController.document_user_get);

// Index User
router.post("/", documentController.document_post);

// Update User
router.put("/", documentController.document_put);

// Delete User
router.delete("/", documentController.document_delete);

module.exports = router;
