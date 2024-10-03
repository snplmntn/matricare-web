const AppError = require("./appError");

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) return next(new AppError("Role not identified", 400)); // if no role send a bad request error
    const result = allowedRoles.includes(req.role); // Check if req.role is in allowedRoles
    if (!result) return next(new AppError("Route Unauthorized", 403)); // if not in allowedRoles send a forbidden error
  };
};

module.exports = verifyRole;
