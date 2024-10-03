const jwt = require("jsonwebtoken");
const InvalidToken = require("../models/InvalidToken");
const AppError = require("../Utilities/appError");

const verifyToken = async (req, res, next) => {
  const JWT_KEY = process.env.JWT_KEY;
  const token = req.header("Authorization"); // get token from header

  if (!token) {
    // send back user if no token is provided
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  } else {
    const isInvalid = await InvalidToken.findOne({ token: token });
    if (isInvalid) {
      return next(new AppError("Access denied. Invalid Token", 403));
    }
    // check token if it is valid
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      req.role = decoded.user.role;
      req.userId = decoded.user._id;
      next();
    } catch (err) {
      // token expired or invalid
      if (err.name === "TokenExpiredError")
        return res
          .status(401)
          .json({ message: "Access denied. Token Expired." });
      else
        return res
          .status(403)
          .json({ message: "Access denied. Invalid Token." });
    }
  }
};

module.exports = verifyToken;
