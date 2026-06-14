// models/Todo.js - Defines what a "Todo" looks like in the database
// Each todo is linked to a specific user

const mongoose = require("mongoose");

/**
 * Todo Schema - Blueprint for todo items
 */
const todoSchema = new mongoose.Schema(
  {
    // Title of the task (required)
    title: {
      type: String,
      required: [true, "Please add a title for your task"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },

    // Description of the task (optional)
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
      default: "", // Empty string if not provided
    },

    // Status - completed or not (defaults to false/incomplete)
    completed: {
      type: Boolean,
      default: false,
    },

    // Link to the user who owns this todo
    // This creates a relationship between Todo and User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true, // Every todo must belong to a user
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

// Create an index for faster queries by userId
// This is like creating a "phone book" for looking up user's todos
todoSchema.index({ userId: 1 });

// Create and export the Todo model
module.exports = mongoose.model("Todo", todoSchema);
