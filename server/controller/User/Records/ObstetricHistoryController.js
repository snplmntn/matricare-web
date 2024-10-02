const ObstetricHistory = require("../../../models/User/ObstetricHistory");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const obstetric_history_get = catchAsync(async (req, res, next) => {
  const obstetricHistory = await ObstetricHistory.findOne({
    _id: req.query.id,
  });

  if (!obstetricHistory)
    return next(new AppError("Obstetric History not found", 404));

  return res.status(200).json(obstetricHistory);
});

const obstetric_history_user_get = catchAsync(async (req, res, next) => {
  const obstetricHistory = await ObstetricHistory.find({
    userId: req.query.userId,
  });

  if (!obstetricHistory)
    return next(new AppError("Obstetric History not found", 404));

  return res.status(200).json(obstetricHistory);
});

const obstetric_history_post = catchAsync(async (req, res, next) => {
  const newObstetricHistory = new ObstetricHistory(req.body);

  await newObstetricHistory.save();
  return res.status(200).json({
    message: "Obstetric History Successfully Created",
    newObstetricHistory,
  });
});

const obstetric_history_put = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Obstetric History identifier not found", 400));

  const updatedObstetricHistory = await ObstetricHistory.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedObstetricHistory) {
    return next(new AppError("Obstetric History not found", 404));
  }
  return res.status(200).json({
    message: "Obstetric History Updated Successfully",
    updatedObstetricHistory,
  });
});

const obstetric_history_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Obstetric History identifier not found", 400));

  const deletedObstetricHistory = await ObstetricHistory.findByIdAndDelete(
    req.query.id
  );

  if (!deletedObstetricHistory)
    return next(new AppError("Obstetric History not found", 404));
  return res.status(200).json({
    message: "Obstetric History Successfully Deleted",
    deletedObstetricHistory,
  });
});

module.exports = {
  obstetric_history_get,
  obstetric_history_user_get,
  obstetric_history_post,
  obstetric_history_put,
  obstetric_history_delete,
};
