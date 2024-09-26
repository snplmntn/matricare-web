const Post = require("../../models/BellyTalk/Post");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const post_index = catchAsync(async (req, res, next) => {
  const { postId } = req.query;
  let query = {};

  // If lastPostId exists in query params, construct query to fetch posts before that ID
  if (postId && postId !== "null") {
    query._id = { $lt: postId };
  }

  // Fetch posts based on the constructed query, sorting by _id in descending order
  const posts = await Post.find(query).sort({ _id: -1 }).limit(20).lean();

  return res.status(200).json(posts);
});

const post_get = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.params.id,
  });

  if (!post) return next(new AppError("Post not found", 404));

  return res.status(200).json(post);
});

const post_user_get = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    username: req.query.username,
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

const post_update = catchAsync(async (req, res, next) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id, // Update based on the document's ID
    { $set: req.body }, // New data to set
    { new: true } // Return the updated document
  );

  if (!updatedPost) {
    return next(new AppError("Post not found", 404));
  }
  return res
    .status(200)
    .json({ message: "Post Updated Successfully", updatedPost });
});

const post_delete = catchAsync(async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.id);
  return res.status(200).json("Post Successfully Deleted");
});

module.exports = {
  post_index,
  post_get,
  post_user_get,
  post_post,
  post_update,
  post_delete,
};
