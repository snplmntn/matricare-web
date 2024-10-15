const User = require("../../models/User/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../../models/Content/Post");
const PostComment = require("../../models/Content/PostComment");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Get User by Id or Username
const user_get = catchAsync(async (req, res, next) => {
  const { userId, username } = req.query;

  const user = userId
    ? await User.findById(userId)
        .populate({
          path: "savedPost",
          populate: {
            path: "userId", // Populating userId inside savedPost
          },
        })
        .populate({
          path: "savedArticle", // Populating savedArticle
          populate: {
            path: "userId", // Populating userId inside savedArticle (if needed)
          },
        })
    : await User.findOne({ username: username })
        .populate({
          path: "savedPost",
          populate: {
            path: "userId", // Populating userId inside savedPost
          },
        })
        .populate({
          path: "savedArticle", // Populating savedArticle
          populate: {
            path: "userId", // Populating userId inside savedArticle (if needed)
          },
        });
  const { password, likedPost, __v, ...other } = user._doc;

  if (!user) return next(new AppError("User not found", 404));

  return res.status(200).json({ message: "User Fetched", other });
});

// Get User by Role
const role_get = catchAsync(async (req, res, next) => {
  const { role } = req.query;

  const accounts = await User.find({ role })
    .populate({
      path: "savedPost",
      populate: {
        path: "userId", // Populating userId inside savedPost
      },
    })
    .populate({
      path: "savedArticle", // Populating savedArticle
      populate: {
        path: "userId", // Populating userId inside savedArticle (if needed)
      },
    });

  if (!accounts) return next(new AppError("User not found", 404));

  return res.status(200).json(accounts);
});

// Get All Users
const user_index = catchAsync(async (req, res, next) => {
  const accounts = await User.find()
    .populate({
      path: "savedPost",
      populate: {
        path: "userId", // Populating userId inside savedPost
      },
    })
    .populate({
      path: "savedArticle", // Populating savedArticle
      populate: {
        path: "userId", // Populating userId inside savedArticle (if needed)
      },
    });

  if (!accounts) return next(new AppError("Users not found", 404));

  return res.status(200).json(accounts);
});

// Delete User
const user_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  if (id !== req.userId) {
    await User.findByIdAndDelete(id);
    return res.status(200).json("Account Successfully Deleted");
  } else {
    return res.status(403).json("You can only delete your own account");
  }
});

// Update User
const user_update = catchAsync(async (req, res, next) => {
  const KEY = process.env.JWT_KEY;
  const { userId } = req.query;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not Found.", 404));
  }

  if (req.body.newPassword && req.body.password) {
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
    postUpdate.fullName = req.body.fullName;
    commentUpdate.fullName = req.body.fullname;
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

  res.cookie("token", token, cookieOptions);

  return res
    .status(200)
    .json({ message: "Account Successfully Updated", token: token });
});

const save_article_put = catchAsync(async (req, res, next) => {
  const { userId, postId, articleId } = req.query;

  if (!userId) return next(new AppError("No User Identifier", 400));
  if (!postId && !articleId)
    return next(new AppError("No Query Identifier", 400));

  const identifier = postId ? "savedPost" : "savedArticle";
  const id = postId ? postId : articleId;
  const update = {};
  update[identifier] = id;

  // Check if the post/article is already saved
  const user = await User.findById(userId);
  if (user[identifier].includes(id)) {
    return res.status(200).json({
      message: `${postId ? "Post" : "Article"} is not yet saved.`,
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: update },
    { new: true }
  );

  if (!updatedUser) return next(new AppError("User not found", 404));

  return res.status(200).json({
    message: `${postId ? "Post" : "Article"} saved Successfully`,
    updatedUser,
  });
});

const remove_saved_article = catchAsync(async (req, res, next) => {
  const { userId, postId, articleId } = req.query;

  if (!userId) return next(new AppError("No User Identifier", 400));
  if (!postId && !articleId)
    return next(new AppError("No Query Identifier", 400));

  const identifier = postId ? "savedPost" : "savedArticle";
  const id = postId ? postId : articleId;
  const update = {};
  update[identifier] = id;

  // Check if the post/article is already saved
  const user = await User.findById(userId);
  if (!user[identifier].includes(id)) {
    return res.status(200).json({
      message: `${postId ? "Post" : "Article"} is not yet saved.`,
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: update },
    { new: true }
  );
  if (!updatedUser) return next(new AppError("User not found", 404));

  return res.status(200).json({
    message: `${postId ? "Post" : "Article"} unsaved Successfully`,
    updatedUser,
  });
});

module.exports = {
  user_get,
  user_index,
  role_get,
  user_delete,
  user_update,
  save_article_put,
  remove_saved_article,
};
