const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
    },
    senderPhoneNumber: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Article", "Appointment"],
      default: "Appointment",
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipientUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
