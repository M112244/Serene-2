const express = require('express');
const walletController = require('../controllers/walletController');
const { authMiddleware, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// User wallet routes
router.get('/', walletController.getWallet);
router.get('/balance', walletController.getBalance);
router.get('/transactions', walletController.getTransactions);
router.post('/withdraw', walletController.requestWithdrawal);
router.get('/withdrawals', walletController.getWithdrawals);
router.post('/auto-recharge', walletController.setupAutoRecharge);

// Admin routes
router.post('/add-balance', authorizeRole('admin'), walletController.addBalance);

module.exports = router;
