const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  userType: {
    type: String,
    enum: ['homeowner', 'driver', 'technician', 'fleet_manager', 'admin'],
    required: true
  },
  isVerified: { type: Boolean, default: false },
  verificationOTP: String,
  otpExpiry: Date,
  language: { type: String, enum: ['en', 'ar'], default: 'en' },

  // Location
  address: String,
  latitude: Number,
  longitude: Number,
  city: String,
  country: { type: String, default: 'Saudi Arabia' },

  // Contact preferences
  notificationPreferences: {
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true }
  },

  // Account status
  status: { type: String, enum: ['active', 'suspended', 'banned', 'inactive'], default: 'active' },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
