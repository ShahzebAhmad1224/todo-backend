// routes/authRoutes.js - Defines URL endpoints for authentication
// This file connects URLs to controller functions

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (no authentication needed)
// POST /api/auth/register - Create new account
router.post("/register", registerUser);

// POST /api/auth/login - Login to existing account
router.post("/login", loginUser);

// Protected route (requires authentication)
// GET /api/auth/me - Get current user info
router.get("/me", protect, getMe);

module.exports = router;
