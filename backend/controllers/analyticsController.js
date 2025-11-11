const Order = require('../models/Order');
const Tank = require('../models/Tank');
const User = require('../models/User');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// Get homeowner analytics
exports.getHomeownerAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const orders = await Order.find({
      homeownerId: req.user.id,
      createdAt: dateFilter
    });

    const tanks = await Tank.find({ homeownerId: req.user.id });

    // Calculate stats
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const totalLiters = orders.reduce((sum, o) => sum + (o.actualLitersDelivered || 0), 0);

    // Daily consumption
    const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0);
    const averageFill = tanks.length > 0
      ? tanks.reduce((sum, t) => sum + (t.lastReading?.percentage || 0), 0) / tanks.length
      : 0;

    res.json({
      summary: {
        totalOrders,
        completedOrders,
        totalSpent: totalSpent.toFixed(2),
        averageOrderValue: averageOrderValue.toFixed(2),
        totalLiters,
        totalCapacity,
        averageFill: averageFill.toFixed(2),
        activeTanks: tanks.length
      },
      orders: orders.map(o => ({
        date: o.createdAt,
        liters: o.litersRequested,
        cost: o.totalPrice,
        status: o.status
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get driver analytics
exports.getDriverAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const orders = await Order.find({
      driverId: req.user.id,
      createdAt: dateFilter
    });

    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.totalPrice * 0.7), 0);
    const averageRating = completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => sum + (o.driverRating || 0), 0) / completedOrders.length
      : 0;

    res.json({
      summary: {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalEarnings: totalEarnings.toFixed(2),
        averageRating: averageRating.toFixed(1),
        acceptanceRate: orders.length > 0 ? ((completedOrders.length / orders.length) * 100).toFixed(1) : 0
      },
      earnings: completedOrders.map(o => ({
        date: o.completedAt || o.updatedAt,
        amount: (o.totalPrice * 0.7).toFixed(2),
        orderId: o.orderId
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get fleet manager analytics
exports.getFleetAnalytics = async (req, res) => {
  try {
    const drivers = await User.find({ userType: 'driver', status: 'active' });
    const orders = await Order.find({});

    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    const driverStats = drivers.map(driver => {
      const driverOrders = completedOrders.filter(o => o.driverId?.toString() === driver._id.toString());
      const earnings = driverOrders.reduce((sum, o) => sum + (o.totalPrice * 0.7), 0);
      const rating = driverOrders.length > 0
        ? driverOrders.reduce((sum, o) => sum + (o.driverRating || 0), 0) / driverOrders.length
        : 0;

      return {
        driverId: driver._id,
        name: driver.firstName + ' ' + driver.lastName,
        ordersCompleted: driverOrders.length,
        earnings: earnings.toFixed(2),
        rating: rating.toFixed(1)
      };
    });

    res.json({
      summary: {
        totalDrivers: drivers.length,
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalRevenue: totalRevenue.toFixed(2),
        averageOrderValue: (totalRevenue / completedOrders.length).toFixed(2)
      },
      drivers: driverStats.sort((a, b) => parseFloat(b.earnings) - parseFloat(a.earnings))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get platform analytics
exports.getPlatformAnalytics = async (req, res) => {
  try {
    const users = await User.find({});
    const orders = await Order.find({});
    const maintenance = await MaintenanceRequest.find({});

    const usersByType = {};
    users.forEach(u => {
      usersByType[u.userType] = (usersByType[u.userType] || 0) + 1;
    });

    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    res.json({
      users: usersByType,
      orders: {
        total: orders.length,
        completed: completedOrders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      },
      maintenance: {
        total: maintenance.length,
        completed: maintenance.filter(m => m.status === 'completed').length,
        pending: maintenance.filter(m => m.status === 'pending').length
      },
      revenue: totalRevenue.toFixed(2),
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
