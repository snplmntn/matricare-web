const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullname: {
      type: String,
      required: true,
      index: "text",
    },
    content: {
      type: String,
      required: true,
      index: "text",
    },
    address: {
      type: String,
      required: true,
      index: "text",
    },
    category: [
      {
        type: String,
        enum: [
          "First-Time Moms",
          "Baby Essentials",
          "Maternity Style",
          "Breast Feeding",
          "Gender Reveal",
          "Parenting Tips",
        ],
        default: "Pregnancy Updates",
      },
    ],
    picture: {
      type: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostLike" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
