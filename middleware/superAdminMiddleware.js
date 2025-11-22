/**
 * SuperAdmin Only Middleware
 * Allows access only if user has role "SuperAdmin"
 */
export const superAdminOnly = (req, res, next) => {
  const role = req.user?.role?.name;

  if (!role) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Role not found",
    });
  }

  if (role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied: Only SuperAdmin can perform this action",
    });
  }

  next();
};

/**
 * Admin or SuperAdmin Middleware
 * Allows access if user is SuperAdmin OR has Admin privileges
 */
export const adminOrSuperAdmin = (req, res, next) => {
  const role = req.user?.role?.name;

  if (!role) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Role not found",
    });
  }

  if (role === "SuperAdmin" || role === "Admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied",
  });
};
