const mongoose = require("mongoose");

const toolHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tool: {
      type: String,
      required: true,
      trim: true,
    },

    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ToolHistory = mongoose.model(
  "ToolHistory",
  toolHistorySchema
);

module.exports = ToolHistory;