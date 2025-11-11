import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { maintenanceAPI, tankAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle, FiAlertCircle, FiCalendar, FiDollarSign } from 'react-icons/fi';

const MaintenanceRequestPage = () => {
  const { tankId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [tank, setTank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    serviceType: 'tank_cleaning',
    description: '',
    priority: 'routine',
    preferredDateTime: ''
  });

  const serviceTypes = [
    { value: 'leak_detection', label: 'Leak Detection' },
    { value: 'tank_cleaning', label: 'Tank Cleaning' },
    { value: 'sensor_config', label: 'Sensor Configuration' },
    { value: 'water_quality_test', label: 'Water Quality Testing' },
    { value: 'pipe_inspection', label: 'Pipe Inspection' },
    { value: 'pump_maintenance', label: 'Pump Maintenance' },
    { value: 'filter_replacement', label: 'Filter Replacement' },
    { value: 'tank_coating', label: 'Tank Coating' }
  ];

  useEffect(() => {
    if (tankId) {
      fetchTank();
    }
  }, [tankId]);

  const fetchTank = async () => {
    try {
      const response = await tankAPI.getTank(tankId);
      setTank(response.data);
    } catch (err) {
      setError('Failed to load tank information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.description.trim()) {
      setError('Please describe the issue');
      return;
    }

    try {
      setSubmitting(true);
      await maintenanceAPI.createRequest({
        tankId,
        serviceType: formData.serviceType,
        description: formData.description,
        priority: formData.priority,
        preferredDateTime: formData.preferredDateTime ? new Date(formData.preferredDateTime) : null
      });

      setSuccess('Maintenance request submitted successfully!');
      setTimeout(() => {
        navigate('/homeowner/maintenance');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <h1>Request Maintenance Service</h1>
      {tank && <p className="text-muted">For tank: {tank.name}</p>}

      {error && <div className="error-alert"><FiAlertCircle /> {error}</div>}
      {success && <div className="success-alert"><FiCheckCircle /> {success}</div>}

      <form onSubmit={handleSubmit} className="maintenance-form">
        <div className="form-section">
          <h2>Service Type</h2>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            disabled={submitting}
            className="form-select"
          >
            {serviceTypes.map(service => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <h2>Describe the Issue</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please describe what needs to be fixed or serviced..."
            rows="5"
            disabled={submitting}
            className="form-textarea"
          />
        </div>

        <div className="form-row-2">
          <div className="form-section">
            <h2>Priority</h2>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              disabled={submitting}
              className="form-select"
            >
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="form-section">
            <h2>Preferred Date & Time</h2>
            <div className="input-with-icon">
              <FiCalendar />
              <input
                type="datetime-local"
                name="preferredDateTime"
                value={formData.preferredDateTime}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-full"
            onClick={() => navigate('/homeowner/maintenance')}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="info-card">
        <h3>Service Information</h3>
        <ul>
          <li><FiDollarSign /> Pricing varies by service type</li>
          <li><FiCalendar /> Typically completed within 24-48 hours</li>
          <li>All work includes warranty</li>
          <li>Professional, certified technicians</li>
        </ul>
      </div>
    </div>
  );
};

export default MaintenanceRequestPage;
