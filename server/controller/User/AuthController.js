const User = require("../../models/User/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../../Utilities/catchAsync");
const AppError = require("../../Utilities/appError");

// Login route
const user_login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  console.log(`Attempting login for: ${username}`);

  const user = await User.findOne({
    $or: [{ email: username }, { username }],
  });
  console.log("Found user:", user);

  if (!user) {
    console.log("User not found");
    return next(new AppError("User not found", 404));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(`Password match result: ${isMatch}`);

  if (!isMatch) {
    console.log("Password does not match");
    return next(new AppError("Invalid credentials", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
  return res.json({
    user,
    token,
  });
});

// Signup route
const user_signup = catchAsync(async (req, res, next) => {
  const { fullName, email, username, password, phoneNumber } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("User already exists", 400));
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
  });

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  return res.status(201).json({
    user,
    token,
  });
});

module.exports = {
  user_login,
  user_signup,
};
