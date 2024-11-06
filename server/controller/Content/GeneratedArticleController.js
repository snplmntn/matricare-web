const GeneratedArticle = require("../../models/Content/GeneratedArticle");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Get Article by Id or Index Articles
const article_get = catchAsync(async (req, res, next) => {
  const { category } = req.query;

  if (!category) return next(new AppError("Category not on Query", 400));

  const article = await GeneratedArticle.findOne({ category });

  if (!article)
    return res.status(200).json({ message: "Generated article not found" });

  return res.status(200).json({ article });
});

// Create Article
const article_post = catchAsync(async (req, res, next) => {
  const newArticle = new GeneratedArticle(req.body);

  await newArticle.save();
  return res
    .status(200)
    .json({ message: "Article Successfully Created", newArticle });
});

// Update Article
const article_put = catchAsync(async (req, res, next) => {
  const { category } = req.query;

  if (!category) return next(new AppError("Article identifier not found", 400));

  const article = await GeneratedArticle.findOne({ category: category });

  const updatedArticle = await GeneratedArticle.findByIdAndUpdate(
    article._id,
    { $set: req.body },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "Article Updated Successfully", updatedArticle });
});

module.exports = {
  article_get,
  article_post,
  article_put,
};
