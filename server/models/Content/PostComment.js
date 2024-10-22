const mongoose = require("mongoose");

const PostCommentSchema = new mongoose.Schema(
  {
    profilePicture: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    content: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostLike" }],
    forAnalysis: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PostComment", PostCommentSchema);
