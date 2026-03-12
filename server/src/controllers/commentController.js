const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const getCommentsByPost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ post: id })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    if (!body) {
      return res.status(400).json({
        message: "Comment body is required",
      });
    }

    const postExists = await Post.findById(id);

    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      body,
      post: id,
      author: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username email"
    );

    return res.status(201).json({
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only delete your own comments",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCommentsByPost,
  createComment,
  deleteComment,
};