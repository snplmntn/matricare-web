const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    condition: {
      type: String,
      required: true,
      index: "text",
    },
    content: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("MedicalHistory", medicalHistorySchema);

module.exports = User;
