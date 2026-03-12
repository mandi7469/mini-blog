// Load environment variables from .env file
require("dotenv").config();

// Import the Express app and database connection function
const app = require("./app");
const connectDB = require("./config/db");

// Define the port to listen on, defaulting to 5050 if not specified in environment variables
const PORT = process.env.PORT || 5050;

// Start the server after connecting to the database. This ensures that the server only starts if the database connection is successful.
const startServer = async () => {
  // Connect to the database
  await connectDB();
  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

// Invoke the function to start the server
startServer();
