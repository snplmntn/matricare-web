const mongoose = require("mongoose");

const GeneratedArticleSchema = new mongoose.Schema(
  {
    engagement: Number,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GeneratedArticle", GeneratedArticleSchema);
