const Patient = require("../../../models/User/Patient");
const User = require("../../../models/User/User");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

// Get Patient by Id
const patient_get = catchAsync(async (req, res, next) => {
  const patient = await Patient.find().populate("userId");

  if (!patient) return next(new AppError("Patient not found", 404));

  return res.status(200).json(patient);
});

// Get Patient by AssignedId
const patient_assigned_get = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const patient = await Patient.findById(id).populate("userId");

  if (!patient) return next(new AppError("Patient not found", 404));

  return res.status(200).json(patient);
});

// Create Patient
const patient_post = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user)
    return next(new AppError("Patient is not a registered user!", 404));

  const userCount = await Patient.find().countDocuments();
  const yearToday = new Date().getFullYear();
  req.body.seq = `${yearToday} - ${userCount + 1}`;
  req.body.userId = user._id;
  req.body.profilePicture = user.profilePicture;

  let newPatient = new Patient(req.body);

  await newPatient.save();

  newPatient = await newPatient.populate("userId");

  return res
    .status(200)
    .json({ message: "Patient Successfully Created", newPatient });
});

// Update Patient
const patient_put = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Patient identifier not found", 400));

  const updatedPatient = await Patient.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedPatient) {
    return next(new AppError("Patient not found", 404));
  }
  return res
    .status(200)
    .json({ message: "Patient Updated Successfully", updatedPatient });
});

// Delete Patient
const patient_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Patient identifier not found", 400));

  const deletedPatient = await Patient.findByIdAndDelete(req.query.id);

  if (!deletedPatient) return next(new AppError("Patient not found", 404));
  return res
    .status(200)
    .json({ message: "Patient Successfully Deleted", deletedPatient });
});

module.exports = {
  patient_get,
  patient_assigned_get,
  patient_post,
  patient_put,
  patient_delete,
};
