const User = require("../../models/User/User");
const Patient = require("../../models/User/Patient");
const InvalidToken = require("../../models/InvalidToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../../Utilities/catchAsync");
const AppError = require("../../Utilities/appError");

// Login route
const user_login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: username }, { username }],
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  await User.findByIdAndUpdate(user._id, { logInTime: Date.now() });

  const token = jwt.sign({ user: user }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  return res.json({
    user,
    token,
  });
});

// Signup route
const user_signup = catchAsync(async (req, res, next) => {
  const {
    fullName,
    email,
    username,
    password,
    phoneNumber,
    role,
    pregnancyStartDate,
    babyName,
  } = req.body;

  // Check if user already exists
  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return next(new AppError("Email already used.", 400));
  }

  const userName = await User.findOne({ username });

  if (userName) {
    return next(new AppError("Username already used.", 400));
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = await User.create({
    fullName,
    email,
    username,
    password: hashedPassword, // Save the hashed password
    phoneNumber,
    role,
    pregnancyStartDate,
    babyName,
  });

  if (user.role === "Patient") {
    const userCount = await Patient.find().countDocuments();

    await Patient.create({
      fullName,
      email,
      phoneNumber,
      userId: user._id,
      seq: userCount + 1,
    });
  }

  const token = jwt.sign({ user: user }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  return res.status(200).json({
    user,
    token,
  });
});

// Logout route
const user_logout = catchAsync(async (req, res, next) => {
  const token = req.header("Authorization");

  const invalidToken = new InvalidToken({
    token: token,
  });

  await invalidToken.save();

  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const userId = decoded.user._id;
  await User.findByIdAndUpdate(userId, { logOutTime: Date.now() });

  return res
    .status(200)
    .json({ message: "Logged Out Successfully", invalidToken });
});

const user_find = catchAsync(async (req, res, next) => {
  //Email or Username
  const { account } = req.query;
  // Check if the user exists by email or username
  const user = await User.findOne({
    $or: [{ email: account }, { username: account }],
  });

  if (!user) return next(new AppError("User not found", 404));

  return res
    .status(200)
    .json({ message: "User Fetched", userId: user._id, email: user.email });
});

const user_recover = catchAsync(async (req, res, next) => {
  const KEY = process.env.JWT_KEY;
  const { userId } = req.query;
  const { password } = req.body;

  if (!password) return next(new AppError("No Password Provided", 418));

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );

  if (!user) return next(new AppError("User not found", 404));

  const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const payload = { user: JSON.stringify(user), exp: expiration };
  const token = jwt.sign(payload, KEY);
  const cookieOptions = {
    expire: new Date(
      Date.now() +
        process.env.JWT_TEMP_COOKIE_EXPIRES_IN * 30 * 24 * 60 * 60 * 1000
    ), // 30 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("token", token, cookieOptions);
  res.cookie("userId", user._id, cookieOptions);

  return res.status(200).json({ message: "Account Successfully Recovered" });
});

module.exports = {
  user_login,
  user_signup,
  user_logout,
  user_find,
  user_recover,
};
