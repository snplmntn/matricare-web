const mongoose = require("mongoose");

const PostLikeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likeable: { type: mongoose.Schema.Types.ObjectId, refPath: "likeableModel" }, // Polymorphic reference
  likeableModel: {
    type: String,
    enum: ["Post", "PostComment"],
  },
  username: String,
});

module.exports = mongoose.model("PostLike", PostLikeSchema);
