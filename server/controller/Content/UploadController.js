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

// Upload Belly Talk Pictures (Multiple)
const belly_talk_picture_post = catchAsync(async (req, res, next) => {
  const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

  // Prepare an array to store the download URLs for the multiple files
  const downloadURLs = [];

  // Loop through each file in req.files (since you're using upload.array)
  for (const file of req.files) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const storageRef = ref(
      storage,
      `bellyTalk/${req.query.userId}/${file.originalname}-${uniqueSuffix}`
    );

    const metadata = {
      contentType: file.mimetype,
    };

    // Upload each file
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    // Get the download URL for each uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Store the download URL in the array
    downloadURLs.push(downloadURL);
  }

  return res.status(200).json({
    message: "Pictures Successfully Uploaded!",
    pictureLink: downloadURLs, // Return all the download URLs
  });
});

// Upload Article Picture
const article_picture_post = catchAsync(async (req, res, next) => {
  const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const storageRef = ref(
    storage,
    `article/${req.query.userId}/${req.file.originalname}-${uniqueSuffix}`
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
    message: "Picture Successfully Uploaded!",
    pictureLink: downloadURL,
  });
});

// Upload Profile Picture
const prcId_post = catchAsync(async (req, res, next) => {
  const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

  // Prepare an array to store the download URLs for the multiple files
  const downloadURLs = [];

  // Loop through each file in req.files (since you're using upload.array)
  for (const file of req.files) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const storageRef = ref(
      storage,
      `prcId/${req.query.userId}/${file.originalname}-${uniqueSuffix}`
    );

    const metadata = {
      contentType: file.mimetype,
    };

    // Upload each file
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    // Get the download URL for each uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Store the download URL in the array
    downloadURLs.push(downloadURL);
  }

  return res.status(200).json({
    message: "Pictures Successfully Uploaded!",
    pictureLink: downloadURLs, // Return all the download URLs
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

// Upload Appointment Document
const appointment_post = catchAsync(async (req, res, next) => {
  const firebaseConfig = {
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  };

  initializeApp(firebaseConfig);
  const storage = getStorage();

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const storageRef = ref(
    storage,
    `appointment/${req.query.userId}/${req.file.originalname}-${uniqueSuffix}`
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
  article_picture_post,
  prcId_post,
  document_post,
  appointment_post,
};
