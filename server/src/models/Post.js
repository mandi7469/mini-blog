const mongoose = require("mongoose");

// Defined the Post schema with fields for title, body, and author, along with validation rules
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      // Remove leading and trailing whitespace from the title
      trim: true,
      maxlength: [150, "Title must be 150 characters or less"],
    },
    body: {
      type: String,
      required: [true, "Post body content is required"],
      // Remove leading and trailing whitespace from the body content
      trim: true,
    },
    author: {
      // Reference to the User model (author of the post) using ObjectId
      type: mongoose.Schema.Types.ObjectId,
      // Reference the User model to establish a relationship between posts and their authors
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  },
);

module.exports = mongoose.model("Post", postSchema);
