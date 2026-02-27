const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const PremiumFeatureUsage = require('../models/PremiumFeatureUsage');
const PremiumFeature = require('../models/PremiumFeature');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/email');

// import Flutterwave client for recurring subscription operations
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

/**
 * Get features available for a specific tier from database
 * Dynamically fetches from PremiumFeature model instead of static mapping
 */
const getFeaturesForTier = async (tier) => {
  if (!['free', 'premium', 'professional'].includes(tier)) {
    throw new Error('Invalid subscription tier');
  }

  const tierAccessField = tier === 'free' ? 'freeAccess' : `${tier}Access`;
  const limitField = tier === 'free' ? 'freeLimit' : `${tier}Limit`;

  const features = await PremiumFeature.find(
    { [tierAccessField]: true },
    { _id: 1, name: 1, [limitField]: 1 }
  ).lean();

  return features.map(f => ({
    featureId: f._id,
    featureKey: f.name,
    usageLimit: f[limitField] || null,
  }));
};

const createUsageRecords = async (userId, tier) => {
  // Dynamically get features for this tier
  const features = await getFeaturesForTier(tier);

  const records = features.map(f => ({
    userId,
    featureId: f.featureId,
    featureKey: f.featureKey,
    usageCount: 0,
    usageLimit: f.usageLimit,
    resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }));

  if (records.length === 0) return [];
  return PremiumFeatureUsage.insertMany(records);
};


const createSubscription = async ({ userId, tier = 'free', billingCycle = 'monthly', amount = 0 }) => {
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + (billingCycle === 'monthly' ? 1 : 12));

  const sub = await Subscription.create({
    userId,
    tier: tier === 'basic' ? 'premium' : tier,
    billingCycle,
    amount,
    renewalDate,
    status: 'active',
  });

  await createUsageRecords(userId, sub.tier);

  // Send subscription confirmation email
  const user = await User.findById(userId).select('email firstName');
  if (user) {
    const emailData = emailTemplates.subscriptionConfirmationEmail(
      user.firstName || 'User',
      sub.tier,
      sub.billingCycle,
      (sub.amount / 100).toFixed(2)
    );
    await sendEmail(user.email, `${sub.tier.charAt(0).toUpperCase() + sub.tier.slice(1)} Plan Activated - OmiHorizn`, emailData);
  }

  return sub;
};

const getUserSubscription = async (userId) => {
  return Subscription.findOne({ userId }).populate('lastPaymentId').lean();
};

/**
 * Get user subscription with full feature list and usage data
 * Returns enriched subscription object similar to previous controller implementation
 */
const getUserSubscriptionWithFeatures = async (userId) => {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return null;

  const tier = subscription.tier || 'free';
  const tierAccessField = tier === 'free' ? 'freeAccess' : `${tier}Access`;
  const limitField = tier === 'free' ? 'freeLimit' : `${tier}Limit`;

  const features = await PremiumFeature.find(
    { [tierAccessField]: true },
    { name: 1, description: 1, category: 1, freeLimit: 1, premiumLimit: 1, professionalLimit: 1 }
  ).lean();

  const featureUsage = await PremiumFeatureUsage.find(
    { userId, featureId: { $in: features.map(f => f._id) } },
    { featureId: 1, usageCount: 1, usageLimit: 1, resetDate: 1, lastUsedAt: 1 }
  ).lean();

  const usageMap = {};
  featureUsage.forEach(usage => {
    usageMap[usage.featureId.toString()] = usage;
  });

  const featuresWithUsage = features.map(feature => ({
    ...feature,
    usage: usageMap[feature._id.toString()] || {
      usageCount: 0,
      usageLimit: feature[limitField],
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      daysUntilReset: Math.ceil((new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) - new Date()) / (1000 * 60 * 60 * 24)),
    },
  }));

  subscription.features = featuresWithUsage;
  subscription.nextResetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  subscription.daysUntilReset = Math.ceil((subscription.nextResetDate - new Date()) / (1000 * 60 * 60 * 24));

  return subscription;
};

const getSubscriptionHistory = async (userId) => {
  const history = await Subscription.find({ userId }).sort({ createdAt: -1 }).lean();
  // attach total amount paid for each subscription object
  const enhanced = await Promise.all(history.map(async (sub) => {
    const payments = await Payment.find({ subscriptionId: sub._id, status: 'completed' }).select('amount').lean();
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    return { ...sub, totalPaid };
  }));
  return enhanced;
};

const updateSubscription = async (subscriptionId, updates = {}) => {
  if (updates.tier && updates.tier === 'basic') updates.tier = 'premium';
  const sub = await Subscription.findById(subscriptionId);
  if (!sub) return null;

  let proration = null;
  if (updates.tier && updates.tier !== sub.tier) {
    // calculate simple prorated amount based on days remaining on current cycle
    const now = new Date();
    const msRemaining = sub.renewalDate - now;
    const daysRemaining = msRemaining / (1000 * 60 * 60 * 24);
    const oldAmt = sub.amount || 0;
    const newAmt = updates.amount != null ? updates.amount : oldAmt;
    proration = ((newAmt - oldAmt) * (daysRemaining / 30));
    // keep proration value on object for controller to return if needed
    updates.proration = proration;
  }

  Object.assign(sub, updates);

  // If there is a corresponding Flutterwave subscription, update it too
  if (sub.flutterwaveSubscriptionId) {
    try {
      const payload = {};
      if (updates.billingCycle) {
        payload.interval = updates.billingCycle === 'annual' ? 'yearly' : 'monthly';
      }
      if (updates.amount != null) {
        payload.amount = (updates.amount / 100).toFixed(2);
      }
      if (Object.keys(payload).length > 0) {
        await flw.Subscription.update({
          id: sub.flutterwaveSubscriptionId,
          ...payload,
        });
      }
    } catch (err) {
      console.error('Failed to update Flutterwave subscription:', err.message || err);
    }
  }

  await sub.save();

  // reset feature usage when tier changes (upgrade/downgrade)
  if (updates.tier) {
    await PremiumFeatureUsage.updateMany(
      { userId: sub.userId },
      { $set: { usageCount: 0, resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }
    );
  }

  return sub;
};

const cancelSubscription = async (subscriptionId, reason) => {
  const sub = await Subscription.findByIdAndUpdate(
    subscriptionId,
    { status: 'cancelled', cancelledAt: new Date(), cancellationReason: reason, autoRenew: false },
    { new: true }
  ).populate('userId');

  // if there is an active flutterwave subscription created earlier, cancel it
  if (sub && sub.flutterwaveSubscriptionId) {
    try {
      await flw.Subscription.disable({ id: sub.flutterwaveSubscriptionId });
    } catch (err) {
      // log but do not block cancellation
      console.error('Failed to cancel Flutterwave subscription:', err.message || err);
    }
  }

  // Send cancellation email
  if (sub && sub.userId) {
    const user = sub.userId;
    const emailData = emailTemplates.subscriptionCancelledEmail(
      user.firstName || 'User',
      reason
    );
    await sendEmail(user.email, 'Subscription Cancelled - OmiHorizn', emailData);
  }

  return sub;
};

// usage history delegate
const { getUsageHistory: _getUsageHistory } = require('./featureUsageService');
const getUsageHistory = async (userId, feature, page, pageSize) => {
  return _getUsageHistory(userId, feature, page, pageSize);
};

const resetAllUsage = async () => {
  // only reset for active subscriptions
  const activeUsers = await Subscription.find({ status: 'active' }).distinct('userId');
  if (activeUsers.length) {
    await PremiumFeatureUsage.updateMany(
      { userId: { $in: activeUsers } },
      { $set: { usageCount: 0, resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }
    );
  }
  return activeUsers.length;
};

/**
 * Send renewal reminder emails for subscriptions approaching their renewal date
 * 7 days and 1 day prior. Marks flags on the subscription to avoid repeats.
 */
const sendRenewalReminders = async () => {
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in1 = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

  // fetch subscriptions within the window that haven't been reminded
  const subs7 = await Subscription.find({
    status: 'active',
    autoRenew: true,
    renewalDate: { $lte: in7, $gt: now },
    reminder7Sent: false,
  }).populate('userId');

  for (const sub of subs7) {
    if (sub.userId && sub.userId.email) {
      const emailData = emailTemplates.renewalReminderEmail(
        sub.userId.firstName || 'User',
        sub.tier,
        sub.renewalDate,
        7
      );
      await sendEmail(sub.userId.email, 'Subscription Renewal Reminder', emailData);
    }
    sub.reminder7Sent = true;
    await sub.save();
  }

  const subs1 = await Subscription.find({
    status: 'active',
    autoRenew: true,
    renewalDate: { $lte: in1, $gt: now },
    reminder1Sent: false,
  }).populate('userId');

  for (const sub of subs1) {
    if (sub.userId && sub.userId.email) {
      const emailData = emailTemplates.renewalReminderEmail(
        sub.userId.firstName || 'User',
        sub.tier,
        sub.renewalDate,
        1
      );
      await sendEmail(sub.userId.email, 'Subscription Renewal Reminder', emailData);
    }
    sub.reminder1Sent = true;
    await sub.save();
  }

  return { reminded7: subs7.length, reminded1: subs1.length };
};

module.exports = {
  createSubscription,
  getUserSubscription,
  getUserSubscriptionWithFeatures,
  updateSubscription,
  cancelSubscription,
  getUsageHistory,
  getSubscriptionHistory,
  resetAllUsage,
  sendRenewalReminders,
};
