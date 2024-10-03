const router = require("express").Router();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const JWT_KEY = process.env.JWT_KEY;
  const token = req.header("Authorization"); // get token from header

  if (!token) {
    // send back user if no token is provided
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  } else {
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
