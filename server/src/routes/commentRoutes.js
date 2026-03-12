const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCommentsByPost,
  createComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.get("/posts/:id/comments", getCommentsByPost);
router.post("/posts/:id/comments", authMiddleware, createComment);
router.delete("/comments/:id", authMiddleware, deleteComment);

module.exports = router;