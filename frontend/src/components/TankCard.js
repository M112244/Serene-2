import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiDroplet, FiTrendingDown } from 'react-icons/fi';

const TankCard = ({ tank }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#3b82f6';
      case 'low':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      excellent: 'Excellent',
      good: 'Good',
      low: 'Low',
      critical: 'Critical'
    };
    return statusMap[status] || 'Unknown';
  };

  const percentage = tank.lastReading ? (tank.lastReading.percentage || 0).toFixed(0) : 0;

  return (
    <div className="tank-card">
      <div className="tank-header">
        <h3>{tank.name}</h3>
        <span
          className="status-badge"
          style={{
            backgroundColor: getStatusColor(tank.lastReading?.status || 'good')
          }}
        >
          {getStatusText(tank.lastReading?.status || 'good')}
        </span>
      </div>

      <div className="tank-info">
        <div className="info-row">
          <span className="info-label">
            <FiDroplet /> Current Level
          </span>
          <span className="info-value">
            {tank.currentLevel}/{tank.capacity}L
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: getStatusColor(tank.lastReading?.status || 'good')
            }}
          />
        </div>

        <div className="percentage-text">{percentage}%</div>

        <div className="info-row">
          <span className="info-label">
            <FiTrendingDown /> Daily Consumption
          </span>
          <span className="info-value">~{tank.dailyConsumption || 0}L/day</span>
        </div>

        <div className="info-row">
          <span className="info-label">Location</span>
          <span className="info-value">{tank.location}</span>
        </div>

        {tank.estimatedDaysRemaining && (
          <div className="info-row">
            <span className="info-label">Days Remaining</span>
            <span className="info-value">{tank.estimatedDaysRemaining} days</span>
          </div>
        )}

        {tank.lastReading?.status === 'critical' && (
          <div className="alert-banner">
            <FiAlertTriangle /> Water running critically low
          </div>
        )}
      </div>

      <div className="tank-actions">
        <Link to={`/homeowner/tanks/${tank._id}`} className="btn btn-primary">
          View Details
        </Link>
        <Link to={`/homeowner/refill/${tank._id}`} className="btn btn-secondary">
          Order Refill
        </Link>
      </div>
    </div>
  );
};

export default TankCard;
