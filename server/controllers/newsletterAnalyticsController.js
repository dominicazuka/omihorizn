const NewsletterAnalyticsService = require('../services/newsletterAnalyticsService');

/**
 * Get dashboard analytics
 */
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const analytics = await NewsletterAnalyticsService.getDashboardAnalytics();

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get campaign engagement analytics
 */
const getCampaignEngagement = async (req, res, next) => {
  try {
    const { newsletterId } = req.params;

    const engagement = await NewsletterAnalyticsService.getCampaignEngagement(newsletterId);

    res.status(200).json({
      success: true,
      engagement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get subscriber engagement history
 */
const getSubscriberEngagement = async (req, res, next) => {
  try {
    const { subscriberId } = req.params;
    const { page = 1, pageSize = 20 } = req.query;

    const result = await NewsletterAnalyticsService.getSubscriberEngagement(
      subscriberId,
      parseInt(page),
      parseInt(pageSize)
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Track email open (pixel load)
 */
const trackOpen = async (req, res, next) => {
  try {
    const { newsletterId, subscriberId } = req.params;
    const { subscriberEmail, deviceInfo } = req.body;

    await NewsletterAnalyticsService.trackOpen(newsletterId, subscriberId, subscriberEmail, deviceInfo);

    // Return 1x1 transparent pixel
    res.setHeader('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    next(error);
  }
};

/**
 * Track email click
 */
const trackClick = async (req, res, next) => {
  try {
    const { newsletterId, subscriberId } = req.params;
    const { subscriberEmail, clickedLink } = req.body;

    await NewsletterAnalyticsService.trackClick(newsletterId, subscriberId, subscriberEmail, clickedLink);

    // Redirect to the actual link
    res.redirect(clickedLink);
  } catch (error) {
    next(error);
  }
};

/**
 * Get email client statistics
 */
const getEmailClientStats = async (req, res, next) => {
  try {
    const { newsletterId } = req.params;

    const stats = await NewsletterAnalyticsService.getEmailClientStats(newsletterId);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get device statistics
 */
const getDeviceStats = async (req, res, next) => {
  try {
    const { newsletterId } = req.params;

    const stats = await NewsletterAnalyticsService.getDeviceStats(newsletterId);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
  getCampaignEngagement,
  getSubscriberEngagement,
  trackOpen,
  trackClick,
  getEmailClientStats,
  getDeviceStats,
};
