const AppError = require("./appError");

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) return next(new AppError("Role not identified", 400));
    const result = allowedRoles.includes(req.role);
    if (!result) return next(new AppError("Route Unauthorized", 403));
  };
};

module.exports = verifyRole;
