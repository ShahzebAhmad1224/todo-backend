// routes/todoRoutes.js - Defines URL endpoints for todo operations
// All todo routes require authentication (user must be logged in)

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
} = require("../controllers/todoController");

// All routes in this file require authentication
// The 'protect' middleware runs before the route handler
router.use(protect);

// GET /api/todos - Get all todos for logged in user
router.get("/", getTodos);

// POST /api/todos - Create a new todo
router.post("/", createTodo);

// PUT /api/todos/:id - Update a specific todo
// :id is a URL parameter (variable)
router.put("/:id", updateTodo);

// DELETE /api/todos/:id - Delete a specific todo
router.delete("/:id", deleteTodo);

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch("/:id/toggle", toggleTodoStatus);

module.exports = router;
