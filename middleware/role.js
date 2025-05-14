const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user; 

      if (!user || !user.role) {
        return res.status(403).json({
          success: false,
          message: 'User role is not available.',
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to access this resource.',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error in role middleware.',
      });
    }
  };
};

module.exports = { roleMiddleware };
