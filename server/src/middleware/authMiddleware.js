const jwt = require("jsonwebtoken");
// Import the User model to query the database for user information based on the decoded token
const User = require("../models/User");

// Middleware function to authenticate requests using JWT tokens sent in the Authorization header as a Bearer token and attach
// the authenticated user to the request object for use in subsequent route handlers
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // Check if the Authorization header is present and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }
    // Extract the token from the Authorization header by splitting the string and taking the second part (the token itself) after "Bearer "
    const token = authHeader.split(" ")[1];
    // Verify the token using the JWT secret key defined in the environment variables and decode the payload to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Use the decoded user ID from the token to find the corresponding user in the database, excluding the password hash for security reasons
    const user = await User.findById(decoded.userId).select("-passwordHash");
    // If no user is found with the decoded user ID, return a 401 Unauthorized response indicating that the user is not authorized
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    // Attach the authenticated user object to the request object (req.user) so that it can be accessed in subsequent
    // route handlers that require authentication
    req.user = user;
    // Call the next middleware function in the stack to continue processing the request after successful authentication
    next();
    // If any error occurs during token verification or user lookup, catch the error and return a 401 Unauthorized response
    // indicating that the token is invalid or has failed verification
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = authMiddleware;
