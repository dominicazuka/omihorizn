/**
 * Notification Service
 * Business logic for notifications (used by controllers)
 */

const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');

const getNotifications = async ({ userId, query = {} }) => {
  const { page = 1, limit = 20, isRead, isArchived, priority, type, sort = '-createdAt' } = query;

  const filter = { userId };
  if (isRead !== undefined) filter.isRead = isRead === 'true' || isRead === true;
  if (isArchived !== undefined) filter.isArchived = isArchived === 'true' || isArchived === true;
  if (priority) filter.priority = priority;
  if (type) filter.type = type;

  const total = await Notification.countDocuments(filter);

  const notifications = await Notification.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  return {
    notifications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ userId, isRead: false, isArchived: false });
};

const markAsRead = async ({ id, userId }) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true, readAt: Date.now() },
    { new: true, runValidators: true }
  );
  if (!notification) throw new AppError('Notification not found', 404);
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false, isArchived: false }, { isRead: true, readAt: Date.now() });
  return getUnreadCount(userId);
};

const archiveNotification = async ({ id, userId }) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { isArchived: true, archivedAt: Date.now() },
    { new: true, runValidators: true }
  );
  if (!notification) throw new AppError('Notification not found', 404);
  return notification;
};

const deleteNotification = async ({ id, userId }) => {
  const notification = await Notification.findOneAndDelete({ _id: id, userId });
  if (!notification) throw new AppError('Notification not found', 404);
  return notification;
};

const deleteArchivedNotifications = async (userId) => {
  const result = await Notification.deleteMany({ userId, isArchived: true });
  return result.deletedCount || 0;
};

const createNotification = async (userId, notificationData) => {
  try {
    const notification = await Notification.create({ userId, ...notificationData });
    return notification;
  } catch (err) {
    // Log error, but don't throw to keep non-critical flows safe
    console.error('createNotification error', err);
    return null;
  }
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
