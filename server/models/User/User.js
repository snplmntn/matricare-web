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
    },
    address: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    pregnancyStartDate: {
      type: Date,
    },
    duedate: {
      type: Date,
    },
    age: {
      type: Number,
    },
    husband: {
      type: String,
    },
    husbandNumber: {
      type: String,
    },
    babyName: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    token: String,
    role: {
      type: String,
      required: true,
      enum: ["Patient", "Assistant", "Obgyne"],
      default: "Patient",
    },
    assignedTask: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    articleLastRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    savedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
