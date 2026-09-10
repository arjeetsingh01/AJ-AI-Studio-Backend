const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Change password
router.put("/change-password", protect, changePassword);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.put("/reset-password/:token", resetPassword);

module.exports = router;