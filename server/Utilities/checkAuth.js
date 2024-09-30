const router = require("express").Router();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const JWT_KEY = process.env.JWT_KEY;
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  } else {
    try {
      jwt.verify(token, JWT_KEY);
      next();
    } catch (err) {
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
