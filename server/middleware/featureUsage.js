const { checkAndIncrement } = require('../services/featureUsageService');

// middleware factory: provide feature key to check
const requireFeature = (featureKey) => async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
    await checkAndIncrement(userId, featureKey);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireFeature };
