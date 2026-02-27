const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');

class NewsletterService {
  /**
   * Subscribe to newsletter
   */
  static async subscribe(email, frequency = 'weekly', categories = null, userId = null) {
    // Check if already subscribed
    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === 'active') {
        throw new AppError('Already subscribed with this email', 400);
      }

      // Reactivate if previously unsubscribed
      subscriber.status = 'pending';
      subscriber.subscriptionDate = new Date();
      subscriber.unsubscribeDate = null;
      subscriber.frequency = frequency;
      if (categories) subscriber.categories = categories;
      if (userId) subscriber.user = userId;
    } else {
      // Create new subscriber
      const unsubscribeToken = crypto.randomBytes(32).toString('hex');

      subscriber = new NewsletterSubscriber({
        email,
        frequency,
        categories: categories || ['visa-guides', 'study-abroad', 'immigration-news', 'career-tips'],
        user: userId || null,
        status: 'pending',
        unsubscribeToken,
      });
    }

    await subscriber.save();

    // Send confirmation email
    const confirmationLink = `${process.env.FRONTEND_URL}/newsletter/confirm/${subscriber.unsubscribeToken}`;
    await sendEmail(
      email,
      'Confirm Your Newsletter Subscription',
      'newsletterConfirmation',
      {
        confirmationLink,
        email,
      }
    ).catch(() => {});

    return { success: true, message: 'Confirmation email sent', email };
  }

  /**
   * Confirm newsletter subscription
   */
  static async confirmSubscription(token) {
    const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      throw new AppError('Invalid confirmation token', 400);
    }

    subscriber.status = 'active';
    await subscriber.save();

    return { success: true, message: 'Subscription confirmed' };
  }

  /**
   * Unsubscribe from newsletter
   */
  static async unsubscribe(token) {
    const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      throw new AppError('Invalid unsubscribe token', 400);
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribeDate = new Date();
    await subscriber.save();

    return { success: true, message: 'Unsubscribed from newsletter' };
  }

  /**
   * Update subscriber preferences
   */
  static async updatePreferences(userId, frequency = null, categories = null) {
    const subscriber = await NewsletterSubscriber.findOne({ user: userId });

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    if (frequency) subscriber.frequency = frequency;
    if (categories) subscriber.categories = categories;

    await subscriber.save();

    return subscriber;
  }

  /**
   * Get subscriber preferences (for authenticated users)
   */
  static async getPreferences(userId) {
    const subscriber = await NewsletterSubscriber.findOne({ user: userId });

    if (!subscriber) {
      return { status: 'not-subscribed' };
    }

    return {
      email: subscriber.email,
      status: subscriber.status,
      frequency: subscriber.frequency,
      categories: subscriber.categories,
      subscriptionDate: subscriber.subscriptionDate,
    };
  }

  /**
   * Get all active subscribers for a campaign
   */
  static async getRecipientsForCampaign(filter) {
    const query = { status: 'active' };

    if (filter === 'active') {
      query.status = 'active';
    } else if (filter.type === 'category-specific' && filter.categories) {
      query.categories = { $in: filter.categories };
    } else if (filter.type === 'by-preference' && filter.frequency) {
      query.frequency = filter.frequency;
    }

    return NewsletterSubscriber.find(query).select('email user frequency categories').lean();
  }

  /**
   * Get subscriber count
   */
  static async getSubscriberCount() {
    const active = await NewsletterSubscriber.countDocuments({ status: 'active' });
    const pending = await NewsletterSubscriber.countDocuments({ status: 'pending' });
    const unsubscribed = await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' });
    const bounced = await NewsletterSubscriber.countDocuments({ status: 'bounced' });

    return { active, pending, unsubscribed, bounced, total: active + pending + unsubscribed + bounced };
  }

  /**
   * List all subscribers (admin)
   */
  static async listSubscribers(page = 1, pageSize = 20, search = null, status = null) {
    const skip = (page - 1) * pageSize;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ subscriptionDate: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('user', 'firstName lastName email')
      .lean();

    const total = await NewsletterSubscriber.countDocuments(query);

    return {
      subscribers,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get subscriber details
   */
  static async getSubscriber(id) {
    const subscriber = await NewsletterSubscriber.findById(id).populate('user', 'firstName lastName email');

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    return subscriber;
  }

  /**
   * Remove subscriber (admin)
   */
  static async removeSubscriber(id) {
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    return { success: true, message: 'Subscriber removed' };
  }

  /**
   * Update subscriber status (admin)
   */
  static async updateSubscriberStatus(id, status) {
    const validStatuses = ['pending', 'active', 'unsubscribed', 'bounced'];

    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const subscriber = await NewsletterSubscriber.findByIdAndUpdate(
      id,
      { status, unsubscribeDate: status === 'unsubscribed' ? new Date() : null },
      { new: true }
    );

    if (!subscriber) {
      throw new AppError('Subscriber not found', 404);
    }

    return subscriber;
  }
}

module.exports = NewsletterService;
