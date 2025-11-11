const Tank = require('../models/Tank');
const Notification = require('../models/Notification');

// Add new tank
exports.addTank = async (req, res) => {
  try {
    const { name, capacity, location, buildingType } = req.body;

    const tank = new Tank({
      homeownerId: req.user.id,
      name,
      capacity,
      location,
      buildingType
    });

    await tank.save();

    // Create notification
    await Notification.create({
      userId: req.user.id,
      title: 'Tank Added',
      message: `Tank "${name}" has been added successfully`,
      type: 'system'
    });

    res.status(201).json({ message: 'Tank added successfully', tank });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tanks for homeowner
exports.getTanks = async (req, res) => {
  try {
    const tanks = await Tank.find({ homeownerId: req.user.id });
    res.json(tanks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tank by ID
exports.getTank = async (req, res) => {
  try {
    const tank = await Tank.findById(req.params.id);
    if (!tank) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    if (tank.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(tank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tank
exports.updateTank = async (req, res) => {
  try {
    const { name, location, lowThreshold, autoRefillEnabled, autoRefillSize, buildingType } = req.body;

    const tank = await Tank.findById(req.params.id);
    if (!tank) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    if (tank.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(tank, { name, location, lowThreshold, autoRefillEnabled, autoRefillSize, buildingType });
    await tank.save();

    res.json({ message: 'Tank updated', tank });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calibrate tank sensor
exports.calibrateTank = async (req, res) => {
  try {
    const { emptyLevel, fullLevel } = req.body;

    const tank = await Tank.findById(req.params.id);
    if (!tank) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    if (tank.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    tank.calibrationData = {
      emptyLevel,
      fullLevel,
      calibratedAt: new Date()
    };
    tank.isCalibrated = true;
    await tank.save();

    await Notification.create({
      userId: req.user.id,
      title: 'Tank Calibrated',
      message: `Tank "${tank.name}" has been calibrated successfully`,
      type: 'system'
    });

    res.json({ message: 'Tank calibrated successfully', tank });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pair sensor with tank
exports.pairSensor = async (req, res) => {
  try {
    const { sensorId, sensorType } = req.body;

    const tank = await Tank.findById(req.params.id);
    if (!tank) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    if (tank.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    tank.sensorId = sensorId;
    tank.sensorType = sensorType;
    tank.sensorStatus = 'connected';
    await tank.save();

    res.json({ message: 'Sensor paired successfully', tank });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tank level (from sensor)
exports.updateTankLevel = async (req, res) => {
  try {
    const { sensorId, level } = req.body;

    const tank = await Tank.findOne({ sensorId });
    if (!tank) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    const percentage = (level / tank.capacity) * 100;
    let status = 'excellent';
    if (percentage < 30) status = 'critical';
    else if (percentage < 40) status = 'low';
    else if (percentage < 70) status = 'good';

    tank.currentLevel = level;
    tank.lastReading = {
      level,
      percentage,
      timestamp: new Date(),
      status
    };

    // Calculate estimated days remaining
    if (tank.dailyConsumption > 0) {
      tank.estimatedDaysRemaining = Math.ceil(level / tank.dailyConsumption);
    }

    await tank.save();

    // Check if low and send notification
    if (status === 'critical' || status === 'low') {
      await Notification.create({
        userId: tank.homeownerId,
        title: 'Low Water Alert',
        message: `Tank "${tank.name}" is running low (${percentage.toFixed(0)}%)`,
        type: 'alert',
        relatedOrderId: null
      });
    }

    res.json({ message: 'Tank level updated', tank });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tank dashboard summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const tanks = await Tank.find({ homeownerId: req.user.id });

    const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0);
    const totalCurrentLevel = tanks.reduce((sum, t) => sum + t.currentLevel, 0);
    const averagePercentage = totalCapacity > 0 ? (totalCurrentLevel / totalCapacity) * 100 : 0;

    const criticalTanks = tanks.filter(t => t.lastReading?.status === 'critical').length;
    const lowTanks = tanks.filter(t => t.lastReading?.status === 'low').length;

    res.json({
      totalTanks: tanks.length,
      totalCapacity,
      totalCurrentLevel,
      averagePercentage: averagePercentage.toFixed(2),
      criticalTanks,
      lowTanks,
      tanks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete tank
exports.deleteTank = async (req, res) => {
  try {
    const tank = await Tank.findById(req.params.id);
    if (!tank) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    if (tank.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Tank.deleteOne({ _id: req.params.id });

    res.json({ message: 'Tank deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
