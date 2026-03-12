const express = require("express");
// Import the authentication middleware and comment controller functions
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCommentsByPost,
  createComment,
  deleteComment,
} = require("../controllers/commentController");

// Create a new router instance
const router = express.Router();

// Defined routes for comment-related operations, applying the authentication middleware to protected routes
// Public route for fetching comments by post ID
router.get("/posts/:id/comments", getCommentsByPost);
// Protected routes for creating and deleting comments
router.post("/posts/:id/comments", authMiddleware, createComment);
router.delete("/comments/:id", authMiddleware, deleteComment);

module.exports = router;
