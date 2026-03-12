const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// User registration - POST /api/auth/signup - public
const signup = async (req, res) => {
  try {
    // Extract the username, email, and password from the request body
    const { username, email, password } = req.body;
    // Validate that all required fields (username, email, and password) are provided in the request. If any field is missing,
    // return a 400 Bad Request response with error message.
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }
    // Validate that the password meets the minimum length requirement (at least 6 characters). If the password is too short,
    // return a 400 Bad Request response with error message.
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // Check if a user with the same email or username already exists in the database. If such a user exists,
    // return a 400 Bad Request response with error message.
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    // If a user with the same email or username already exists, return a 400 Bad Request response with error message.
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with that email or username already exists" });
    }
    // If the input is valid and there are no existing users with the same email or username, proceed to create a new user account.
    // Hash the password using bcrypt before storing it in the database for security reasons.
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // Create the new user in the database with the provided username, email (converted to lowercase), and hashed password.
    // The create method will return the newly created user document.
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      passwordHash,
    });
    // Generate a JWT token for the newly created user. The token will be used for authentication in subsequent requests.
    const token = generateToken(user._id);
    // Return a 201 Created response with a success message, the generated token, and the user information (excluding the password hash)
    // in the response body. The user information includes the user's ID, username, and email.
    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        // The _id field contains the unique identifier of the user in the database
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
    // If any error occurs during the process (e.g., database errors), catch the error and return a 500 Internal Server Error response with the error message.
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// User login - POST /api/auth/login - public
const login = async (req, res) => {
  try {
    // Extract the email and password from the request body
    const { email, password } = req.body;
    // Validate that both email and password are provided in the request. If either field is missing, return a 400 Bad Request response with error message.
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // Retrieve the user with the specified email from the database. The email is converted to lowercase to ensure case-insensitive matching.
    const user = await User.findOne({ email: email.toLowerCase() });
    // If no user is found with the provided email, return a 401 Unauthorized response with error message indicating invalid credentials.
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // If a user is found, compare the provided password with the stored password hash using bcrypt.
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    // If the passwords do not match, return a 401 Unauthorized response with error message indicating invalid credentials.
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // If the credentials are valid (i.e., the user exists and the password matches), generate a JWT token for the user.
    // The token will be used for authentication in subsequent requests.
    const token = generateToken(user._id);
    // Return a 200 OK response with a success message, the generated token, and the user information (excluding the password hash) in the response body.
    // The user information includes the user's ID, username, and email.
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
    // If any error occurs during the process (e.g., database errors), catch the error and return a 500 Internal Server Error response with the error message.
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get current user info - GET /api/auth/me - requires authentication
const getMe = async (req, res) => {
  return res.status(200).json({
    // The user field contains the authenticated user's information, which is available in req.user after successful authentication by the auth middleware.
    user: req.user,
  });
};

// Export the controller functions to be used in the routes
module.exports = {
  signup,
  login,
  getMe,
};
