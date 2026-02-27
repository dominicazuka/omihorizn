const NewsletterEvent = require('../models/NewsletterEvent');
const Newsletter = require('../models/Newsletter');
const { AppError } = require('../middleware/errorHandler');

class NewsletterAnalyticsService {
  /**
   * Get dashboard analytics
   */
  static async getDashboardAnalytics() {
    // Get subscriber statistics
    const totalNewsletters = await Newsletter.countDocuments({ status: 'sent' });
    const totalSent = await NewsletterEvent.countDocuments({ eventType: 'sent' });
    const totalOpens = await NewsletterEvent.countDocuments({ eventType: 'open' });
    const totalClicks = await NewsletterEvent.countDocuments({ eventType: 'click' });

    // Calculate rates
    const openRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(2) : 0;
    const clickRate = totalOpens > 0 ? ((totalClicks / totalOpens) * 100).toFixed(2) : 0;

    // Get top performing newsletters
    const topNewsletters = await Newsletter.aggregate([
      { $match: { status: 'sent' } },
      {
        $lookup: {
          from: 'newsletterevents',
          localField: '_id',
          foreignField: 'newsletter',
          as: 'events',
        },
      },
      {
        $addFields: {
          openCount: {
            $size: {
              $filter: {
                input: '$events',
                as: 'event',
                cond: { $eq: ['$$event.eventType', 'open'] },
              },
            },
          },
          clickCount: {
            $size: {
              $filter: {
                input: '$events',
                as: 'event',
                cond: { $eq: ['$$event.eventType', 'click'] },
              },
            },
          },
        },
      },
      { $sort: { openCount: -1 } },
      { $limit: 5 },
      { $project: { title: 1, subject: 1, stats: 1, openCount: 1, clickCount: 1, sentDate: 1 } },
    ]);

    return {
      totalNewsletters,
      totalSent,
      totalOpens,
      totalClicks,
      openRate,
      clickRate,
      topNewsletters,
    };
  }

  /**
   * Get engagement analytics for a specific campaign
   */
  static async getCampaignEngagement(newsletterId) {
    const newsletter = await Newsletter.findById(newsletterId);

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    // Get event counts
    const events = await NewsletterEvent.aggregate([
      { $match: { newsletter: newsletter._id } },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    const engagement = {
      sent: newsletter.stats.totalSent,
      opens: 0,
      clicks: 0,
      bounces: 0,
      unsubscribes: 0,
      complaints: 0,
    };

    events.forEach((event) => {
      if (event._id === 'open') engagement.opens = event.count;
      if (event._id === 'click') engagement.clicks = event.count;
      if (event._id === 'bounce') engagement.bounces = event.count;
      if (event._id === 'unsubscribe') engagement.unsubscribes = event.count;
      if (event._id === 'complaint') engagement.complaints = event.count;
    });

    // Calculate rates
    engagement.openRate = engagement.sent > 0 ? ((engagement.opens / engagement.sent) * 100).toFixed(2) : 0;
    engagement.clickRate = engagement.opens > 0 ? ((engagement.clicks / engagement.opens) * 100).toFixed(2) : 0;
    engagement.unsubscribeRate = engagement.sent > 0 ? ((engagement.unsubscribes / engagement.sent) * 100).toFixed(2) : 0;

    // Get click details (which links were clicked)
    const clickedLinks = await NewsletterEvent.aggregate([
      { $match: { newsletter: newsletter._id, eventType: 'click', clickedLink: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$clickedLink',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      campaign: {
        title: newsletter.title,
        subject: newsletter.subject,
        sentDate: newsletter.sentDate,
      },
      engagement,
      clickedLinks: clickedLinks.map((link) => ({
        url: link._id,
        clicks: link.count,
      })),
    };
  }

  /**
   * Get subscriber engagement history
   */
  static async getSubscriberEngagement(subscriberId, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    const events = await NewsletterEvent.find({ subscriber: subscriberId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('newsletter', 'title subject sentDate')
      .lean();

    const total = await NewsletterEvent.countDocuments({ subscriber: subscriberId });

    return {
      events,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Track email open (pixel load)
   */
  static async trackOpen(newsletterId, subscriberId, subscriberEmail, deviceInfo = null) {
    try {
      await NewsletterEvent.create({
        newsletter: newsletterId,
        subscriber: subscriberId || null,
        subscriberEmail,
        eventType: 'open',
        deviceInfo: deviceInfo || 'unknown',
      });

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Track email click
   */
  static async trackClick(newsletterId, subscriberId, subscriberEmail, clickedLink) {
    try {
      await NewsletterEvent.create({
        newsletter: newsletterId,
        subscriber: subscriberId || null,
        subscriberEmail,
        eventType: 'click',
        clickedLink,
      });

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Track email bounce
   */
  static async trackBounce(newsletterId, subscriberEmail) {
    try {
      await NewsletterEvent.create({
        newsletter: newsletterId,
        subscriberEmail,
        eventType: 'bounce',
      });

      // Mark subscriber as bounced
      await NewsletterSubscriber.updateOne(
        { email: subscriberEmail },
        { status: 'bounced' }
      ).catch(() => {});

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Get email client statistics
   */
  static async getEmailClientStats(newsletterId) {
    const stats = await NewsletterEvent.aggregate([
      { $match: { newsletter: newsletterId, eventType: 'open', emailClient: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$emailClient',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return stats.map((stat) => ({
      emailClient: stat._id || 'Unknown',
      count: stat.count,
    }));
  }

  /**
   * Get device statistics
   */
  static async getDeviceStats(newsletterId) {
    const stats = await NewsletterEvent.aggregate([
      { $match: { newsletter: newsletterId, eventType: 'open' } },
      {
        $group: {
          _id: '$deviceInfo',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return stats.map((stat) => ({
      device: stat._id || 'Unknown',
      count: stat.count,
    }));
  }
}

module.exports = NewsletterAnalyticsService;
