const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'SAR' },

  // Transaction history
  transactions: [{
    transactionId: String,
    type: { type: String, enum: ['credit', 'debit', 'refund'] },
    amount: Number,
    description: String,
    relatedOrderId: mongoose.Schema.Types.ObjectId,
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    timestamp: { type: Date, default: Date.now }
  }],

  // Withdrawal requests
  withdrawalRequests: [{
    withdrawalId: String,
    amount: Number,
    bankAccount: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    requestDate: Date,
    completionDate: Date
  }],

  // Auto-recharge settings
  autoRechargeEnabled: { type: Boolean, default: false },
  autoRechargeAmount: Number,
  autoRechargeThreshold: Number,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for quick lookup
WalletSchema.index({ userId: 1 });

module.exports = mongoose.model('Wallet', WalletSchema);
