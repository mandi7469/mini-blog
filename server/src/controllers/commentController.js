const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Get comments for a specific post - GET /api/posts/:id/comments - public
const getCommentsByPost = async (req, res) => {
  try {
    // Extract the post ID from the request parameters
    const { id } = req.params;
    // Validate the post ID to ensure it is a valid MongoDB ObjectId. If the ID is not valid, return a 400 Bad Request response with error message.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }
    // Check if the post with the specified ID exists in the database. If it does not exist, return a 404 Not Found response with error message.
    const postExists = await Post.findById(id);
    // If the post does not exist, return a 404 Not Found response with error message.
    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    // Retrieve all comments associated with the specified post ID from the database, populate the author field to include the
    // username and email of the comment author, and sort the comments by creation date in descending order (newest first).
    const comments = await Comment.find({ post: id })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      // The count field indicates the total number of comments returned in the response
      count: comments.length,
      comments,
    });
    // If any error occurs during the process, catch it and return a 500 Internal Server Error response with the error message
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Create a comment for a specific post - POST /api/posts/:id/comments - requires authentication
const createComment = async (req, res) => {
  try {
    // Extract the post ID from the request parameters and the comment body from the request body
    const { id } = req.params;
    const { body } = req.body;
    // Validate the post ID to ensure it is a valid MongoDB ObjectId. If the ID is not valid, return a 400 Bad Request response with error message.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }
    // Validate that the comment body is provided in the request. If the body is missing, return a 400 Bad Request response with error message.
    if (!body) {
      return res.status(400).json({
        message: "Comment body is required",
      });
    }
    // Check if the post with the specified ID exists in the database. If it does not exist, return a 404 Not Found response with error message.
    const postExists = await Post.findById(id);
    // If the post does not exist, return a 404 Not Found response with error message.
    if (!postExists) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    // Create a new comment in the database with the provided body, associated post ID, and the authenticated user's ID as the author.
    const comment = await Comment.create({
      // The body field contains the text of the comment provided in the request body
      body,
      post: id,
      // The author field will be set to the ID of the authenticated user, which is available in req.user._id
      author: req.user._id,
    });
    // After creating the comment, retrieve it again from the database and populate the author field to include the username
    // and email of the comment author. This ensures that the response includes the most up-to-date information about the comment and its author.
    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username email",
    );
    // Return the created comment in the response with a success message and a 201 Created status.
    return res.status(201).json({
      message: "Comment created successfully",
      // The comment field contains the created comment data, including the populated author information.
      comment: populatedComment,
    });
    // If any error occurs during the process, catch it and return a 500 Internal Server Error response with the error message
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a comment - DELETE /api/comments/:id - requires authentication
const deleteComment = async (req, res) => {
  try {
    // Extract the comment ID from the request parameters
    const { id } = req.params;
    // Validate the comment ID to ensure it is a valid MongoDB ObjectId. If the ID is not valid, return a 400 Bad Request response with error message.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }
    // Retrieve the comment with the specified ID from the database
    const comment = await Comment.findById(id);
    // If the comment is not found (i.e., the ID does not correspond to any existing comment), return a 404 Not Found response with error message.
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    // Check if the authenticated user is the author of the comment. If not, return a 403 Forbidden response with error message.
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only delete your own comments",
      });
    }
    // If the user is the author, delete the comment from the database
    await comment.deleteOne();

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
    // If any error occurs during the process, catch it and return a 500 Internal Server Error response with the error message
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Export the controller functions to be used in the routes
module.exports = {
  getCommentsByPost,
  createComment,
  deleteComment,
};
