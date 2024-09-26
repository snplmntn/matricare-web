const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ["Pregnancy Updates", "Baby Care Tips", "Health & Wellness"],
    default: "Pregnancy Updates",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostLike" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
});

module.exports = mongoose.model("Post", PostSchema);
