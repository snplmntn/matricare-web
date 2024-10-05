const Appointment = require("../../models/User/Appointment");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Get Appointment by Id
const appointment_get = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findOne({
    _id: req.query.id,
  });

  if (!appointment) return next(new AppError("Appointment not found", 404));

  return res.status(200).json(appointment);
});

// Get Appointment by UserId
const appointment_user_get = catchAsync(async (req, res, next) => {
  const { userId } = req.query;

  const appointment = await Appointment.find({
    userId: userId,
  });

  if (!appointment) return next(new AppError("Appointment not found", 404));

  return res.status(200).json(appointment);
});

// Create Appointment
const appointment_post = catchAsync(async (req, res, next) => {
  const newAppointment = new Appointment(req.body);

  await newAppointment.save();
  return res
    .status(200)
    .json({ message: "Appointment Successfully Created", newAppointment });
});

// Update Appointment
const appointment_put = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Appointment identifier not found", 400));

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedAppointment) {
    return next(new AppError("Appointment not found", 404));
  }
  return res
    .status(200)
    .json({ message: "Appointment Updated Successfully", updatedAppointment });
});

// Delete Appointment
const appointment_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Appointment identifier not found", 400));

  const deletedAppointment = await Appointment.findByIdAndDelete(req.query.id);

  if (!deletedAppointment)
    return next(new AppError("Appointment not found", 404));
  return res
    .status(200)
    .json({ message: "Appointment Successfully Deleted", deletedAppointment });
});

module.exports = {
  appointment_get,
  appointment_post,
  appointment_user_get,
  appointment_put,
  appointment_delete,
};
