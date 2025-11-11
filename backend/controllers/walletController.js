const Wallet = require('../models/Wallet');
const User = require('../models/User');

// Get wallet details
exports.getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      wallet = new Wallet({ userId: req.user.id });
      await wallet.save();
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wallet balance
exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });

    res.json({
      balance: wallet?.balance || 0,
      currency: wallet?.currency || 'SAR'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transaction history
exports.getTransactions = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.json([]);
    }

    const transactions = wallet.transactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(offset, offset + limit);

    res.json({
      transactions,
      total: wallet.transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request withdrawal
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, bankAccount } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const withdrawalId = 'WITH' + Date.now();

    wallet.withdrawalRequests.push({
      withdrawalId,
      amount,
      bankAccount,
      status: 'pending',
      requestDate: new Date()
    });

    await wallet.save();

    res.json({
      message: 'Withdrawal request submitted',
      withdrawalId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get withdrawal history
exports.getWithdrawals = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.json([]);
    }

    res.json(wallet.withdrawalRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add wallet balance (for admin/system)
exports.addBalance = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.balance += amount;
    wallet.transactions.push({
      transactionId: 'ADD' + Date.now(),
      type: 'credit',
      amount,
      description,
      status: 'completed',
      timestamp: new Date()
    });

    await wallet.save();

    res.json({ message: 'Balance added', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Setup auto-recharge
exports.setupAutoRecharge = async (req, res) => {
  try {
    const { enabled, amount, threshold } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.autoRechargeEnabled = enabled;
    wallet.autoRechargeAmount = amount;
    wallet.autoRechargeThreshold = threshold;

    await wallet.save();

    res.json({ message: 'Auto-recharge configured', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
