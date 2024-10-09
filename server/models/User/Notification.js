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
    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
    },
    category: {
      type: String,
      enum: ["Article", "Appointment"],
      default: "Appointment",
    },
    recipientUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
