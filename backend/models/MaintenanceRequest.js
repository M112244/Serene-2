const mongoose = require('mongoose');

const MaintenanceRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true, required: true },
  homeownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tank', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Service details
  serviceType: {
    type: String,
    enum: [
      'leak_detection',
      'tank_cleaning',
      'sensor_config',
      'water_quality_test',
      'pipe_inspection',
      'pump_maintenance',
      'filter_replacement',
      'tank_coating'
    ],
    required: true
  },
  description: { type: String, required: true },
  priority: { type: String, enum: ['routine', 'urgent'], default: 'routine' },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Scheduling
  preferredDateTime: Date,
  timeWindow: {
    startTime: String,
    endTime: String
  },
  actualStartTime: Date,
  actualEndTime: Date,
  estimatedDuration: Number, // in minutes

  // Issue documentation
  initialPhotos: [String],
  initialNotes: String,

  // Work completion
  workPerformed: String,
  additionalIssuesFound: [String],
  partsUsed: [{
    name: String,
    quantity: Number,
    cost: Number
  }],
  finalPhotos: [String],
  finalNotes: String,

  // Cost and payment
  estimatedCost: Number,
  actualCost: Number,
  paymentStatus: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' },

  // Warranty
  warrantyPeriod: Number, // in days
  warrantyExpiry: Date,

  // Rating and feedback
  technicianRating: { type: Number, min: 1, max: 5 },
  technicianReview: String,
  serviceQuality: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },

  // Client signature
  clientSignatureUrl: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for quick lookups
MaintenanceRequestSchema.index({ homeownerId: 1, createdAt: -1 });
MaintenanceRequestSchema.index({ technicianId: 1, createdAt: -1 });
MaintenanceRequestSchema.index({ status: 1 });

module.exports = mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);
