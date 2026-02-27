/**
 * Notification Controller
 * Handles all notification operations
 */

const notificationService = require('../services/notificationService');


// Get all notifications for user
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.getNotifications({ userId, query: req.query });
    return res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

// Get unread count
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const unreadCount = await notificationService.getUnreadCount(userId);
    return res.status(200).json({ status: 'success', data: { unreadCount } });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const notification = await notificationService.markAsRead({ id, userId });
    return res.status(200).json({ status: 'success', data: { notification } });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const unreadCount = await notificationService.markAllAsRead(userId);
    return res.status(200).json({ status: 'success', data: { unreadCount, message: 'All notifications marked as read' } });
  } catch (error) {
    next(error);
  }
};

// Archive notification
const archiveNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const notification = await notificationService.archiveNotification({ id, userId });
    return res.status(200).json({ status: 'success', data: { notification } });
  } catch (error) {
    next(error);
  }
};

// Delete notification
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await notificationService.deleteNotification({ id, userId });
    return res.status(200).json({ status: 'success', message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete all archived notifications
const deleteArchivedNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const deletedCount = await notificationService.deleteArchivedNotifications(userId);
    return res.status(200).json({ status: 'success', data: { deletedCount, message: 'Archived notifications deleted successfully' } });
  } catch (error) {
    next(error);
  }
};

// Create notification (Internal - for system use)
const createNotification = async (userId, notificationData) => {
  return notificationService.createNotification(userId, notificationData);
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  deleteArchivedNotifications,
  createNotification,
};
