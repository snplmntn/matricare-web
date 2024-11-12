const Article = require("../../models/Content/Article");
const Notification = require("../../models/User/Notification");
const User = require("../../models/User/User");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Get Article by Id or Index Articles
const article_get = catchAsync(async (req, res, next) => {
  const { id, status } = req.query;

  let article,
    relatedArticles = [];
  if (id) {
    article = await Article.findOne({
      _id: req.query.id,
    });

    if (article && article.category) {
      relatedArticles = await Article.find({
        category: article.category,
        _id: { $ne: article._id },
      }).limit(3); // Limit to 5 related articles
    }
  } else if (status) {
    article = await Article.find({
      status: req.query.status,
    });
  } else {
    article = await Article.find();
  }

  if (!article) return next(new AppError("Article not found", 404));

  return res.status(200).json({ article, relatedArticles });
});

// Create Article
const article_post = catchAsync(async (req, res, next) => {
  const newArticle = new Article(req.body);

  await newArticle.save();

  if (newArticle.status === "Approved") {
    const users = await User.find({}, "_id");
    const recipientUserIds = users.map((user) => user._id);
    const newNotification = await Notification.create({
      senderName: `MatriCare`,
      message: `New Article has been uploaded - ${newArticle.title}. Check It Out!`,
      recipientUserId: recipientUserIds,
    });

    await newNotification.save();
  }

  return res
    .status(200)
    .json({ message: "Article Successfully Created", newArticle });
});

// Update Article
const article_put = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Article identifier not found", 400));

  const article = await Article.findById(req.query.id);

  if (req.body.content && article.status === "Revision")
    req.body.status = "Draft";

  const updatedArticle = await Article.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedArticle) {
    return next(new AppError("Article not found", 404));
  }

  if (updatedArticle.status === "Approved") {
    const users = await User.find({}, "_id");
    const recipientUserIds = users.map((user) => user._id);
    const newNotification = await Notification.create({
      senderName: `MatriCare`,
      message: `New Article has been uploaded - ${updatedArticle.title}. Check It Out!`,
      recipientUserId: recipientUserIds,
    });

    await newNotification.save();
  } else if (updatedArticle.status === "Revision") {
    await Notification.create({
      senderName: `MatriCare`,
      message: `Unfortunately, the article "${updatedArticle.title}" that you submitted is rejected. Revisions are needed.`,
      recipientUserId: updatedArticle.userId,
    });
  }
  return res
    .status(200)
    .json({ message: "Article Updated Successfully", updatedArticle });
});

// Delete Article
const article_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Article identifier not found", 400));

  const deletedArticle = await Article.findByIdAndDelete(req.query.id);

  if (!deletedArticle) return next(new AppError("Article not found", 404));
  return res
    .status(200)
    .json({ message: "Article Successfully Deleted", deletedArticle });
});

module.exports = {
  article_get,
  article_post,
  article_put,
  article_delete,
};
