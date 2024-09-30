const AppError = require("./appError");

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return next(new AppError("Role not identified", 400));
    const rolesArray = [...allowedRoles];
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return next(new AppError("Route Unauthorized", 403));
  };
};

module.exports = verifyRole;
