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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ObstetricHistory", obstetricHistorySchema);
