import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiUsers, FiTruck, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

const FleetManagerDashboard = () => {
  const [stats, setStats] = useState({
    activeDrivers: 0,
    totalOrders: 0,
    completedToday: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Fetch manager data
    setStats({
      activeDrivers: 12,
      totalOrders: 145,
      completedToday: 28,
      totalRevenue: 15420,
      averageRating: 4.7
    });

    setOrders([
      { id: 'ORD001', customer: 'Ahmed Al-Dosari', liters: 5000, status: 'completed', driver: 'Mohammed', time: '2 hours ago' },
      { id: 'ORD002', customer: 'Fatima Al-Shehri', liters: 3000, status: 'in_transit', driver: 'Ali', time: '30 mins ago' },
      { id: 'ORD003', customer: 'Hassan Al-Otaibi', liters: 1000, status: 'pending', driver: 'Unassigned', time: '5 mins ago' }
    ]);

    setDrivers([
      { id: 1, name: 'Mohammed Ahmed', rating: 4.9, orders: 45, earnings: 3500, status: 'online' },
      { id: 2, name: 'Ali Hassan', rating: 4.7, orders: 38, earnings: 3200, status: 'online' },
      { id: 3, name: 'Ibrahim Sultan', rating: 4.5, orders: 32, earnings: 2800, status: 'offline' }
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Fleet Manager Dashboard</h1>
        <p>Fleet Operations & Performance Tracking</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiUsers className="stat-icon" style={{ color: '#3b82f6' }} />
          <div className="stat-content">
            <p className="stat-label">Active Drivers</p>
            <p className="stat-value">{stats.activeDrivers}</p>
          </div>
        </div>

        <div className="stat-card">
          <FiTruck className="stat-icon" style={{ color: '#10b981' }} />
          <div className="stat-content">
            <p className="stat-label">Orders Today</p>
            <p className="stat-value">{stats.completedToday}</p>
          </div>
        </div>

        <div className="stat-card">
          <FiDollarSign className="stat-icon" style={{ color: '#8b5cf6' }} />
          <div className="stat-content">
            <p className="stat-label">Revenue Today</p>
            <p className="stat-value">{stats.totalRevenue} SAR</p>
          </div>
        </div>

        <div className="stat-card">
          <FiTrendingUp className="stat-icon" style={{ color: '#f59e0b' }} />
          <div className="stat-content">
            <p className="stat-label">Avg Rating</p>
            <p className="stat-value">{stats.averageRating} ⭐</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="card">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-row">
                <div>
                  <p className="order-id">{order.id}</p>
                  <p className="order-customer">{order.customer}</p>
                </div>
                <div>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="order-liters">{order.liters}L</p>
                  <p className="order-time">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Top Drivers</h2>
          <div className="drivers-list">
            {drivers.map(driver => (
              <div key={driver.id} className="driver-row">
                <div className="driver-info">
                  <p className="driver-name">{driver.name}</p>
                  <p className="driver-stats">
                    {driver.orders} orders • {driver.earnings} SAR
                  </p>
                </div>
                <div className="driver-status">
                  <span className={`status-dot ${driver.status}`} />
                  <p className="driver-rating">{driver.rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetManagerDashboard;
