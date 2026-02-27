const subscriptionService = require('../services/subscriptionService');

const create = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const { tier, billingCycle, amount } = req.body;
    const subscription = await subscriptionService.createSubscription({ userId, tier, billingCycle, amount });
    res.json({ success: true, subscription });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const subscription = await subscriptionService.getUserSubscriptionWithFeatures(userId);
    res.json({ success: true, subscription });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const updates = req.body;
    const subscription = await subscriptionService.updateSubscription(subscriptionId, updates);
    res.json({ success: true, subscription, proration: subscription.proration || null });
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const { reason } = req.body;
    const subscription = await subscriptionService.cancelSubscription(subscriptionId, reason);
    res.json({ success: true, subscription });
  } catch (err) {
    next(err);
  }
};

const history = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const history = await subscriptionService.getSubscriptionHistory(userId);
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

const usageHistory = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    const { feature, page, pageSize, startDate, endDate } = req.query;
    const history = await subscriptionService.getUsageHistory(userId, feature, page, pageSize, startDate, endDate);
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  me,
  update,
  cancel,
  history,
  usageHistory,
};