const mongoose = require("mongoose");

// Defined the User schema with fields for username, email, and password hash, along with validation rules
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be 30 characters or less"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    // Store the hashed password instead of the plain text password for security
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
  },
  {
    // Enable automatic creation of createdAt and updatedAt timestamps
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
