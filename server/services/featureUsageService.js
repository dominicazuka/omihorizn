const PremiumFeatureUsage = require('../models/PremiumFeatureUsage');
const Subscription = require('../models/Subscription');
const { AppError } = require('../middleware/errorHandler');

/**
 * Check whether user can use a feature and increment the counter.
 * Throws AppError(402) if limit reached.
 */
const checkAndIncrement = async (userId, featureKey) => {
  // look up subscription and usage record atomically
  const sub = await Subscription.findOne({ userId });
  if (!sub) throw new AppError('No active subscription', 403);

  // find feature usage by key (featureKey stored in premium feature document, but here we assume mapping)
  const usage = await PremiumFeatureUsage.findOne({ userId, 'featureKey': featureKey });
  if (!usage) throw new AppError('Feature not enabled for user', 403);

  // check limit (null means unlimited)
  if (usage.usageLimit != null && usage.usageCount >= usage.usageLimit) {
    const err = new AppError('Feature usage limit reached', 402);
    err.upgradeHint = 'Please upgrade your subscription for more usage';
    throw err;
  }

  usage.usageCount = (usage.usageCount || 0) + 1;
  usage.lastUsedAt = new Date();
  await usage.save();
  return usage;
};

/**
 * Retrieve usage history rows (paginated)
 */
const getUsageHistory = async (userId, feature, page = 1, pageSize = 20) => {
  const query = { userId };
  if (feature) query.featureKey = feature;
  const skip = (page - 1) * pageSize;
  const docs = await PremiumFeatureUsage.find(query)
    .sort({ lastUsedAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean();
  return docs;
};

module.exports = { checkAndIncrement, getUsageHistory };
