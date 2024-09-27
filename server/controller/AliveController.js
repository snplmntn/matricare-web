const catchAsync = require("../Utilities/catchAsync");

const alive = catchAsync(async (req, res, next) => {
  console.log("Server is still alive...");
  return res.status(200).json({ message: "Server is still alive..." });
});

module.exports = {
  alive,
};
