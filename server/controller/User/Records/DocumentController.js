const Document = require("../../../models/User/Document");
const Notification = require("../../../models/User/Notification");
const User = require("../../../models/User/User");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

// Get Document by Id
const document_get = catchAsync(async (req, res, next) => {
  const { id, recent } = req.query;

  let document;
  if (id) {
    document = await Document.findOne({
      _id: id,
    });

    if (!document) return next(new AppError("Document not found", 404));
  } else if (recent) {
    document = await Document.find().sort({ createdAt: -1 }).limit(10);

    if (!document || document.length === 0) {
      return next(new AppError("No documents found", 404));
    }
  } else {
    return next(new AppError("Document identifier not found", 400));
  }

  return res.status(200).json(document);
});

// Get Document by UserId
const document_user_get = catchAsync(async (req, res, next) => {
  const document = await Document.find({
    userId: req.query.userId,
  });

  if (!document) return next(new AppError("Document not found", 404));

  return res.status(200).json(document);
});

// Create Document
const document_post = catchAsync(async (req, res, next) => {
  const newDocument = new Document(req.body);

  await newDocument.save();

  const userUploader = await User.findById(req.body.userId);
  const users = await User.find({ role: "Obgyne" });
  const recipientUserIds = users.map((user) => user._id);
  await Notification.create({
    senderName: "MatriCare",
    message: `Patient: ${userUploader.fullName} uploaded a new Document.`,
    recipientUserId: recipientUserIds,
  });

  return res
    .status(200)
    .json({ message: "Document Successfully Created", newDocument });
});

// Update Document
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

// Delete Document
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
