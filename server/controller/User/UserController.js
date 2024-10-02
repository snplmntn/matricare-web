const User = require("../../models/User/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../../models/Content/Post");
const PostComment = require("../../models/Content/PostComment");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const user_get = catchAsync(async (req, res, next) => {
  const { userId, username } = req.query;

  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ username: username });
  const { password, savedPost, likedPost, __v, ...other } = user._doc;

  if (!user) return next(new AppError("User not found", 404));

  return res.status(200).json({ message: "User Fetched", other });
});

const role_get = catchAsync(async (req, res, next) => {
  const { role } = req.query;

  const accounts = await User.find({ role });

  if (!accounts) return next(new AppError("User not found", 404));

  return res.status(200).json(accounts);
});

const user_index = catchAsync(async (req, res, next) => {
  const accounts = await User.find();

  if (!accounts) return next(new AppError("Users not found", 404));

  return res.status(200).json(accounts);
});

const user_delete = catchAsync(async (req, res, next) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {
  await User.findByIdAndDelete(req.query.id);
  return res.status(200).json("Account Successfully Deleted");

  // } else {
  //   return res.status(403).json("You can only delete your own account");
  // }
});

const user_update = catchAsync(async (req, res, next) => {
  const KEY = process.env.JWT_KEY;
  const { userId } = req.query;
  console.log(req.body);

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not Found.", 404));
  }

  if (req.body.newPassword) {
    const salt = await bcrypt.genSalt(10);

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //User has correct password
    if (isPasswordValid) {
      req.body.password = await bcrypt.hash(req.body.newPassword, salt);
      delete req.body.newPassword;
    } else return next(new AppError("Incorrect Password", 401));
  }

  // ===================== POST =============================
  let postUpdate = {},
    commentUpdate = {};

  if (req.body.profilePicture) {
    postUpdate.profilePicture = req.body.profilePicture;
    commentUpdate.profilePicture = req.body.profilePicture;
  }
  if (req.body.fullname) {
    postUpdate.fullname = req.body.fullname;
    commentUpdate.fullname = req.body.fullname;
  }
  if (req.body.cityAddress) postUpdate.address = req.body.cityAddress;

  //Post
  await Post.updateMany(
    { userId: userId },
    { $set: postUpdate },
    { new: true }
  );

  //Post Comment
  await PostComment.updateMany(
    { userId: userId },
    { $set: commentUpdate },
    { new: true }
  );

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true }
  );

  if (!updatedUser) return next(new AppError("User not Found.", 404));

  const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const payload = { user: JSON.stringify(updatedUser), exp: expiration };
  const token = jwt.sign(payload, KEY);
  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_TEMP_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("tempToken", token, cookieOptions);

  return res
    .status(200)
    .json({ message: "Account Successfully Updated", token: token });
});

module.exports = {
  user_get,
  user_index,
  role_get,
  user_delete,
  user_update,
};
