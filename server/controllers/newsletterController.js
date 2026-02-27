const NewsletterService = require('../services/newsletterService');

/**
 * Subscribe to newsletter (validation done at route level)
 */
const subscribe = async (req, res, next) => {
  try {
    const { email, frequency, categories } = req.body;
    const userId = req.user ? req.user.id : null;

    const result = await NewsletterService.subscribe(email, frequency, categories, userId);

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm newsletter subscription
 */
const confirmSubscription = async (req, res, next) => {
  try {
    const { token } = req.params;

    const result = await NewsletterService.confirmSubscription(token);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unsubscribe from newsletter
 */
const unsubscribe = async (req, res, next) => {
  try {
    const { token } = req.params;

    const result = await NewsletterService.unsubscribe(token);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update newsletter preferences (Authenticated) - validation done at route level
 */
const updatePreferences = async (req, res, next) => {
  try {
    const { frequency, categories } = req.body;

    const subscriber = await NewsletterService.updatePreferences(req.user.id, frequency, categories);

    res.status(200).json({
      success: true,
      message: 'Preferences updated',
      subscriber,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get newsletter preferences (Authenticated)
 */
const getPreferences = async (req, res, next) => {
  try {
    const preferences = await NewsletterService.getPreferences(req.user.id);

    res.status(200).json({
      success: true,
      preferences,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  confirmSubscription,
  unsubscribe,
  updatePreferences,
  getPreferences,
};
