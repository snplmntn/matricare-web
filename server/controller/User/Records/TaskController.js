const Task = require("../../../models/User/Task");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const task_get = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.query.id,
  });

  if (!task) return next(new AppError("Task not found", 404));

  return res.status(200).json(task);
});

const task_user_get = catchAsync(async (req, res, next) => {
  const { userId } = req.query;

  const task = await Task.find({
    userId: userId,
  });

  console.log(task);

  if (!task) return next(new AppError("Task not found", 404));

  return res.status(200).json(task);
});

const task_post = catchAsync(async (req, res, next) => {
  const newTask = new Task(req.body);

  await newTask.save();
  return res
    .status(200)
    .json({ message: "Task Successfully Created", newTask });
});

const task_put = catchAsync(async (req, res, next) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedTask) {
    return next(new AppError("Task not found", 404));
  }
  return res
    .status(200)
    .json({ message: "Task Updated Successfully", updatedTask });
});

const task_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Task identifier not found", 400));

  const deletedTask = await Task.findByIdAndDelete(req.query.id);

  if (!deletedTask) return next(new AppError("Task not found", 404));
  return res
    .status(200)
    .json({ message: "Task Successfully Deleted", deletedTask });
});

module.exports = {
  task_get,
  task_post,
  task_user_get,
  task_put,
  task_delete,
};
