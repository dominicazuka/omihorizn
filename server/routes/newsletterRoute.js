const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { newsletterValidators } = require('../validators');
const {
  subscribe,
  confirmSubscription,
  unsubscribe,
  updatePreferences,
  getPreferences,
} = require('../controllers/newsletterController');
const {
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
} = require('../controllers/newsletterAdminController');
const {
  getDashboardAnalytics,
  getCampaignEngagement,
  getSubscriberEngagement,
  trackOpen,
  trackClick,
  getEmailClientStats,
  getDeviceStats,
} = require('../controllers/newsletterAnalyticsController');

/**
 * Public Newsletter Subscription Routes
 */

// Subscribe to newsletter
router.post('/subscribe', newsletterValidators.subscribe, subscribe);

// Confirm subscription
router.post('/confirm/:token', confirmSubscription);

// Unsubscribe
router.post('/unsubscribe/:token', unsubscribe);

/**
 * Authenticated User Newsletter Routes
 */

// Update newsletter preferences
router.put('/preferences', authenticateToken, newsletterValidators.updatePreferences, updatePreferences);

// Get newsletter preferences
router.get('/preferences', authenticateToken, getPreferences);

/**
 * Admin Newsletter Management Routes
 */

// Create a draft newsletter
router.post('/admin/draft', authenticateToken, requireRole('admin'), newsletterValidators.createDraft, createDraft);

// List draft newsletters
router.get('/admin/drafts', authenticateToken, requireRole('admin'), listDrafts);

// Get newsletter by ID
router.get('/admin/:id', authenticateToken, requireRole('admin'), getNewsletter);

// Update a draft newsletter
router.put('/admin/:id', authenticateToken, requireRole('admin'), newsletterValidators.updateDraft, updateDraft);

// Delete a draft newsletter
router.delete('/admin/:id', authenticateToken, requireRole('admin'), deleteDraft);

// Preview newsletter
router.get('/admin/:id/preview', authenticateToken, requireRole('admin'), previewNewsletter);

// Send test email
router.post('/admin/:id/send-test', authenticateToken, requireRole('admin'), newsletterValidators.sendTest, sendTestEmail);

// Schedule newsletter send
router.post('/admin/:id/schedule', authenticateToken, requireRole('admin'), newsletterValidators.schedule, scheduleNewsletter);

// Send newsletter immediately
router.post('/admin/:id/send-now', authenticateToken, requireRole('admin'), newsletterValidators.sendNow, sendNow);

// Get campaign statistics
router.get('/admin/:id/stats', authenticateToken, requireRole('admin'), getCampaignStats);

// List sent newsletters
router.get('/admin/sent', authenticateToken, requireRole('admin'), listSentNewsletters);

/**
 * Admin Subscriber Management Routes
 */

// List all subscribers
router.get('/admin/subscribers', authenticateToken, requireRole('admin'), listSubscribers);

// Get subscriber details
router.get('/admin/subscribers/:id', authenticateToken, requireRole('admin'), getSubscriber);

// Remove subscriber
router.delete('/admin/subscribers/:id', authenticateToken, requireRole('admin'), removeSubscriber);

// Update subscriber status
router.put('/admin/subscribers/:id/status', authenticateToken, requireRole('admin'), newsletterValidators.updateSubscriberStatus, updateSubscriberStatus);

/**
 * Newsletter Analytics Routes (Admin)
 */

// Get dashboard analytics
router.get('/admin/analytics', authenticateToken, requireRole('admin'), getDashboardAnalytics);

// Get campaign engagement
router.get('/admin/analytics/:newsletterId/engagement', authenticateToken, requireRole('admin'), getCampaignEngagement);

// Get subscriber engagement
router.get('/admin/analytics/subscribers/:subscriberId', authenticateToken, requireRole('admin'), getSubscriberEngagement);

// Get email client stats
router.get('/admin/analytics/:newsletterId/email-clients', authenticateToken, requireRole('admin'), getEmailClientStats);

// Get device stats
router.get('/admin/analytics/:newsletterId/devices', authenticateToken, requireRole('admin'), getDeviceStats);

/**
 * Newsletter Tracking Routes (Public - for pixel tracking)
 */

// Track email open
router.get('/track/open/:newsletterId/:subscriberId', trackOpen);

// Track email click
router.post('/track/click/:newsletterId/:subscriberId', trackClick);

module.exports = router;
