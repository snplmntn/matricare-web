const mongoose = require("mongoose");

const AIResponseSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      index: "text",
    },
    response: {
      type: String,
      required: true,
      index: "text",
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
AIResponseSchema.index({ postId: 1, isActive: 1 });

module.exports = mongoose.model("AIResponse", AIResponseSchema);
