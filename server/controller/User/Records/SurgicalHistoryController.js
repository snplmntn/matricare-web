const SurgicalHistory = require("../../../models/User/SurgicalHistory");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const surgical_history_get = catchAsync(async (req, res, next) => {
  const surgicalHistory = await SurgicalHistory.findOne({
    _id: req.query.id,
  });

  if (!surgicalHistory)
    return next(new AppError("Surgical History not found", 404));

  return res.status(200).json(surgicalHistory);
});

const surgical_history_user_get = catchAsync(async (req, res, next) => {
  const surgicalHistory = await SurgicalHistory.find({
    userId: req.query.userId,
  });

  if (!surgicalHistory)
    return next(new AppError("Surgical History not found", 404));

  return res.status(200).json(surgicalHistory);
});

const surgical_history_post = catchAsync(async (req, res, next) => {
  const newSurgicalHistory = new SurgicalHistory(req.body);

  await newSurgicalHistory.save();
  return res.status(200).json({
    message: "Surgical History Successfully Created",
    newSurgicalHistory,
  });
});

const surgical_history_put = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Surgical History identifier not found", 400));

  const updatedSurgicalHistory = await SurgicalHistory.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedSurgicalHistory) {
    return next(new AppError("Surgical History not found", 404));
  }
  return res.status(200).json({
    message: "Surgical History Updated Successfully",
    updatedSurgicalHistory,
  });
});

const surgical_history_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Surgical History identifier not found", 400));

  const deletedSurgicalHistory = await SurgicalHistory.findByIdAndDelete(
    req.query.id
  );

  if (!deletedSurgicalHistory)
    return next(new AppError("Surgical History not found", 404));
  return res.status(200).json({
    message: "Surgical History Successfully Deleted",
    deletedSurgicalHistory,
  });
});

module.exports = {
  surgical_history_get,
  surgical_history_user_get,
  surgical_history_post,
  surgical_history_put,
  surgical_history_delete,
};
