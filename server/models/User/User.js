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
    emailValid: {
      type: Boolean,
      default: false,
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
    },
    duedate: {
      type: Date,
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
      enum: ["Patient", "Assistant", "Obgyne"],
      default: "Patient",
    },
    profilePicture: {
      type: String,
    },
    token: String,
    assignedTask: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
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
