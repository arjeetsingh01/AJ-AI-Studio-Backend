const Chat = require("../models/Chat");

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: chats.length,
      chats,
    });
  } catch (error) {
    console.error("History Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
};

// Delete a chat
const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Delete Chat Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
    });
  }
};

module.exports = {
  getChatHistory,
  deleteChat,
};