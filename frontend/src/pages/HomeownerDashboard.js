import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { tankAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TankCard from '../components/TankCard';
import { FiTrendingUp, FiPlus, FiAlert, FiTruck, FiTool } from 'react-icons/fi';

const HomeownerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await tankAPI.getDashboardSummary();
      setSummary(response.data);
      setTanks(response.data.tanks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p>Here's your water management overview</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#3b82f6' }}>
              <FiTrendingUp size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Capacity</p>
              <p className="stat-value">{summary.totalCapacity}L</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#10b981' }}>
              <FiTrendingUp size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Current Level</p>
              <p className="stat-value">{summary.totalCurrentLevel}L</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#8b5cf6' }}>
              <FiTrendingUp size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Average Fill</p>
              <p className="stat-value">{summary.averagePercentage}%</p>
            </div>
          </div>

          {summary.criticalTanks > 0 && (
            <div className="stat-card alert">
              <div className="stat-icon" style={{ color: '#ef4444' }}>
                <FiAlert size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Critical Tanks</p>
                <p className="stat-value">{summary.criticalTanks}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="quick-actions">
        <Link to="/homeowner/tanks/new" className="action-button">
          <FiPlus /> Add Tank
        </Link>
        <Link to="/homeowner/orders" className="action-button">
          <FiTruck /> Order Refill
        </Link>
        <Link to="/homeowner/maintenance" className="action-button">
          <FiTool /> Maintenance
        </Link>
      </div>

      <div className="tanks-section">
        <div className="section-header">
          <h2>Your Tanks ({tanks.length})</h2>
        </div>

        {tanks.length === 0 ? (
          <div className="empty-state">
            <p>No tanks added yet</p>
            <Link to="/homeowner/tanks/new" className="btn btn-primary">
              Add Your First Tank
            </Link>
          </div>
        ) : (
          <div className="tanks-grid">
            {tanks.map(tank => (
              <TankCard key={tank._id} tank={tank} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeownerDashboard;
