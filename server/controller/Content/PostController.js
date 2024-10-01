const Post = require("../../models/Content/Post");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const post_get = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.query.id,
  });

  if (!post) return next(new AppError("Post not found", 404));

  return res.status(200).json(post);
});

const post_index = catchAsync(async (req, res, next) => {
  const { postId } = req.query;
  let query = {};

  // If lastPostId exists in query, construct query to fetch posts before that ID
  if (postId && postId !== "null") {
    query._id = { $lt: postId };
  }

  // Fetch posts based on the constructed query, sorting by _id in descending order
  const posts = await Post.find(query).sort({ _id: -1 }).limit(20).lean();

  return res.status(200).json(posts);
});

const post_user_get = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    fullname: req.query.fullname,
  });
  if (!posts) return next(new AppError("Post not found", 404));
  return res.status(200).json(posts);
});

const post_post = catchAsync(async (req, res, next) => {
  const newPost = new Post(req.body);

  const savedPost = await newPost.save();
  return res
    .status(200)
    .json({ message: "Post Successfully Created", savedPost });
});

const post_put = catchAsync(async (req, res, next) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedPost) {
    return next(new AppError("Post not found", 404));
  }
  return res
    .status(200)
    .json({ message: "Post Updated Successfully", updatedPost });
});

const post_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Post identifier not found", 400));

  const deletedPost = await Post.findByIdAndDelete(req.query.id);

  if (!deletedPost) return next(new AppError("Post not found", 404));
  return res
    .status(200)
    .json({ message: "Post Successfully Deleted", deletedPost });
});

module.exports = {
  post_get,
  post_index,
  post_user_get,
  post_post,
  post_put,
  post_delete,
};
