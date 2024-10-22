const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      index: "text",
    },
    category: [
      {
        type: String,
        enum: [
          "Health & Wellness",
          "Finance & Budgeting",
          "Parenting & Family",
          "Baby’s Essentials",
          "Exercise & Fitness",
          "Labor & Delivery",
        ],
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostLike" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PostAnalytics", PostSchema);
