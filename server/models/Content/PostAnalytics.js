const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
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
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PostAnalytics", PostSchema);
