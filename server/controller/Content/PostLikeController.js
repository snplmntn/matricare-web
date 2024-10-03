const PostComment = require("../../models/Content/PostComment");
const PostLike = require("../../models/Content/PostLike");
const Post = require("../../models/Content/Post");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Like Post
const like_post = catchAsync(async (req, res, next) => {
  const { userId, postId, postCommentId } = req.body;

  // Determine the likeable item and model based on request parameters
  let likeableId, likeableModel, existingLike;
  if (postId) {
    likeableId = postId;
    likeableModel = "Post";

    existingLike = await PostLike.findOne({
      userId: userId,
      likeable: likeableId,
    });
  } else if (postCommentId) {
    likeableId = postCommentId;
    likeableModel = "PostComment";

    existingLike = await PostComment.findOne({
      userId: userId,
      likeable: likeableId,
    });
  } else {
    // Handle invalid request parameters
    return next(new AppError("Invalid request parameters", 400));
  }

  if (existingLike)
    return res.status(200).json({
      message: `${likeableModel} already liked`,
      existingLike,
    });

  const like = new PostLike({
    userId: userId,
    likeable: likeableId,
    likeableModel: likeableModel,
  });

  let updatedModel;
  await like.save();

  if (postId) {
    updatedModel = await Post.findByIdAndUpdate(
      likeableId,
      { $push: { likes: like._id } }, // Increment the likes field by 1
      { new: true }
    );

    if (!updatedModel) {
      await PostLike.findOneAndDelete(like);
      return next(new AppError("Post not found!", 404));
    }
  } else if (postCommentId) {
    updatedModel = await PostComment.findByIdAndUpdate(
      likeableId,
      { $push: { likes: like._id } }, // Increment the likes field by 1
      { new: true }
    );

    if (!updatedModel) {
      await PostLike.findOneAndDelete(like);
      return next(new AppError("Post Comment not found!", 404));
    }
  }

  if (!updatedModel) {
    return next(new AppError("`${likeableModel} not found!`", 404));
  }

  return res.status(200).json({
    message: "Post Liked Successfully",
    like,
  });
});

// Get Like Count
const like_get = catchAsync(async (req, res, next) => {
  const { postId, postCommentId } = req.query;

  let postLike,
    likes = [];
  if (postId) {
    postLike = await Post.findById(postId);

    if (!postLike)
      return res.status(200).json({
        message: "Post does not have likes",
      });

    likes = await Promise.all(
      postLike.likes.map(async (id) => {
        const like = await PostLike.findById(id);
        return like;
      })
    );
  } else if (postCommentId) {
    postLike = await PostComment.findById(postCommentId);

    if (!postLike)
      return res.status(200).json({
        message: "Post Comment does not have likes",
      });

    likes = await Promise.all(
      postLike.likes.map(async (id) => {
        const like = await PostLike.findById(id);
        return like;
      })
    );
  } else return next(new AppError("Bad Request: Can't Identify Likeable", 400));

  if (!postLike)
    return next(new AppError("Post Like count could not be found", 404));

  return res.status(200).json({
    likeCount: postLike.likes.length,
    likes: likes,
  });
});

// Delete Like
const like_delete = catchAsync(async (req, res, next) => {
  const { userId, postId, postCommentId } = req.query;

  let likeableId, likeableModel;
  // Determine the likeable item and model based on request parameters
  if (postId) {
    likeableId = postId;
    likeableModel = "Post";
  } else if (postCommentId) {
    likeableId = postCommentId;
    likeableModel = "PostComment";
  } else {
    // Handle invalid request parameters
    return next(new AppError("Invalid request parameters", 400));
  }

  const existingLike = await PostLike.findOne({
    userId: userId,
    likeable: likeableId,
  });

  if (!existingLike) {
    return res.status(200).json({ message: "Post is not liked" });
  }

  await PostLike.findByIdAndDelete(existingLike._id);

  let updatedModel;

  if (postId) {
    updatedModel = await Post.findByIdAndUpdate(
      likeableId,
      { $pull: { likes: existingLike._id } }, // Decrement the likes field by 1
      { new: true }
    );
  } else if (postCommentId) {
    updatedModel = await PostComment.findByIdAndUpdate(
      likeableId,
      { $pull: { likes: existingLike._id } }, // Decrement the likes field by 1
      { new: true }
    );
  }

  if (!updatedModel) {
    return next(new AppError(`${likeableModel} not found!`, 404));
  }

  return res.status(200).json({
    message: "Unliked Post successfully",
  });
});

module.exports = {
  like_post,
  like_get,
  like_delete,
};
