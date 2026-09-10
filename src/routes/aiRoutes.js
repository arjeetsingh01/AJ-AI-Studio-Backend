const express = require("express");

const { chatWithAI } = require("../controllers/aiController");

const {
  getChatHistory,
  deleteChat,
} = require("../controllers/historyController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// AI Chat
router.post("/chat", protect, chatWithAI);

// Chat History
router.get("/history", protect, getChatHistory);

// Delete Chat
router.delete("/history/:id", protect, deleteChat);

module.exports = router;