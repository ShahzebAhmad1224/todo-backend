// middleware/authMiddleware.js - Verifies user is logged in
// This protects routes that only logged-in users can access

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect - Middleware function that checks if user is authenticated
 * This runs BEFORE the actual route handler
 *
 * How it works:
 * 1. Check if request has a token in the headers
 * 2. Verify the token is valid
 * 3. Find the user from the token
 * 4. Attach user to request object
 * 5. Continue to the route handler
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  // Authorization header looks like: "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (remove 'Bearer ' prefix)
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from token, exclude password field
      req.user = await User.findById(decoded.id).select("-password");

      // If user doesn't exist, return error
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // User is authenticated, proceed to the route
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);

      // Handle different JWT errors
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again.",
        });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  }

  // If no token found, return error
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login first.",
    });
  }
};

module.exports = { protect };
