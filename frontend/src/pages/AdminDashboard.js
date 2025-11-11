import React, { useEffect, useState } from 'react';
import { FiUsers, FiTrendingUp, FiAlertCircle, FiSettings, FiDollarSign, FiBarChart3 } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    platformUptime: 0,
    pendingVerifications: 0
  });

  const [systemStatus, setSystemStatus] = useState({
    database: 'operational',
    api: 'operational',
    notifications: 'operational',
    payments: 'operational'
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    setStats({
      totalUsers: 1250,
      activeUsers: 456,
      totalRevenue: 128500,
      platformUptime: 99.98,
      pendingVerifications: 12
    });

    setRecentActivity([
      { id: 1, type: 'user_registered', message: 'New homeowner registered: Ahmed Al-Dosari', time: '2 mins ago' },
      { id: 2, type: 'order_completed', message: 'Order ORD001 completed successfully', time: '5 mins ago' },
      { id: 3, type: 'payment_received', message: 'Payment received: 2,500 SAR', time: '10 mins ago' },
      { id: 4, type: 'driver_verified', message: 'Driver Mohammed Ali verified', time: '15 mins ago' },
      { id: 5, type: 'issue_reported', message: 'Customer complaint: Late delivery', time: '20 mins ago' }
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>System Administration</h1>
        <p>Platform Monitoring & Management</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiUsers className="stat-icon" style={{ color: '#3b82f6' }} />
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.totalUsers}</p>
            <p className="stat-subtext">{stats.activeUsers} active</p>
          </div>
        </div>

        <div className="stat-card">
          <FiDollarSign className="stat-icon" style={{ color: '#10b981' }} />
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">{(stats.totalRevenue / 1000).toFixed(0)}K SAR</p>
            <p className="stat-subtext">This month</p>
          </div>
        </div>

        <div className="stat-card">
          <FiBarChart3 className="stat-icon" style={{ color: '#8b5cf6' }} />
          <div className="stat-content">
            <p className="stat-label">Platform Uptime</p>
            <p className="stat-value">{stats.platformUptime}%</p>
            <p className="stat-subtext">Last 30 days</p>
          </div>
        </div>

        <div className="stat-card alert">
          <FiAlertCircle className="stat-icon" style={{ color: '#ef4444' }} />
          <div className="stat-content">
            <p className="stat-label">Pending Verifications</p>
            <p className="stat-value">{stats.pendingVerifications}</p>
            <p className="stat-subtext">User registrations</p>
          </div>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="card">
          <h2>System Status</h2>
          <div className="system-status">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="status-row">
                <span className="status-label">
                  {service.charAt(0).toUpperCase() + service.slice(1).replace('_', ' ')}
                </span>
                <span className={`status-indicator status-${status}`}>
                  <span className="status-dot" /> {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'user_registered' && <FiUsers size={18} />}
                  {activity.type === 'order_completed' && <FiTrendingUp size={18} />}
                  {activity.type === 'payment_received' && <FiDollarSign size={18} />}
                  {activity.type === 'issue_reported' && <FiAlertCircle size={18} />}
                  {activity.type === 'driver_verified' && <FiTrendingUp size={18} />}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="admin-actions">
          <button className="btn btn-primary">
            <FiUsers size={18} /> Manage Users
          </button>
          <button className="btn btn-secondary">
            <FiSettings size={18} /> System Settings
          </button>
          <button className="btn btn-secondary">
            <FiBarChart3 size={18} /> View Analytics
          </button>
          <button className="btn btn-danger">
            <FiAlertCircle size={18} /> Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
