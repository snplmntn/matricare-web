const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    diagnosis: {
      type: String,
      required: true,
      index: "text",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    duration: {
      type: String,
      required: true,
    },
    documentLink: {
      type: String,
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);
