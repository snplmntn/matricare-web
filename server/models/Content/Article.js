const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    fullname: {
      type: String,
      required: true,
      index: "text",
    },
    title: {
      type: String,
      required: true,
      index: "text",
    },
    content: {
      type: String,
      required: true,
      index: "text",
    },
    subject: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", ArticleSchema);
