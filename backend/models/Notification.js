const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['order', 'delivery', 'maintenance', 'payment', 'alert', 'system', 'promotion'],
    required: true
  },
  relatedOrderId: mongoose.Schema.Types.ObjectId,
  relatedMaintenanceId: mongoose.Schema.Types.ObjectId,

  // Delivery channels
  channels: {
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },

  // Status
  isRead: { type: Boolean, default: false },
  readAt: Date,
  deliveryStatus: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },

  // Action
  actionUrl: String,
  actionType: String,

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days
});

// TTL index to auto-delete old notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for quick lookups
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
