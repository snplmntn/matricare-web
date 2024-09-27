const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    cityAddress: {
      type: String,
      index: "text",
    },
    address: {
      type: String,
      index: "text",
    },
    birthdate: {
      type: Date,
      index: "text",
    },
    duedate: {
      type: Date,
      index: "text",
    },
    age: {
      type: Number,
    },
    husband: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    role: {
      type: String,
      required: true,
      enum: ["patient", "assistant", "obgyne"],
      default: "patient",
    },
    articleLastRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
