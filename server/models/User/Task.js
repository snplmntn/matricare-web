const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
      index: "text",
    },
    prescribedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["On Progress", "Complete"],
      default: "On Progress",
    },
    prescribedBy: {
      type: String,
      required: true,
      index: "text",
    },
    orderNumber: {
      type: String,
      required: true,
      index: "text",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
