const Article = require("../../models/Content/Article");
const Notification = require("../../models/User/Notification");
const User = require("../../models/User/User");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Get Article by Id or Index Articles
const article_get = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  let article;
  if (id) {
    article = await Article.findOne({
      _id: req.query.id,
    });
  } else {
    article = await Article.find();
  }

  if (!article) return next(new AppError("Article not found", 404));

  return res.status(200).json(article);
});

// Create Article
const article_post = catchAsync(async (req, res, next) => {
  const articleCount = await Article.find().countDocuments();
  const yearToday = new Date().getFullYear();
  req.body.orderNumber = `${yearToday} - ${articleCount + 1}`;

  console.log(req.body.orderNumber);

  const newArticle = new Article(req.body);

  await newArticle.save();
  return res
    .status(200)
    .json({ message: "Article Successfully Created", newArticle });
});

// Update Article
const article_put = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Article identifier not found", 400));

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
    const newNotification = new Notification({
      senderName: `MatriCare`,
      message: `New Article has been uploaded - ${updatedArticle.title}. Check It Out!`,
      recipientUserId: recipientUserIds,
    });

    await newNotification.save();
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
