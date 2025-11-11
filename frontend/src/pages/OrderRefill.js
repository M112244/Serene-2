import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tankAPI, orderAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle, FiAlertCircle, FiTruck } from 'react-icons/fi';

const OrderRefill = () => {
  const { tankId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [tank, setTank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    tankerSize: 3000,
    paymentMethod: 'wallet'
  });

  const sizes = [1000, 3000, 5000];
  const basePrice = 50; // SAR per liter

  useEffect(() => {
    fetchTank();
  }, [tankId]);

  const fetchTank = async () => {
    try {
      setLoading(true);
      if (tankId) {
        const response = await tankAPI.getTank(tankId);
        setTank(response.data);
      }
    } catch (err) {
      setError('Failed to load tank');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    const baseTotal = formData.tankerSize * (basePrice / 100);
    const distanceFee = 30;
    const tax = (baseTotal + distanceFee) * 0.15;
    return {
      base: baseTotal.toFixed(2),
      distance: distanceFee,
      tax: tax.toFixed(2),
      total: (baseTotal + distanceFee + tax).toFixed(2)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      const response = await orderAPI.createOrder({
        tankId,
        tankerSize: formData.tankerSize,
        paymentMethod: formData.paymentMethod
      });

      setSuccess('Order created successfully!');
      setTimeout(() => {
        navigate('/homeowner/orders');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!tank && !tankId) return <div className="error-alert">Tank not found</div>;

  const pricing = calculatePrice();

  return (
    <div className="page-container">
      <h1>Order Water Refill</h1>

      {error && <div className="error-alert"><FiAlertCircle /> {error}</div>}
      {success && <div className="success-alert"><FiCheckCircle /> {success}</div>}

      <div className="order-form-container">
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-section">
            <h2>Select Tanker Size</h2>
            <div className="size-selector">
              {sizes.map(size => (
                <label key={size} className="size-option">
                  <input
                    type="radio"
                    name="tankerSize"
                    value={size}
                    checked={formData.tankerSize === size}
                    onChange={(e) => setFormData({ ...formData, tankerSize: parseInt(e.target.value) })}
                  />
                  <span className="size-label">{size}L</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Pricing Details</h2>
            <div className="pricing-breakdown">
              <div className="price-row">
                <span>Base Price ({formData.tankerSize}L × 0.5 SAR/L)</span>
                <span>{pricing.base} SAR</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee</span>
                <span>{pricing.distance} SAR</span>
              </div>
              <div className="price-row">
                <span>VAT (15%)</span>
                <span>{pricing.tax} SAR</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>{pricing.total} SAR</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="form-select"
            >
              <option value="wallet">Wallet Balance</option>
              <option value="credit_card">Credit Card</option>
              <option value="stc_pay">STC Pay</option>
              <option value="apple_pay">Apple Pay</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Confirm Order'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={() => navigate('/homeowner/tanks')}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="order-info-card">
          <FiTruck size={32} />
          <h3>Quick Delivery</h3>
          <p>Your water will be delivered within 1-2 hours</p>
          <ul>
            <li>Real-time tracking</li>
            <li>Professional drivers</li>
            <li>Safe, hygienic delivery</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderRefill;
