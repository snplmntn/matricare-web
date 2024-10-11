const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedBy: String,
    author: {
      type: String,
      required: true,
      index: "text",
    },
    title: {
      type: String,
      required: true,
      index: "text",
    },
    fullTitle: {
      type: String,
      required: true,
      index: "text",
    },
    content: {
      type: String,
      required: true,
      index: "text",
    },
    category: {
      type: String,
      enum: [
        "First Time Moms",
        "Health",
        "Labor",
        "Finance",
        "Fashion",
        "Pregnancy",
      ],
      default: "First Time Moms",
    },
    status: {
      type: String,
      enum: ["Draft", "Approved", "Archived"],
      default: "Draft",
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
