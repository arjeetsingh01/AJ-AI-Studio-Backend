const express = require("express");

const {
  summarizeText,
  translateText,
  buildResume,
  writeEmail,
  assistCode,
  generateImage,
  documentQA,
} = require("../controllers/toolController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Summarizer
router.post("/summarizer", protect, summarizeText);

// Translator
router.post("/translator", protect, translateText);

// Resume Builder
router.post("/resume-builder", protect, buildResume);

// Email Writer
router.post("/email-writer", protect, writeEmail);

// Code Assistant
router.post("/code-assistant", protect, assistCode);

// Image Generator
router.post("/image-generator", protect, generateImage);

// Document Q&A
router.post("/document-qa", protect, documentQA);

module.exports = router;