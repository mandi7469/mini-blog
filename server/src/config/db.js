// mongodb connection setup using mongoose.
const mongoose = require("mongoose");

// Database Connection Utility. Establishes a connection to MongoDB using Mongoose. This is called during the server initialization phase.
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // Log a success message with the host information if the connection is successful
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    // Log an error message and exit the process if the connection fails
    console.error(`MongoDB connection error: ${error.message}`);
    // Critical: Exit the process with a failure code if we can't connect to the DB, the API cannot function;
    process.exit(1);
  }
};

module.exports = connectDB;
