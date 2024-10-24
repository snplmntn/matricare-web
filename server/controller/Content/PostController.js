const axios = require("axios");
const Post = require("../../models/Content/Post");
const PostAnalytics = require("../../models/Content/PostAnalytics");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Get Post by Id
const post_get = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.query.id,
  }).populate("userId");

  if (!post) return next(new AppError("Post not found", 404));

  return res.status(200).json(post);
});

// Index Post
const post_index = catchAsync(async (req, res, next) => {
  const { postId } = req.query;
  let query = {};

  // If lastPostId exists in query, construct query to fetch posts before that ID
  if (postId && postId !== "null") {
    query._id = { $lt: postId };
  }

  // Fetch posts based on the constructed query, sorting by _id in descending order
  const posts = await Post.find(query)
    .populate("userId")
    .populate("likes")
    .populate("comments")
    .sort({ _id: -1 })
    .limit(20)
    .lean();

  return res.status(200).json(posts);
});

// Get Post by UserId
const post_user_get = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    fullname: req.query.fullname,
  }).populate("userId");
  if (!posts) return next(new AppError("Post not found", 404));
  return res.status(200).json(posts);
});

// Create Post
const post_post = catchAsync(async (req, res, next) => {
  const response = await axios.post(`${process.env.OPEN_API_LINK}/classify`, {
    content: req.body.content,
  });

  req.body.category = response.data.category;

  const newPost = await Post.create(req.body);

  const savedPost = await Post.findById(newPost._id).populate("userId");

  if (savedPost.userId.verified) {
    const post = await PostAnalytics.create({
      content: newPost.content,
      category: newPost.category,
    });

    await Post.findByIdAndUpdate(
      savedPost._id,
      { postAnalytics: post._id },
      { new: true }
    );
  }

  return res
    .status(200)
    .json({ message: "Post Successfully Created", savedPost });
});

// Update Post
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

// Delete Post
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
