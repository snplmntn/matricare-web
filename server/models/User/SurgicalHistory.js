const mongoose = require("mongoose");

const surgicalHistorySchema = new mongoose.Schema(
  {
    condition: {
      type: String,
      required: true,
      index: "text",
    },
    date: {
      type: Date,
      required: true,
    },
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("SurgicalHistory", surgicalHistorySchema);

module.exports = User;
