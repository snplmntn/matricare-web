const Document = require("../../../models/User/Document");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const document_get = catchAsync(async (req, res, next) => {
  const document = await Document.findOne({
    _id: req.query.id,
  });

  if (!document) return next(new AppError("Document not found", 404));

  return res.status(200).json(document);
});

const document_user_get = catchAsync(async (req, res, next) => {
  const document = await Document.find({
    userId: req.query.userId,
  });

  if (!document) return next(new AppError("Document not found", 404));

  return res.status(200).json(document);
});

const document_post = catchAsync(async (req, res, next) => {
  const newDocument = new Document(req.body);

  await newDocument.save();
  return res
    .status(200)
    .json({ message: "Document Successfully Created", newDocument });
});

const document_put = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Document identifier not found", 400));

  const updatedDocument = await Document.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedDocument) {
    return next(new AppError("Document not found", 404));
  }
  return res
    .status(200)
    .json({ message: "Document Updated Successfully", updatedDocument });
});

const document_delete = catchAsync(async (req, res, next) => {
  if (!req.query.id)
    return next(new AppError("Document identifier not found", 400));

  const deletedDocument = await Document.findByIdAndDelete(req.query.id);

  if (!deletedDocument) return next(new AppError("Document not found", 404));
  return res
    .status(200)
    .json({ message: "Document Successfully Deleted", deletedDocument });
});

module.exports = {
  document_get,
  document_post,
  document_user_get,
  document_put,
  document_delete,
};
