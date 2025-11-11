import React, { useEffect, useState, useContext } from 'react';
import { orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiTrendingUp, FiDollarSign, FiMapPin, FiClock } from 'react-icons/fi';

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    completedToday: 0,
    totalEarnings: 0,
    averageRating: 0,
    acceptedOrders: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      setOrders(response.data);

      // Calculate stats
      const completed = response.data.filter(o => o.status === 'completed').length;
      const accepted = response.data.filter(o => ['assigned', 'in_transit', 'delivering'].includes(o.status)).length;
      const totalEarnings = response.data
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.totalPrice * 0.7), 0);

      setStats({
        completedToday: completed,
        totalEarnings: totalEarnings.toFixed(2),
        averageRating: 4.8,
        acceptedOrders: accepted
      });
    } catch (err) {
      console.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Driver Dashboard</h1>
        <p>Welcome, {user?.firstName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiTrendingUp className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Completed Today</p>
            <p className="stat-value">{stats.completedToday}</p>
          </div>
        </div>

        <div className="stat-card">
          <FiDollarSign className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Total Earnings</p>
            <p className="stat-value">{stats.totalEarnings} SAR</p>
          </div>
        </div>

        <div className="stat-card">
          <FiTrendingUp className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Average Rating</p>
            <p className="stat-value">{stats.averageRating} ⭐</p>
          </div>
        </div>

        <div className="stat-card">
          <FiClock className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Active Orders</p>
            <p className="stat-value">{stats.acceptedOrders}</p>
          </div>
        </div>
      </div>

      <div className="orders-section">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders yet. Check back soon!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-item">
                <div className="order-header">
                  <h3>{order.orderId}</h3>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="order-info">
                  <p><FiMapPin size={16} /> {order.litersRequested}L required</p>
                  <p>Price: {order.totalPrice} SAR</p>
                  {order.driverRating && <p>Rating: {order.driverRating} ⭐</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
