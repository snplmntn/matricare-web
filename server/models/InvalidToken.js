const mongoose = require("mongoose");

const InvalidTokenSchema = new mongoose.Schema({
  token: String,
});

module.exports = mongoose.model("InvalidToken", InvalidTokenSchema);
