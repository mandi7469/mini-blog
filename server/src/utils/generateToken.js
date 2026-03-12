const jwt = require("jsonwebtoken");

// Function to generate a JWT token for a given user ID
const generateToken = (userId) => {
  // Sign the token with the user ID and a secret key, and set an expiration time of 7 days
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
