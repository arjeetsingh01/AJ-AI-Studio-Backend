const Chat = require("../models/Chat");
const { generateAIResponse } = require("../services/aiService");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await generateAIResponse(message.trim());

    const chat = await Chat.create({
      user: req.user.userId,
      message: message.trim(),
      reply,
    });

    res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      chat: {
        id: chat._id,
        message: chat.message,
        reply: chat.reply,
        createdAt: chat.createdAt,
      },
    });
  } catch (error) {
    console.error("AI Chat Error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI service error",
    });
  }
};

module.exports = {
  chatWithAI,
};