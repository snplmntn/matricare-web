const PostComment = require("../../models/Content/PostComment");
const Post = require("../../models/Content/Post");
const PostAnalytics = require("../../models/Content/PostAnalytics");
const Article = require("../../models/Content/Article");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");
const axios = require("axios");

const isCommentRelatedToPost = async (
  postContent,
  commentContent,
  authHeader
) => {
  try {
    const relevanceCheck = {
      postContent: postContent,
      commentContent: commentContent,
    };

    const response = await axios.post(
      `${process.env.OPEN_API_LINK}/relevance-check`,
      relevanceCheck,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;
    return result.isRelevant === true;
  } catch (error) {
    return true;
  }
};

const updateArticlesForEngagement = async (postCategories, authHeader) => {
  try {
    await Promise.all(
      postCategories.map(async (e) => {
        const postsInCategory = await Post.find({ category: e });

        let engagement = 0;
        let postContents = [];
        let postComments = [];
        for (const post of postsInCategory) {
          const comments = await PostComment.find({
            postId: post._id,
          }).populate("userId");
          const verifiedComments = comments.filter(
            (c) => c.userId && c.userId.verified
          );

          engagement += verifiedComments.length;
          postContents.push(post.content);
          postComments.push(verifiedComments.map((c) => c.content));
        }

        let summary = "";
        let title = "";
        try {
          const toSummarize = {
            category: e,
            posts: postsInCategory.map((post, idx) => ({
              content: postContents[idx],
              comments: postComments[idx],
            })),
          };

          const response = await axios.post(
            `${process.env.OPEN_API_LINK}/article`,
            toSummarize,
            {
              headers: {
                Authorization: authHeader,
                "Content-Type": "application/json ",
              },
            }
          );

          summary = response.data.summary;
          title = summary.split("\n")[0].replace(/^#+\s*/, "");
          summary = summary.split("\n").slice(1).join("\n");

          let article = await Article.findOne({
            category: e,
            author: "Dra. Donna Jill A. Tungol",
          });
          if (article) {
            const convertMarkdownToHTML = async (markdown) => {
              const { remark } = await import("remark");
              const { default: remarkHtml } = await import("remark-html");
              const html = await remark().use(remarkHtml).process(markdown);
              return html.toString();
            };

            const convertedContent = await convertMarkdownToHTML(summary);
            const finalContent = convertedContent
              .split("\n")
              .slice(1)
              .join("\n");

            article.engagement = engagement;
            article.title = title;
            article.fullTitle = title;
            article.content = JSON.stringify(finalContent);
            article.author = "Dra. Donna Jill A. Tungol";
            article.status = "Approved";
            await article.save();
          }
        } catch (err) {
          return;
        }
      })
    );
  } catch (error) {}
};

const comment_post = catchAsync(async (req, res, next) => {
  const { profilePicture, userId, fullName, postId, content } = req.body;

  if (!postId) return next(new AppError("Post not found", 404));

  const comment = new PostComment({
    profilePicture,
    userId,
    fullName,
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

  const commentPopulated = await PostComment.findById(comment._id)
    .populate("userId")
    .populate("postId");

  if (commentPopulated.userId.verified) {
    const isRelevant = await isCommentRelatedToPost(
      commentPopulated.postId.content,
      commentPopulated.content,
      req.headers.authorization
    );

    if (isRelevant) {
      commentPopulated.postId.category.map(
        catchAsync(async (e) => {
          const category = await PostAnalytics.findOne({ category: e });

          if (category) {
            if (category.posts.includes(commentPopulated.postId._id)) {
              await PostAnalytics.findByIdAndUpdate(
                category._id,
                {
                  $push: {
                    comments: comment._id,
                  },
                },
                { new: true }
              );
            } else {
              await PostAnalytics.findByIdAndUpdate(
                category._id,
                {
                  $push: {
                    posts: commentPopulated.postId._id,
                    comments: comment._id,
                  },
                },
                { new: true }
              );
            }
          } else {
            await PostAnalytics.create({
              category: e,
              posts: commentPopulated.postId._id,
              comments: commentPopulated.postId.comments,
            });
          }
        })
      );

      setImmediate(() => {
        updateArticlesForEngagement(
          commentPopulated.postId.category,
          req.headers.authorization
        );
      });
    }
  }

  return res.status(200).json({
    message: "Post commented Successfully",
    comment: commentPopulated,
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
        const comment = await PostComment.findById(id).populate("userId");
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
