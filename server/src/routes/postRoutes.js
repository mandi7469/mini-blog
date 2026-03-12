const express = require("express");
// Import the authentication middleware and post controller functions
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// Create a new router instance
const router = express.Router();

// Defined routes for post-related operations, applying the authentication middleware to protected routes
// Public routes for fetching posts
router.get("/", getAllPosts);
router.get("/:id", getPostById);
// Protected routes for creating, updating, and deleting posts
router.post("/", authMiddleware, createPost);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
