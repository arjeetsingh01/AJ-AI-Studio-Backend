const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected test route
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route 🔐",
    userId: req.user.userId,
  });
});

module.exports = router;