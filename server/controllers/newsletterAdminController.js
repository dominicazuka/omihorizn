const NewsletterAdminService = require('../services/newsletterAdminService');
const NewsletterService = require('../services/newsletterService');

/**
 * Create a draft newsletter (validation done at route level)
 */
const createDraft = async (req, res, next) => {
  try {
    const newsletter = await NewsletterAdminService.createDraft(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Newsletter draft created',
      newsletter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List draft newsletters
 */
const listDrafts = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const result = await NewsletterAdminService.listDrafts(parseInt(page), parseInt(pageSize));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get newsletter by ID
 */
const getNewsletter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const newsletter = await NewsletterAdminService.getNewsletter(id);

    res.status(200).json({
      success: true,
      newsletter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a draft newsletter (validation done at route level)
 */
const updateDraft = async (req, res, next) => {
  try {
    const { id } = req.params;

    const newsletter = await NewsletterAdminService.updateDraft(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Newsletter updated',
      newsletter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a draft newsletter
 */
const deleteDraft = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await NewsletterAdminService.deleteDraft(id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Preview newsletter
 */
const previewNewsletter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const preview = await NewsletterAdminService.previewNewsletter(id);

    res.status(200).json({
      success: true,
      preview,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send test email (validation done at route level)
 */
const sendTestEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { testEmail } = req.body;

    const result = await NewsletterAdminService.sendTestEmail(id, testEmail);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Schedule newsletter send (validation done at route level)
 */
const scheduleNewsletter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scheduledDate, recipientFilter } = req.body;

    const newsletter = await NewsletterAdminService.scheduleNewsletter(id, scheduledDate, recipientFilter);

    res.status(200).json({
      success: true,
      message: 'Newsletter scheduled',
      newsletter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send newsletter immediately (validation done at route level)
 */
const sendNow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { recipientFilter } = req.body;

    const result = await NewsletterAdminService.sendNow(id, recipientFilter);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get campaign statistics
 */
const getCampaignStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const stats = await NewsletterAdminService.getCampaignStats(id);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List sent newsletters
 */
const listSentNewsletters = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const result = await NewsletterAdminService.listSentNewsletters(parseInt(page), parseInt(pageSize));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all subscribers
 */
const listSubscribers = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, search, status } = req.query;

    const result = await NewsletterService.listSubscribers(
      parseInt(page),
      parseInt(pageSize),
      search,
      status
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
 * Get subscriber details
 */
const getSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscriber = await NewsletterService.getSubscriber(id);

    res.status(200).json({
      success: true,
      subscriber,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove subscriber
 */
const removeSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await NewsletterService.removeSubscriber(id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update subscriber status (validation done at route level)
 */
const updateSubscriberStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subscriber = await NewsletterService.updateSubscriberStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Subscriber status updated',
      subscriber,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDraft,
  listDrafts,
  getNewsletter,
  updateDraft,
  deleteDraft,
  previewNewsletter,
  sendTestEmail,
  scheduleNewsletter,
  sendNow,
  getCampaignStats,
  listSentNewsletters,
  listSubscribers,
  getSubscriber,
  removeSubscriber,
  updateSubscriberStatus,
};
