const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientName: {
      type: String,
      required: true,
      index: "text",
    },
    location: {
      type: String,
      required: true,
      index: "text",
    },
    category: {
      type: String,
      required: true,
      index: "text",
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled", "Rescheduled"],
      default: "Pending",
    },
    prescribedDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
