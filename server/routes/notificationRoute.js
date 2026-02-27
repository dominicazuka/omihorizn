/**
 * Notification Routes
 * All routes require authentication
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// All routes protected - require authentication
router.use(authenticateToken);

// Get all notifications with filters
router.get('/', notificationController.getNotifications);

// Get unread count
router.get('/unread/count', notificationController.getUnreadCount);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Mark single notification as read
router.put('/:id/read', notificationController.markAsRead);

// Archive notification
router.put('/:id/archive', notificationController.archiveNotification);

// Delete single notification
router.delete('/:id', notificationController.deleteNotification);

// Delete all archived notifications
router.delete('/archived/all', notificationController.deleteArchivedNotifications);

module.exports = router;
