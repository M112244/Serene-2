const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Homeowner analytics
router.get('/homeowner', authorizeRole('homeowner'), analyticsController.getHomeownerAnalytics);

// Driver analytics
router.get('/driver', authorizeRole('driver'), analyticsController.getDriverAnalytics);

// Fleet manager analytics
router.get('/fleet', authorizeRole('fleet_manager'), analyticsController.getFleetAnalytics);

// Platform analytics
router.get('/platform', authorizeRole('admin'), analyticsController.getPlatformAnalytics);

module.exports = router;
