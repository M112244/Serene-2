const mongoose = require('mongoose');

const TankSchema = new mongoose.Schema({
  homeownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: {
    type: String,
    enum: ['roof', 'ground', 'basement', 'other'],
    required: true
  },
  capacity: { type: Number, required: true }, // in liters
  currentLevel: { type: Number, default: 0 }, // in liters
  sensorId: String,
  sensorType: { type: String, enum: ['bluetooth', 'wifi', 'gsm', 'none'], default: 'bluetooth' },
  sensorStatus: { type: String, enum: ['connected', 'disconnected', 'error'], default: 'disconnected' },
  isCalibrated: { type: Boolean, default: false },
  calibrationData: {
    emptyLevel: Number,
    fullLevel: Number,
    calibratedAt: Date
  },
  lastReading: {
    level: Number,
    percentage: Number,
    timestamp: Date,
    status: { type: String, enum: ['excellent', 'good', 'low', 'critical'], default: 'good' }
  },
  dailyConsumption: { type: Number, default: 0 }, // average liters per day
  estimatedDaysRemaining: Number,
  lowThreshold: { type: Number, default: 30 }, // percentage
  autoRefillEnabled: { type: Boolean, default: false },
  autoRefillSize: { type: Number, enum: [1000, 3000, 5000] },

  // Refill history
  totalRefills: { type: Number, default: 0 },
  lastRefillDate: Date,

  // Tags and metadata
  buildingType: { type: String, enum: ['residential', 'commercial', 'mixed'] },
  waterQuality: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for quick lookup
TankSchema.index({ homeownerId: 1 });
TankSchema.index({ sensorId: 1 });

module.exports = mongoose.model('Tank', TankSchema);
