const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Comment body is required"],
      trim: true,
      maxlength: [1000, "Comment must be 1000 characters or less"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Comment", commentSchema);
