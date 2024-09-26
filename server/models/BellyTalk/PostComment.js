const mongoose = require("mongoose");

const PostCommentSchema = new mongoose.Schema({
  profilePicture: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  fullname: String,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  postCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "PostComment" },
  content: String,
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  dateCreated: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostLike" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
});

module.exports = mongoose.model("PostComment", PostCommentSchema);
