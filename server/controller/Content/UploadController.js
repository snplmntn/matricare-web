const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

// Upload Profile Picture
const picture_post = catchAsync(async (req, res, next) => {
  const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const storageRef = ref(
    storage,
    `picture/${req.query.userId}/${req.file.originalname}-${uniqueSuffix}`
  );

  const metadata = {
    contentType: req.file.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file.buffer,
    metadata
  );

  const downloadURL = await getDownloadURL(snapshot.ref);

  return res.status(200).json({
    message: "Profile Picture Successfully Uploaded!",
    pictureLink: downloadURL,
  });
});

// Upload Belly Talk Picture
const belly_talk_picture_post = catchAsync(async (req, res, next) => {
  const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const storageRef = ref(
    storage,
    `bellyTalk/${req.query.userId}/${req.file.originalname}-${uniqueSuffix}`
  );

  const metadata = {
    contentType: req.file.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file.buffer,
    metadata
  );

  const downloadURL = await getDownloadURL(snapshot.ref);

  return res.status(200).json({
    message: "Profile Picture Successfully Uploaded!",
    pictureLink: downloadURL,
  });
});

// Upload Document
const document_post = catchAsync(async (req, res, next) => {
  const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const storageRef = ref(
    storage,
    `document/${req.query.userId}/${req.file.originalname}-${uniqueSuffix}`
  );

  const metadata = {
    contentType: req.file.mimetype,
  };

  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file.buffer,
    metadata
  );

  const downloadURL = await getDownloadURL(snapshot.ref);

  return res.status(200).json({
    message: "Document Successfully Uploaded!",
    documentLink: downloadURL,
  });
});

module.exports = {
  picture_post,
  belly_talk_picture_post,
  document_post,
};
