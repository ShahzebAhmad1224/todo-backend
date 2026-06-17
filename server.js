// server.js - This is the MAIN file that starts our backend server
// Think of this as the "engine" that makes everything work

// Import all the required packages
const express = require("express"); // Web server framework
const mongoose = require("mongoose"); // Database connection
const cors = require("cors"); // Allows frontend to connect
const dotenv = require("dotenv"); // Reads .env file
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
// Load environment variables from .env file
dotenv.config();

// Import database connection function
const connectDB = require("./config/db");

// Import route files (these handle different URL requests)
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

// Create our express application
const app = express();

// ============ MIDDLEWARE SETUP ============
// Middleware are functions that run between the request and response

// 1. Parse JSON bodies (so we can read data sent from frontend)
app.use(express.json());

// 2. Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// 3. Enable CORS (allows frontend to make requests to backend)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://todo-frontend-zeb2.vercel.app"],
    credentials: true,
  }),
);

// ============ ROUTE SETUP ============
// Routes define what happens when someone visits different URLs

// Authentication routes (register, login)
app.use("/api/auth", authRoutes);

// Todo routes (create, read, update, delete todos)
app.use("/api/todos", todoRoutes);

// Test route to check if server is working
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Todo-App API! Server is running." });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
// First connect to database, then start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(` Visit: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Start everything
startServer();
