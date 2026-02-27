/**
 * Analytics Controller
 * Admin endpoints for payment, subscription, and user analytics
 */

const analyticsService = require('../services/analyticsService');

const getDashboard = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await analyticsService.getDashboardAnalytics(parseInt(days));
    res.json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
};

const getPaymentAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await analyticsService.getPaymentAnalytics(parseInt(days));
    res.json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
};

const getSubscriptionAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await analyticsService.getSubscriptionAnalytics(parseInt(days));
    res.json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
};

const getUserAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await analyticsService.getUserAnalytics(parseInt(days));
    res.json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
};

const getProfessionalServicesAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await analyticsService.getProfessionalServicesAnalytics(parseInt(days));
    res.json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
};

const getSupportAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await analyticsService.getSupportAnalytics(parseInt(days));
    res.json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  getPaymentAnalytics,
  getSubscriptionAnalytics,
  getUserAnalytics,
  getProfessionalServicesAnalytics,
  getSupportAnalytics,
};
