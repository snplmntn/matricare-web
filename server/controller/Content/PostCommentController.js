const PostComment = require("../../models/Content/PostComment");
const Post = require("../../models/Content/Post");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const comment_post = catchAsync(async (req, res, next) => {
  const { profilePicture, userId, fullname, postId, content } = req.body;

  if (!postId) return next(new AppError("Post not found", 404));

  const comment = new PostComment({
    profilePicture,
    userId,
    fullname,
    postId,
    content,
  });

  await comment.save();

  const updatedModel = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment._id } },
    { new: true }
  );

  if (!updatedModel) {
    await PostComment.findOneAndDelete(comment);
    return next(new AppError("Post not found", 404));
  }

  return res.status(200).json({
    message: "Post commented Successfully",
    comment,
  });
});

const comment_get = catchAsync(async (req, res, next) => {
  const { postId } = req.query;

  if (!postId)
    return next(
      new AppError(
        "Bad Request: Could not identify if Post or Post Comment",
        400
      )
    );

  let comments = [];
  if (postId) {
    const post = await Post.findById(postId);

    if (!post)
      return res.status(200).json({
        message: "Post does not have comments",
      });

    comments = await Promise.all(
      post.comments.map(async (id) => {
        const comment = await PostComment.findById(id);
        return comment;
      })
    );
  }

  return res.status(200).json({
    comments,
  });
});

const comment_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  let comment;
  if (id) {
    comment = await PostComment.findById(id);
    if (!comment) return next(new AppError("Post Comment not found", 404));

    if (comment.postId) {
      await Post.findByIdAndUpdate(
        comment.postId,
        { $pull: { comments: comment._id } },
        { new: true }
      );
    }
  } else {
    return next(
      new AppError(
        "Bad Request: Could not identify if Post Comment or Post Reply",
        400
      )
    );
  }

  await comment.deleteOne();

  return res.status(200).json({
    message: "Comment deleted successfully",
    comment,
  });
});

module.exports = {
  comment_post,
  comment_get,
  comment_delete,
};