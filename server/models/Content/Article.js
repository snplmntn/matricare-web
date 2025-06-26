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
      index: "text",
    },
    category: {
      type: String,
      enum: [
        "Health & Wellness",
        "Finance & Budgeting",
        "Parenting & Family",
        "Baby’s Essentials",
        "Exercise & Fitness",
        "Labor & Delivery",
      ],
      default: "Health & Wellness",
    },
    status: {
      type: String,
      enum: ["Draft", "Approved", "Revision", "Archived"],
      default: "Draft",
    },
    picture: {
      type: String,
    },
    engagement: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
