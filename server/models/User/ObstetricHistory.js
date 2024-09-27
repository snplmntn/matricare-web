const mongoose = require("mongoose");

const obstetricHistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    content: {
      type: String,
      index: "text",
      required: true,
    },
    userId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("ObstetricHistory", obstetricHistorySchema);

module.exports = User;
