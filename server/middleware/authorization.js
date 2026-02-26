/**
 * Role-Based Access Control Middleware
 * Checks user role and permissions
 */

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action',
      });
    }

    next();
  };
};

const roleVerificationEndpoint = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    res.json({
      success: true,
      role: req.user.role,
      userId: req.user._id,
      subscriptionTier: req.user.subscriptionTier,
      timestamp: Date.now(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify role',
    });
  }
};

module.exports = {
  authorize,
  roleVerificationEndpoint,
};
