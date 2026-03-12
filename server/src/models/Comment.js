const mongoose = require("mongoose");

// Defined the Comment schema with fields for body, post reference, and author reference, along with validation rules
const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Comment body is required"],
      trim: true,
      maxlength: [1000, "Comment must be 1000 characters or less"],
    },
    post: {
      // Reference to the Post model (the post that the comment belongs to) using ObjectId
      type: mongoose.Schema.Types.ObjectId,
      // Reference the Post model to establish a relationship between comments and their associated posts
      ref: "Post",
      required: true,
    },
    author: {
      // Reference to the User model (the author of the comment) using ObjectId
      type: mongoose.Schema.Types.ObjectId,
      // Reference the User model to establish a relationship between comments and their authors
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields to the Comment schema
    timestamps: true,
  },
);

module.exports = mongoose.model("Comment", commentSchema);
