const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  homeownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tank', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fleetId: { type: mongoose.Schema.Types.ObjectId, ref: 'FleetManager' },

  // Order details
  litersRequested: { type: Number, required: true },
  tankerSize: { type: Number, enum: [1000, 3000, 5000], required: true },
  orderType: { type: String, enum: ['manual', 'auto', 'scheduled'], default: 'manual' },

  // Pricing
  basePrice: Number,
  distanceFee: Number,
  taxAmount: Number,
  totalPrice: { type: Number, required: true },

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_transit', 'delivering', 'completed', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    notes: String
  }],

  // Location and delivery
  deliveryAddress: String,
  deliveryLatitude: Number,
  deliveryLongitude: Number,
  accessInstructions: String,
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  deliveryDuration: Number, // in minutes

  // Real-time tracking
  trackingUpdates: [{
    status: String,
    latitude: Number,
    longitude: Number,
    timestamp: Date,
    eta: Date
  }],

  // Completion details
  actualLitersDelivered: Number,
  proofOfDelivery: {
    tankFillingPhoto: String,
    meterPhoto: String,
    signatureUrl: String,
    notes: String
  },

  // Payment
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'wallet', 'stc_pay', 'apple_pay', 'manual'],
    required: true
  },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentDetails: {
    transactionId: String,
    timestamp: Date,
    receipt: String
  },

  // Rating and feedback
  driverRating: { type: Number, min: 1, max: 5 },
  driverReview: String,
  issues: [String],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for quick lookups
OrderSchema.index({ homeownerId: 1, createdAt: -1 });
OrderSchema.index({ driverId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderId: 1 });

module.exports = mongoose.model('Order', OrderSchema);
