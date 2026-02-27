const Newsletter = require('../models/Newsletter');
const NewsletterEvent = require('../models/NewsletterEvent');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { AppError } = require('../middleware/errorHandler');
const { sendEmail } = require('../utils/email');

class NewsletterAdminService {
  /**
   * Create a draft newsletter
   */
  static async createDraft(data, adminId) {
    const { title, subject, content, recipientFilter, selectedCategories } = data;

    const newsletter = new Newsletter({
      title,
      subject,
      content,
      createdBy: adminId,
      status: 'draft',
      recipientFilter: recipientFilter || 'all',
      selectedCategories: selectedCategories || [],
    });

    await newsletter.save();
    return newsletter.populate('createdBy', 'firstName lastName email');
  }

  /**
   * List draft newsletters
   */
  static async listDrafts(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const drafts = await Newsletter.find({ status: 'draft' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('createdBy', 'firstName lastName email')
      .lean();

    const total = await Newsletter.countDocuments({ status: 'draft' });

    return {
      drafts,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get newsletter by ID
   */
  static async getNewsletter(id) {
    const newsletter = await Newsletter.findById(id).populate('createdBy', 'firstName lastName email');

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    return newsletter;
  }

  /**
   * Update a draft newsletter
   */
  static async updateDraft(id, data) {
    const newsletter = await Newsletter.findById(id);

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    if (newsletter.status !== 'draft') {
      throw new AppError('Can only edit draft newsletters', 400);
    }

    Object.assign(newsletter, data);
    await newsletter.save();

    return newsletter.populate('createdBy', 'firstName lastName email');
  }

  /**
   * Delete a draft newsletter
   */
  static async deleteDraft(id) {
    const newsletter = await Newsletter.findByIdAndDelete(id);

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    return { success: true, message: 'Newsletter deleted' };
  }

  /**
   * Preview newsletter
   */
  static async previewNewsletter(id) {
    const newsletter = await Newsletter.findById(id);

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    return {
      title: newsletter.title,
      subject: newsletter.subject,
      content: newsletter.content,
    };
  }

  /**
   * Send test email
   */
  static async sendTestEmail(id, testEmail) {
    const newsletter = await Newsletter.findById(id);

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    try {
      await sendEmail(testEmail, newsletter.subject, 'newsletter', {
        content: newsletter.content,
        unsubscribeLink: `${process.env.FRONTEND_URL}/newsletter/unsubscribe/test`,
      });

      return { success: true, message: 'Test email sent' };
    } catch (error) {
      throw new AppError('Failed to send test email: ' + error.message, 500);
    }
  }

  /**
   * Schedule newsletter send
   */
  static async scheduleNewsletter(id, scheduledDate, recipientFilter) {
    const newsletter = await Newsletter.findById(id);

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    if (newsletter.status !== 'draft') {
      throw new AppError('Can only schedule draft newsletters', 400);
    }

    if (new Date(scheduledDate) <= new Date()) {
      throw new AppError('Scheduled date must be in the future', 400);
    }

    newsletter.status = 'scheduled';
    newsletter.scheduledDate = new Date(scheduledDate);
    newsletter.recipientFilter = recipientFilter.type || 'all';
    
    if (recipientFilter.categories) {
      newsletter.selectedCategories = recipientFilter.categories;
    }

    await newsletter.save();

    return newsletter.populate('createdBy', 'firstName lastName email');
  }

  /**
   * Send newsletter immediately
   */
  static async sendNow(id, recipientFilter) {
    const newsletter = await Newsletter.findById(id);

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    if (newsletter.status !== 'draft' && newsletter.status !== 'scheduled') {
      throw new AppError('Can only send draft or scheduled newsletters', 400);
    }

    // Get recipients
    const query = { status: 'active' };

    if (recipientFilter.type === 'category-specific' && recipientFilter.categories) {
      query.categories = { $in: recipientFilter.categories };
    } else if (recipientFilter.type === 'by-preference' && recipientFilter.frequency) {
      query.frequency = recipientFilter.frequency;
    }

    const recipients = await NewsletterSubscriber.find(query).select('email _id').lean();

    if (recipients.length === 0) {
      throw new AppError('No recipients found for this campaign', 400);
    }

    // Queue sending (in production, would use Bull job queue)
    const sendPromises = recipients.map((recipient) =>
      sendEmail(recipient.email, newsletter.subject, 'newsletter', {
        content: newsletter.content,
        unsubscribeLink: `${process.env.FRONTEND_URL}/newsletter/unsubscribe/${recipient._id}`,
      }).then(() => {
        // Record sent event
        NewsletterEvent.create({
          newsletter: id,
          subscriber: recipient._id,
          subscriberEmail: recipient.email,
          eventType: 'sent',
        }).catch(() => {});
      }).catch(() => {})
    );

    Promise.allSettled(sendPromises);

    newsletter.status = 'sent';
    newsletter.sentDate = new Date();
    newsletter.stats.totalSent = recipients.length;
    await newsletter.save();

    return { success: true, message: `Newsletter sent to ${recipients.length} recipients`, recipientCount: recipients.length };
  }

  /**
   * Get campaign statistics
   */
  static async getCampaignStats(id) {
    const newsletter = await Newsletter.findById(id);

    if (!newsletter) {
      throw new AppError('Newsletter not found', 404);
    }

    const events = await NewsletterEvent.aggregate([
      { $match: { newsletter: newsletter._id } },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      totalSent: newsletter.stats.totalSent,
      opens: 0,
      clicks: 0,
      bounces: 0,
      unsubscribes: 0,
      complaints: 0,
    };

    events.forEach((event) => {
      if (event._id === 'open') stats.opens = event.count;
      if (event._id === 'click') stats.clicks = event.count;
      if (event._id === 'bounce') stats.bounces = event.count;
      if (event._id === 'unsubscribe') stats.unsubscribes = event.count;
      if (event._id === 'complaint') stats.complaints = event.count;
    });

    // Calculate rates
    stats.openRate = stats.totalSent > 0 ? ((stats.opens / stats.totalSent) * 100).toFixed(2) : 0;
    stats.clickRate = stats.opens > 0 ? ((stats.clicks / stats.opens) * 100).toFixed(2) : 0;

    return {
      newsletter: {
        title: newsletter.title,
        subject: newsletter.subject,
        status: newsletter.status,
        sentDate: newsletter.sentDate,
      },
      stats,
    };
  }

  /**
   * List all sent newsletters
   */
  static async listSentNewsletters(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const newsletters = await Newsletter.find({ status: { $in: ['sent', 'scheduled'] } })
      .sort({ sentDate: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('createdBy', 'firstName lastName email')
      .lean();

    const total = await Newsletter.countDocuments({ status: { $in: ['sent', 'scheduled'] } });

    return {
      newsletters,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }
}

module.exports = NewsletterAdminService;
