const ToolHistory = require("../models/ToolHistory");

// Get user's tool history
const getToolHistory = async (req, res) => {
  try {
    const history = await ToolHistory.find({
      user: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Tool History Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tool history",
    });
  }
};

// Delete a tool history item
const deleteToolHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await ToolHistory.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Tool history not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tool history deleted successfully",
    });
  } catch (error) {
    console.error("Delete Tool History Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete tool history",
    });
  }
};

module.exports = {
  getToolHistory,
  deleteToolHistory,
};