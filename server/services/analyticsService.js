/**
 * Analytics Service
 * Provides aggregated payment, subscription, and user analytics
 */

const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

/**
 * Get payment analytics summary
 * Returns: total revenue, payment count, success rate, churn rate
 */
const getPaymentAnalytics = async (dateRange = 30) => {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);

  // Total revenue and payment metrics
  const paymentMetrics = await Payment.aggregate([
    { $match: { completedAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalPayments: { $sum: 1 },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
        },
        failedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
        },
        avgPaymentAmount: { $avg: '$amount' },
      },
    },
  ]);

  // Revenue by tier
  const revenueByTier = await Payment.aggregate([
    { $match: { completedAt: { $gte: startDate }, status: 'completed' } },
    {
      $lookup: {
        from: 'subscriptions',
        localField: 'subscriptionId',
        foreignField: '_id',
        as: 'subscription',
      },
    },
    { $unwind: '$subscription' },
    {
      $group: {
        _id: '$subscription.tier',
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  // Daily revenue trend
  const dailyRevenue = await Payment.aggregate([
    { $match: { completedAt: { $gte: startDate }, status: 'completed' } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
        },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const metrics = paymentMetrics[0] || {
    totalRevenue: 0,
    totalPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
    avgPaymentAmount: 0,
  };

  const successRate =
    metrics.totalPayments > 0
      ? ((metrics.completedPayments / metrics.totalPayments) * 100).toFixed(2)
      : 0;

  return {
    period: `${dateRange} days`,
    summary: {
      totalRevenue: (metrics.totalRevenue / 100).toFixed(2),
      totalPayments: metrics.totalPayments,
      completedPayments: metrics.completedPayments,
      failedPayments: metrics.failedPayments,
      successRate: `${successRate}%`,
      avgPaymentAmount: (metrics.avgPaymentAmount / 100).toFixed(2),
    },
    byTier: revenueByTier.map(tier => ({
      tier: tier._id,
      revenue: (tier.revenue / 100).toFixed(2),
      count: tier.count,
      avgAmount: (tier.avgAmount / 100).toFixed(2),
    })),
    dailyTrend: dailyRevenue.map(day => ({
      date: day._id,
      revenue: (day.revenue / 100).toFixed(2),
      paymentCount: day.count,
    })),
  };
};

/**
 * Get subscription analytics
 * Returns: active subscriptions, churn rate, conversion metrics
 */
const getSubscriptionAnalytics = async (dateRange = 30) => {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);

  // Subscription counts by status and tier
  const subscriptionMetrics = await Subscription.aggregate([
    {
      $facet: {
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
        byTier: [
          {
            $group: {
              _id: '$tier',
              count: { $sum: 1 },
            },
          },
        ],
        activeByTier: [
          { $match: { status: 'active' } },
          {
            $group: {
              _id: '$tier',
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  // New subscriptions in period
  const newSubscriptions = await Subscription.countDocuments({
    createdAt: { $gte: startDate },
  });

  // Cancelled subscriptions in period
  const cancelledSubscriptions = await Subscription.countDocuments({
    cancellationDate: { $gte: startDate },
  });

  // Calculate churn rate
  const totalActive = await Subscription.countDocuments({ status: 'active' });
  const churnRate =
    totalActive > 0
      ? ((cancelledSubscriptions / totalActive) * 100).toFixed(2)
      : 0;

  return {
    period: `${dateRange} days`,
    newSubscriptions,
    cancelledSubscriptions,
    churnRate: `${churnRate}%`,
    byStatus: subscriptionMetrics[0].byStatus,
    byTier: subscriptionMetrics[0].byTier,
    activeByTier: subscriptionMetrics[0].activeByTier,
  };
};

/**
 * Get user analytics
 * Returns: total users, user growth, conversion funnel
 */
const getUserAnalytics = async (dateRange = 30) => {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);

  // Total users and new registrations
  const totalUsers = await User.countDocuments();
  const newUsers = await User.countDocuments({
    createdAt: { $gte: startDate },
  });

  // Users by subscription tier
  const usersByTier = await Subscription.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: '$tier',
        count: { $sum: 1 },
      },
    },
  ]);

  // Conversion: registered users to paid subscribers
  const paidUsers = await Subscription.countDocuments({
    status: 'active',
    tier: { $ne: 'free' },
  });
  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(2) : 0;

  // User growth over time
  const userGrowth = await User.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    period: `${dateRange} days`,
    totalUsers,
    newUsers,
    paidUsers,
    conversionRate: `${conversionRate}%`,
    usersByTier,
    dailyGrowth: userGrowth.slice(-dateRange).map(day => ({
      date: day._id,
      newUsers: day.count,
    })),
  };
};

/**
 * Get professional services analytics
 * Returns: advisor calls, document reviews, coaching sessions usage
 */
const getProfessionalServicesAnalytics = async (dateRange = 30) => {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);

  // Advisor analytics would go here
  const advisorMetrics = {
    bookedCalls: 0, // Requires Advisor model implementation
    completedCalls: 0,
    avgRating: 0,
  };

  // Document review analytics would go here
  const reviewMetrics = {
    submittedReviews: 0, // Requires DocumentReview model implementation
    completedReviews: 0,
    avgTurnaroundDays: 0,
  };

  // Coaching session analytics would go here
  const coachingMetrics = {
    bookedSessions: 0, // Requires CoachingSession model implementation
    completedSessions: 0,
    avgFeedbackScore: 0,
  };

  return {
    period: `${dateRange} days`,
    advisor: advisorMetrics,
    documentReview: reviewMetrics,
    coaching: coachingMetrics,
  };
};

/**
 * Get support ticket analytics
 * Returns: ticket metrics, SLA compliance, agent performance
 */
const getSupportAnalytics = async (dateRange = 30) => {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);

  // SLA compliance would require SupportTicket model
  return {
    period: `${dateRange} days`,
    totalTickets: 0,
    resolvedTickets: 0,
    avgResolutionTime: '0 hours',
    slaCompliance: '0%',
    byCategory: [],
    byTier: [],
  };
};

/**
 * Get comprehensive dashboard data
 * Returns: all analytics for admin dashboard
 */
const getDashboardAnalytics = async (dateRange = 30) => {
  const [payments, subscriptions, users, professional, support] =
    await Promise.all([
      getPaymentAnalytics(dateRange),
      getSubscriptionAnalytics(dateRange),
      getUserAnalytics(dateRange),
      getProfessionalServicesAnalytics(dateRange),
      getSupportAnalytics(dateRange),
    ]);

  return {
    period: `${dateRange} days`,
    payments,
    subscriptions,
    users,
    professional,
    support,
  };
};

module.exports = {
  getPaymentAnalytics,
  getSubscriptionAnalytics,
  getUserAnalytics,
  getProfessionalServicesAnalytics,
  getSupportAnalytics,
  getDashboardAnalytics,
};
