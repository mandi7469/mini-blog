const express = require("express");
// Import the authentication controller functions and authentication middleware
const { signup, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new router instance
const router = express.Router();

// Defined routes for authentication-related operations, applying the authentication middleware to protected routes
// Public routes for user signup and login
router.post("/signup", signup);
router.post("/login", login);
// Protected route for fetching the authenticated user's information
router.get("/me", authMiddleware, getMe);

module.exports = router;
