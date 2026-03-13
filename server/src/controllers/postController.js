const mongoose = require("mongoose");
const Post = require("../models/Post");

// Create a new blog post - POST /api/posts - requires authentication
const createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    // Validate input
    if (!title || !body) {
      return res.status(400).json({
        message: "Title and body are required",
      });
    }
    // Create the post and associate it with the authenticated user
    const post = await Post.create({
      title,
      body,
      // The author field will be set to the ID of the authenticated user, which is available in req.user._id
      author: req.user._id,
    });
    // Populate the author field to include the username and email in the response
    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "username email",
    );
    // Return the created post with a success message
    return res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
    // If any error occurs during the process, catch it and return a 500 Internal Server Error response with the error message
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get all blog posts - GET /api/posts - public, with optional filtering by author using query parameters
const getAllPosts = async (req, res) => {
  try {
    // Initialize an empty filter object to be used for querying the database.
    const filter = {};
    // If req includes an "author" query parameter, add a filter condition to the filter object to only retrieve posts that match the specified author ID.
    if (req.query.author) {
      filter.author = req.query.author;
    }
    // Retrieve posts from the database based on the constructed filter. Include the username and email of the author, sorted by creation date in descending order (newest first).
    const posts = await Post.find(filter)
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    // Return the list of posts and the count of posts in the response with a 200 OK status
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

// Get a single blog post by ID - GET /api/posts/:id - public
const getPostById = async (req, res) => {
  try {
    // Extract the post ID from the request parameters
    const { id } = req.params;
    // Validate the post ID to ensure it is a valid MongoDB ObjectId. If the ID is not valid, return a 400 Bad Request response with error message.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }
    // Retrieve the post with the specified ID from the database, and populate the author field to include the username and email of the author.
    const post = await Post.findById(id).populate("author", "username email");
    // If the post is not found (i.e., the ID does not correspond to any existing post), return a 404 Not Found response with an appropriate error message.
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    // If the post is found, return it in the response with a 200 OK status.
    return res.status(200).json({
      // The post field contains the retrieved post data, including the populated author information.
      post,
    });
    // If any error occurs during the process, catch it and return a 500 Internal Server Error response with the error message.
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update a blog post - PUT /api/posts/:id - requires authentication
const updatePost = async (req, res) => {
  try {
    // Extract the post ID from the request parameters and the updated title and body from the request body
    const { id } = req.params;
    const { title, body } = req.body;
    //  Validate the post ID to ensure it is a valid MongoDB ObjectId. If the ID is not valid, return a 400 Bad Request response with error message.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }
    // Retrieve the post with the specified ID from the database
    const post = await Post.findById(id);
    // If the post is not found (i.e., the ID does not correspond to any existing post), return a 404 Not Found response with error message.
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    // Check if the authenticated user is the author of the post. If not, return a 403 Forbidden response with an appropriate error message.
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only edit your own posts",
      });
    }
    // Update the post's title and body if they are provided in the request body. If a field is not provided, it will remain unchanged.
    if (title !== undefined) {
      post.title = title;
    }

    if (body !== undefined) {
      post.body = body;
    }
    // Save the updated post to the database
    await post.save();
    // After saving the updated post, retrieve it again from the database and populate the author field to include the username and email of the author.
    // This ensures that the response includes the most up-to-date information about the post and its author.
    const updatedPost = await Post.findById(post._id).populate(
      "author",
      "username email",
    );
    // Return the updated post in the response with a success message and a 200 OK status.
    return res.status(200).json({
      message: "Post updated successfully",
      // The post field contains the updated post data, including the populated author information.
      post: updatedPost,
    });
    // If any error occurs during the process, catch it and return a 500 Internal Server Error response with the error message.
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a blog post - DELETE /api/posts/:id - requires authentication
const deletePost = async (req, res) => {
  try {
    // Extract the post ID from the request parameters
    const { id } = req.params;
    // Validate the post ID to ensure it is a valid MongoDB ObjectId. If the ID is not valid, return a 400 Bad Request response with error message.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }
    // Retrieve the post with the specified ID from the database
    const post = await Post.findById(id);
    // If the post is not found (i.e., the ID does not correspond to any existing post), return a 404 Not Found response with error message.
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    // Check if the authenticated user is the author of the post. If not, return a 403 Forbidden response with error message.
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: you can only delete your own posts",
      });
    }
    // If the user is the author, delete the post from the database
    await post.deleteOne();
    // Return a success message in the response with a 200 OK status
    return res.status(200).json({
      message: "Post deleted successfully",
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
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
