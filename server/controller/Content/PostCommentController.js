const PostComment = require("../../models/Content/PostComment");
const Post = require("../../models/Content/Post");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const commentPost = catchAsync(async (req, res, next) => {
  const {
    profilePicture,
    userId,
    fullname,
    username,
    postId,
    postCommentId,
    content,
    isAnonymous,
  } = req.body;
  let comment;

  if (postId) {
    comment = new PostComment({
      profilePicture,
      userId,
      username,
      fullname,
      postId,
      content,
      isAnonymous,
    });
  } else if (postCommentId) {
    comment = new PostComment({
      profilePicture,
      userId,
      username,
      fullname,
      postCommentId,
      content,
      isAnonymous,
    });
  } else {
    return res.status(204).json({ message: "Comment Unidentified" });
  }

  await comment.save();

  if (postId) {
    updatedModel = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment._id } },
      { new: true }
    );
  } else if (postCommentId) {
    updatedModel = await PostComment.findByIdAndUpdate(
      postCommentId,
      { $push: { comments: comment._id } },
      { new: true }
    );
  }

  return res.status(200).json({
    message: "Post commented Successfully",
    comment,
  });
});

const getPostComments = catchAsync(async (req, res, next) => {
  const { postId, postCommentId } = req.query;

  if (!postId && !postCommentId)
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
  } else if (postCommentId) {
    const postComment = await PostComment.findById(postCommentId);

    if (!postComment)
      return res.status(200).json({
        message: "Comment does not have replies",
      });

    comments = await Promise.all(
      postComment.comments.map(async (id) => {
        const comment = await PostComment.findById(id);
        return comment;
      })
    );
  }

  return res.status(200).json({
    comments,
  });
});

const getPostCommentCount = catchAsync(async (req, res, next) => {
  const { postId, postCommentId } = req.query;

  if (!postId && !postCommentId)
    return next(
      new AppError(
        "Bad Request: Could not identify if Post or Post Comment",
        400
      )
    );

  let commentCount;

  if (postId) {
    const post = await Post.findById(postId);
    commentCount = post.comments.length;
  } else if (postCommentId) {
    const postComment = await PostComment.findById(postCommentId);
    commentCount = postComment.comments.length;
  }

  return res.status(200).json({
    commentCount,
  });
});

const deleteComment = catchAsync(async (req, res, next) => {
  const { postCommentId } = req.query;

  let comment;
  if (postCommentId) {
    comment = await PostComment.findById(postCommentId);
    if (!comment) return next(new AppError("Post Comment not found", 404));

    if (comment.postId) {
      await Post.findByIdAndUpdate(
        comment.postId,
        { $pull: { comments: comment._id } },
        { new: true }
      );
    } else {
      await PostComment.findByIdAndUpdate(
        comment.postCommentId,
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
  });
});

module.exports = {
  commentPost,
  getPostComments,
  getPostCommentCount,
  deleteComment,
};
