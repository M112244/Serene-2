const Notification = require('../models/Notification');
const User = require('../models/User');

// Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;

    let query = { userId: req.user.id };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Notification.countDocuments(query);

    res.json({
      notifications,
      total,
      unreadCount: await Notification.countDocuments({ userId: req.user.id, isRead: false })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single notification
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification || notification.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification || notification.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification || notification.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.deleteOne({ _id: req.params.id });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update notification preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { push, sms, email, inApp } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        notificationPreferences: {
          push: push !== undefined ? push : true,
          sms: sms !== undefined ? sms : true,
          email: email !== undefined ? email : true,
          inApp: inApp !== undefined ? inApp : true
        }
      },
      { new: true }
    );

    res.json({ message: 'Preferences updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notification preferences
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notificationPreferences');

    res.json(user.notificationPreferences || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
