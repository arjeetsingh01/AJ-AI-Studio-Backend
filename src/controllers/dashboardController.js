const User = require("../models/User");
const Chat = require("../models/Chat");
const ToolHistory = require("../models/ToolHistory");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select(
      "name email createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalChats = await Chat.countDocuments({
      user: userId,
    });

    const totalToolUsage = await ToolHistory.countDocuments({
      user: userId,
    });

    const recentChats = await Chat.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("message reply createdAt");

    const recentTools = await ToolHistory.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("tool input result createdAt");

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },

        stats: {
          totalChats,
          totalToolUsage,
          totalActivity: totalChats + totalToolUsage,
        },

        recentChats,
        recentTools,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};