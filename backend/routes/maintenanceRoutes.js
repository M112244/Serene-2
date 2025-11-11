const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const { authMiddleware, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Homeowner routes
router.post('/', authorizeRole('homeowner'), maintenanceController.createRequest);
router.get('/', authorizeRole('homeowner', 'technician'), maintenanceController.getRequests);
router.get('/:id', authorizeRole('homeowner', 'technician'), maintenanceController.getRequest);
router.post('/:id/rate', authorizeRole('homeowner'), maintenanceController.rateService);
router.get('/tank/:tankId/history', authorizeRole('homeowner'), maintenanceController.getTankMaintenanceHistory);

// Technician routes
router.post('/:id/accept', authorizeRole('technician'), maintenanceController.acceptJob);
router.post('/:id/complete', authorizeRole('technician'), maintenanceController.completeJob);
router.get('/technician/jobs', authorizeRole('technician'), maintenanceController.getTechnicianJobs);

// Manager/Admin routes
router.post('/:id/assign', authorizeRole('fleet_manager', 'admin'), maintenanceController.assignTechnician);
router.get('/technicians/available', authorizeRole('homeowner', 'fleet_manager', 'admin'), maintenanceController.getAvailableTechnicians);

module.exports = router;
