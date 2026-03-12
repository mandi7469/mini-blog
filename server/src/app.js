const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Route imports
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Create Express app
const app = express();

// Middleware configuration. CORS allows requests from the frontend, and credentials are included for cookie handling.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Logging and JSON parsing
app.use(morgan("dev"));
app.use(express.json());

// Health check endpoint to verify that the API is running
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

// API Routes for authentication, posts, and comments
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

module.exports = app;
