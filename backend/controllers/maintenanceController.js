const MaintenanceRequest = require('../models/MaintenanceRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

const generateRequestId = () => {
  return 'MAINT' + Date.now() + Math.random().toString(36).substr(2, 9);
};

// Create maintenance request
exports.createRequest = async (req, res) => {
  try {
    const { tankId, serviceType, description, priority, preferredDateTime } = req.body;

    const request = new MaintenanceRequest({
      requestId: generateRequestId(),
      homeownerId: req.user.id,
      tankId: tankId,
      serviceType,
      description,
      priority,
      preferredDateTime,
      status: 'pending'
    });

    await request.save();

    // Create notification
    await Notification.create({
      userId: req.user.id,
      title: 'Maintenance Request Created',
      message: `Your ${serviceType} maintenance request has been submitted`,
      type: 'maintenance',
      relatedMaintenanceId: request._id
    });

    res.status(201).json({ message: 'Maintenance request created', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all maintenance requests for homeowner
exports.getRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ homeownerId: req.user.id })
      .populate('technicianId', 'firstName lastName phone profileImage')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get request by ID
exports.getRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('technicianId', 'firstName lastName phone profileImage');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.homeownerId.toString() !== req.user.id && request.technicianId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available technicians
exports.getAvailableTechnicians = async (req, res) => {
  try {
    const { serviceType } = req.query;

    const query = {
      userType: 'technician',
      status: 'active'
    };

    const technicians = await User.find(query)
      .select('firstName lastName phone profileImage');

    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign technician (admin/manager)
exports.assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.technicianId = technicianId;
    request.status = 'assigned';
    await request.save();

    // Notify technician
    await Notification.create({
      userId: technicianId,
      title: 'New Job Assigned',
      message: `You have been assigned a ${request.serviceType} job`,
      type: 'maintenance',
      relatedMaintenanceId: request._id
    });

    res.json({ message: 'Technician assigned', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept job (technician)
exports.acceptJob = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.technicianId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = 'in_progress';
    request.actualStartTime = new Date();
    await request.save();

    // Notify homeowner
    await Notification.create({
      userId: request.homeownerId,
      title: 'Technician En Route',
      message: 'Your maintenance technician is on the way',
      type: 'maintenance',
      relatedMaintenanceId: request._id
    });

    res.json({ message: 'Job accepted', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete job (technician)
exports.completeJob = async (req, res) => {
  try {
    const { workPerformed, finalPhotos, finalNotes, actualCost, partsUsed } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.technicianId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = 'completed';
    request.actualEndTime = new Date();
    request.workPerformed = workPerformed;
    request.finalPhotos = finalPhotos;
    request.finalNotes = finalNotes;
    request.actualCost = actualCost;
    request.partsUsed = partsUsed;
    request.warrantyExpiry = new Date(Date.now() + request.warrantyPeriod * 24 * 60 * 60 * 1000);

    await request.save();

    // Notify homeowner
    await Notification.create({
      userId: request.homeownerId,
      title: 'Service Completed',
      message: `Your ${request.serviceType} maintenance has been completed`,
      type: 'maintenance',
      relatedMaintenanceId: request._id
    });

    res.json({ message: 'Job completed', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate service
exports.rateService = async (req, res) => {
  try {
    const { rating, review, serviceQuality } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.technicianRating = rating;
    request.technicianReview = review;
    request.serviceQuality = serviceQuality;
    await request.save();

    res.json({ message: 'Rating submitted', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get technician jobs
exports.getTechnicianJobs = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ technicianId: req.user.id })
      .populate('homeownerId', 'firstName lastName phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get maintenance history for tank
exports.getTankMaintenanceHistory = async (req, res) => {
  try {
    const { tankId } = req.params;

    const requests = await MaintenanceRequest.find({ tankId })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
