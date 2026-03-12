const mongoose = require("mongoose");
const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        message: "Title and body are required",
      });
    }

    const post = await Post.create({
      title,
      body,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "username email",
    );

    return res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: posts.length,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id).populate("author", "username email");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only edit your own posts",
      });
    }

    if (title !== undefined) {
      post.title = title;
    }

    if (body !== undefined) {
      post.body = body;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "username email",
    );

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only delete your own posts",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
