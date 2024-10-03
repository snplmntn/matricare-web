const express = require("express");
const router = express.Router();
const documentController = require("../../../controller/User/Records/DocumentController");

// Get Document by Id
router.get("/", documentController.document_get);

// Get Document by UserId
router.get("/u", documentController.document_user_get);

// Create Document
router.post("/", documentController.document_post);

// Update Document
router.put("/", documentController.document_put);

// Delete Document
router.delete("/", documentController.document_delete);

module.exports = router;
