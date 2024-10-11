const mongoose = require("mongoose");

const surgicalHistorySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      index: "text",
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

module.exports = mongoose.model("SurgicalHistory", surgicalHistorySchema);
