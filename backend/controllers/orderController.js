const Order = require('../models/Order');
const Tank = require('../models/Tank');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');

// Generate order ID
const generateOrderId = () => {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 9);
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { tankId, tankerSize, paymentMethod } = req.body;

    const tank = await Tank.findById(tankId);
    if (!tank) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    if (tank.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Calculate pricing
    const basePrice = 50; // SAR per liter
    const pricePerLiter = basePrice / 100;
    const baseTotal = tankerSize * pricePerLiter;
    const distanceFee = 30; // Flat fee for simplicity
    const taxAmount = (baseTotal + distanceFee) * 0.15; // 15% VAT
    const totalPrice = baseTotal + distanceFee + taxAmount;

    const order = new Order({
      orderId: generateOrderId(),
      homeownerId: req.user.id,
      tankId: tankId,
      litersRequested: tankerSize,
      tankerSize: tankerSize,
      basePrice: baseTotal,
      distanceFee: distanceFee,
      taxAmount: taxAmount,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      status: 'pending',
      deliveryAddress: tank.homeownerId,
      estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hour estimate
    });

    await order.save();

    // Create notification
    await Notification.create({
      userId: req.user.id,
      title: 'Order Created',
      message: `Water delivery order ${order.orderId} created for ${tankerSize}L`,
      type: 'order'
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for homeowner
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ homeownerId: req.user.id })
      .populate('tankId')
      .populate('driverId', 'firstName lastName phone profileImage')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('tankId')
      .populate('driverId', 'firstName lastName phone profileImage');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.homeownerId.toString() !== req.user.id && order.driverId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept order (driver)
exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be accepted' });
    }

    order.driverId = req.user.id;
    order.status = 'assigned';
    order.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      notes: 'Driver accepted order'
    });
    await order.save();

    // Notify homeowner
    await Notification.create({
      userId: order.homeownerId,
      title: 'Driver Assigned',
      message: 'A driver has been assigned to your order',
      type: 'order',
      relatedOrderId: order._id
    });

    res.json({ message: 'Order accepted', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, latitude, longitude, eta, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      notes: notes || ''
    });

    if (latitude && longitude) {
      order.trackingUpdates.push({
        status: status,
        latitude,
        longitude,
        timestamp: new Date(),
        eta: eta || order.estimatedDeliveryTime
      });
    }

    if (status === 'in_transit') {
      await Notification.create({
        userId: order.homeownerId,
        title: 'Driver En Route',
        message: 'Your water delivery is on the way',
        type: 'order',
        relatedOrderId: order._id
      });
    } else if (status === 'delivering') {
      await Notification.create({
        userId: order.homeownerId,
        title: 'Driver Arrived',
        message: 'Your water delivery driver has arrived',
        type: 'order',
        relatedOrderId: order._id
      });
    }

    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete order with proof of delivery
exports.completeOrder = async (req, res) => {
  try {
    const { actualLitersDelivered, tankFillingPhoto, meterPhoto, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.driverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'completed';
    order.actualLitersDelivered = actualLitersDelivered;
    order.actualDeliveryTime = new Date();
    order.proofOfDelivery = {
      tankFillingPhoto,
      meterPhoto,
      notes
    };
    order.paymentStatus = 'completed';

    order.statusHistory.push({
      status: 'completed',
      timestamp: new Date(),
      notes: 'Delivery completed'
    });

    // Update tank level
    const tank = await Tank.findById(order.tankId);
    tank.currentLevel += actualLitersDelivered;
    tank.lastRefillDate = new Date();
    tank.totalRefills += 1;
    await tank.save();

    // Process driver payment
    const wallet = await Wallet.findOne({ userId: req.user.id });
    const driverEarnings = order.totalPrice * 0.7; // Driver gets 70%
    wallet.balance += driverEarnings;
    wallet.transactions.push({
      transactionId: order.orderId,
      type: 'credit',
      amount: driverEarnings,
      description: 'Delivery earnings',
      relatedOrderId: order._id,
      timestamp: new Date()
    });
    await wallet.save();

    await order.save();

    // Notify homeowner
    await Notification.create({
      userId: order.homeownerId,
      title: 'Delivery Completed',
      message: `Your water delivery of ${actualLitersDelivered}L has been completed`,
      type: 'order',
      relatedOrderId: order._id
    });

    res.json({
      message: 'Order completed successfully',
      order,
      driverEarnings: driverEarnings.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate order
exports.rateOrder = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.driverRating = rating;
    order.driverReview = review;
    await order.save();

    res.json({ message: 'Rating submitted', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.homeownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['delivering', 'completed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }

    order.status = 'cancelled';
    await order.save();

    // Refund if payment was processed
    if (order.paymentStatus === 'completed') {
      const wallet = await Wallet.findOne({ userId: req.user.id });
      wallet.balance += order.totalPrice;
      wallet.transactions.push({
        transactionId: order.orderId,
        type: 'refund',
        amount: order.totalPrice,
        description: 'Order cancellation refund',
        timestamp: new Date()
      });
      await wallet.save();
    }

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available drivers
exports.getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await User.find({
      userType: 'driver',
      status: 'active'
    }).select('firstName lastName phone profileImage');

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
