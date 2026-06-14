// controllers/todoController.js - Handles all todo operations (CRUD)
// CRUD = Create, Read, Update, Delete

const Todo = require("../models/Todo");

/**
 * @desc    Get all todos for the logged in user
 * @route   GET /api/todos
 * @access  Private (requires login)
 */
const getTodos = async (req, res) => {
  try {
    // Find all todos where userId matches the logged in user
    const todos = await Todo.find({ userId: req.user.id }).sort({
      createdAt: -1,
    }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: todos.length, // Send count of todos
      todos: todos,
    });
  } catch (error) {
    console.error("Get todos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new todo
 * @route   POST /api/todos
 * @access  Private
 */
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate title is provided
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Please provide a title for your todo",
      });
    }

    // Create todo with userId from authenticated user
    const todo = await Todo.create({
      title: title,
      description: description || "", // Default to empty string if not provided
      completed: false, // New todos start as incomplete
      userId: req.user.id, // Link to logged in user
    });

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo: todo,
    });
  } catch (error) {
    console.error("Create todo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create todo",
      error: error.message,
    });
  }
};

/**
 * @desc    Update a todo (title, description, or completed status)
 * @route   PUT /api/todos/:id
 * @access  Private
 */
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params; // Get todo ID from URL
    const { title, description, completed } = req.body;

    // Find todo by ID
    let todo = await Todo.findById(id);

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // IMPORTANT: Check if todo belongs to the logged in user
    // This is the AUTHORIZATION part - preventing access to others' todos
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this todo",
      });
    }

    // Update only the fields that are provided
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    // Save the updated todo
    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: todo,
    });
  } catch (error) {
    console.error("Update todo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update todo",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a todo
 * @route   DELETE /api/todos/:id
 * @access  Private
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Find todo by ID
    const todo = await Todo.findById(id);

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // IMPORTANT: Check if todo belongs to the logged in user
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this todo",
      });
    }

    // Delete the todo
    await todo.deleteOne();

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete todo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
      error: error.message,
    });
  }
};

/**
 * @desc    Toggle todo completion status (mark complete/incomplete)
 * @route   PATCH /api/todos/:id/toggle
 * @access  Private
 */
const toggleTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find todo by ID
    const todo = await Todo.findById(id);

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // Check authorization
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this todo",
      });
    }

    // Toggle the completed status
    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      success: true,
      message: `Todo marked as ${todo.completed ? "completed" : "incomplete"}`,
      todo: todo,
    });
  } catch (error) {
    console.error("Toggle todo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle todo status",
      error: error.message,
    });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
};
