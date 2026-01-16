const express = require('express');
const tankController = require('../controllers/tankController');
const { authMiddleware, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and homeowner role
router.use(authMiddleware);

// Homeowner routes
router.post('/', authorizeRole('homeowner'), tankController.addTank);
router.get('/', authorizeRole('homeowner'), tankController.getTanks);
router.get('/dashboard-summary', authorizeRole('homeowner'), tankController.getDashboardSummary);
router.get('/:id', authorizeRole('homeowner'), tankController.getTank);
router.put('/:id', authorizeRole('homeowner'), tankController.updateTank);
router.delete('/:id', authorizeRole('homeowner'), tankController.deleteTank);
router.post('/:id/calibrate', authorizeRole('homeowner'), tankController.calibrateTank);
router.post('/:id/pair-sensor', authorizeRole('homeowner'), tankController.pairSensor);

// Sensor update route (IoT)
router.post('/sensor/update-level', tankController.updateTankLevel);

module.exports = router;
