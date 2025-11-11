const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Homeowner routes
router.post('/', authorizeRole('homeowner'), orderController.createOrder);
router.get('/', authorizeRole('homeowner', 'driver'), orderController.getOrders);
router.get('/:id', authorizeRole('homeowner', 'driver'), orderController.getOrder);
router.post('/:id/rate', authorizeRole('homeowner'), orderController.rateOrder);
router.post('/:id/cancel', authorizeRole('homeowner'), orderController.cancelOrder);

// Driver routes
router.post('/:id/accept', authorizeRole('driver'), orderController.acceptOrder);
router.put('/:id/status', authorizeRole('driver'), orderController.updateOrderStatus);
router.post('/:id/complete', authorizeRole('driver'), orderController.completeOrder);

// Available resources
router.get('/drivers/available', authorizeRole('homeowner'), orderController.getAvailableDrivers);

module.exports = router;
