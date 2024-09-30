const MedicalHistory = require("../../../models/User/MedicalHistory");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const medical_history_get = catchAsync(async (req, res, next) => {
  const medicalHistory = await MedicalHistory.findOne({
    _id: req.query.id,
  });

  if (!medicalHistory)
    return next(new AppError("Medical History not found", 404));

  return res.status(200).json(medicalHistory);
});

const medical_history_user_get = catchAsync(async (req, res, next) => {
  const medicalHistory = await MedicalHistory.find({
    userId: req.query.userId,
  });

  if (!medicalHistory)
    return next(new AppError("Medical History not found", 404));

  return res.status(200).json(medicalHistory);
});

const medical_history_post = catchAsync(async (req, res, next) => {
  const newMedicalHistory = new MedicalHistory(req.body);

  await newMedicalHistory.save();
  return res.status(200).json({
    message: "Medical History Successfully Created",
    newMedicalHistory,
  });
});

const medical_history_put = catchAsync(async (req, res, next) => {
  const updatedMedicalHistory = await MedicalHistory.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedMedicalHistory) {
    return next(new AppError("Medical History not found", 404));
  }
  return res.status(200).json({
    message: "Medical History Updated Successfully",
    updatedMedicalHistory,
  });
});

const medical_history_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Medical History identifier not found", 400));

  const deletedMedicalHistory = await MedicalHistory.findByIdAndDelete(
    req.query.id
  );

  if (!deletedMedicalHistory)
    return next(new AppError("Medical History not found", 404));
  return res.status(200).json({
    message: "Medical History Successfully Deleted",
    deletedMedicalHistory,
  });
});

module.exports = {
  medical_history_get,
  medical_history_user_get,
  medical_history_post,
  medical_history_put,
  medical_history_delete,
};
