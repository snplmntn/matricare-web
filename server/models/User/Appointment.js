const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientName: {
      type: String,
      required: true,
      index: "text",
    },
    location: {
      type: String,
      enum: [
        "Mary Chiles, Sampaloc",
        "Grace Medical Center",
        "Family Care Tungko",
      ],
      default: "Mary Chiles, Sampaloc",
    },
    category: {
      type: String,
      enum: ["New Patient", "Follow-up Check up"],
      default: "Follow-up Check up",
    },
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Rescheduled"],
      default: "Confirmed",
    },
    date: {
      type: Date,
      required: true,
    },
    document: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
