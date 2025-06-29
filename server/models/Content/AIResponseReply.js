const mongoose = require("mongoose");

const AIResponseReplySchema = new mongoose.Schema(
  {
    aiResponseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIResponse",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
AIResponseReplySchema.index({ aiResponseId: 1, isActive: 1 });
AIResponseReplySchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("AIResponseReply", AIResponseReplySchema);
