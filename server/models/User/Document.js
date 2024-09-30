const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
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

const User = mongoose.model("Document", documentSchema);

module.exports = User;
