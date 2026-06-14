// config/db.js - Handles connection to MongoDB database
// This file tells our app how to talk to the database

const mongoose = require("mongoose");

/**
 * connectDB - Function that connects to MongoDB database
 * This is like making a phone call to the database
 */
const connectDB = async () => {
  try {
    // Try to connect using the URL from .env file
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(` Database connected successfully!`);
    console.log(` Database name: ${connection.connection.name}`);
    console.log(` Database host: ${connection.connection.host}`);

    // Handle database disconnection
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Database disconnected");
    });
  } catch (error) {
    console.error(` Database connection failed: ${error.message}`);
    // Stop the application if can't connect to database
    process.exit(1);
  }
};

module.exports = connectDB;
