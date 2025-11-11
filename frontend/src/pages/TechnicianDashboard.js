import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle, FiClock, FiDollarSign, FiStar, FiMapPin } from 'react-icons/fi';

const TechnicianDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    completedJobs: 0,
    activeJobs: 0,
    totalEarnings: 0,
    averageRating: 0
  });

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    setStats({
      completedJobs: 18,
      activeJobs: 2,
      totalEarnings: 4500,
      averageRating: 4.8
    });

    setJobs([
      {
        id: 'MAINT001',
        customer: 'Ahmed Al-Dosari',
        service: 'Tank Cleaning',
        status: 'in_progress',
        address: 'Riyadh, Saudi Arabia',
        scheduledTime: '2:00 PM',
        estimatedDuration: '2 hours'
      },
      {
        id: 'MAINT002',
        customer: 'Fatima Al-Shehri',
        service: 'Sensor Configuration',
        status: 'pending',
        address: 'Jeddah, Saudi Arabia',
        scheduledTime: '4:00 PM',
        estimatedDuration: '1 hour'
      }
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Technician Dashboard</h1>
        <p>Welcome, {user?.firstName}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiCheckCircle className="stat-icon" style={{ color: '#10b981' }} />
          <div className="stat-content">
            <p className="stat-label">Completed Jobs</p>
            <p className="stat-value">{stats.completedJobs}</p>
          </div>
        </div>

        <div className="stat-card">
          <FiClock className="stat-icon" style={{ color: '#f59e0b' }} />
          <div className="stat-content">
            <p className="stat-label">Active Jobs</p>
            <p className="stat-value">{stats.activeJobs}</p>
          </div>
        </div>

        <div className="stat-card">
          <FiDollarSign className="stat-icon" style={{ color: '#3b82f6' }} />
          <div className="stat-content">
            <p className="stat-label">Total Earnings</p>
            <p className="stat-value">{stats.totalEarnings} SAR</p>
          </div>
        </div>

        <div className="stat-card">
          <FiStar className="stat-icon" style={{ color: '#8b5cf6' }} />
          <div className="stat-content">
            <p className="stat-label">Average Rating</p>
            <p className="stat-value">{stats.averageRating}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Your Assigned Jobs</h2>
        <div className="jobs-list">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3>{job.id}</h3>
                <span className={`status-badge status-${job.status}`}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>
              <div className="job-details">
                <div className="job-detail-row">
                  <p className="label">Service</p>
                  <p className="value">{job.service}</p>
                </div>
                <div className="job-detail-row">
                  <p className="label">Customer</p>
                  <p className="value">{job.customer}</p>
                </div>
                <div className="job-detail-row">
                  <FiMapPin size={16} />
                  <p className="value">{job.address}</p>
                </div>
                <div className="job-detail-row">
                  <p className="label">Scheduled</p>
                  <p className="value">{job.scheduledTime} ({job.estimatedDuration})</p>
                </div>
              </div>
              <div className="job-actions">
                {job.status === 'pending' && (
                  <button className="btn btn-primary">Accept Job</button>
                )}
                {job.status === 'in_progress' && (
                  <button className="btn btn-success">Complete Job</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
