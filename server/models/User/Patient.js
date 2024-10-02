const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
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
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Patient", "Admin"],
      default: "Patient",
    },
    role: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Patient", patientSchema);

module.exports = User;