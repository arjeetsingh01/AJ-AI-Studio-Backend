const express = require("express");

const {
  getToolHistory,
  deleteToolHistory,
} = require("../controllers/toolHistoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get tool history
router.get("/", protect, getToolHistory);

// Delete tool history
router.delete("/:id", protect, deleteToolHistory);

module.exports = router;