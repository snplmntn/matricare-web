const Notification = require("../../models/User/Notification");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Get Notification by Id, UserId, or Index Notifications
const notification_get = catchAsync(async (req, res, next) => {
  const { id, userId } = req.query;

  let notification;
  if (id) {
    notification = await Notification.findOne({
      _id: req.query.id,
    });
  } else if (userId) {
    notification = await Notification.find({
      recipientUserId: req.query.userId,
    });
  } else {
    notification = await Notification.find();
  }

  if (!notification) return next(new AppError("Notification not found", 404));

  return res.status(200).json(notification);
});

const notification_put = catchAsync(async (req, res, next) => {
  const updatedNotification = await Notification.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedNotification) {
    return next(new AppError("Notification not found", 404));
  }
  return res.status(200).json({
    message: "Notification Updated Successfully",
    updatedNotification,
  });
});

module.exports = {
  notification_get,
  notification_put,
};
