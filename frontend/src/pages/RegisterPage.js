import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const RegisterPage = () => {
  const { register, verifyOTP, loading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'homeowner',
    language: 'en'
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType,
        language: formData.language
      });

      setUserId(result.user.id);
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const result = await verifyOTP(userId, otp);
      const userType = result.user.userType;

      const redirectMap = {
        homeowner: '/homeowner/dashboard',
        driver: '/driver/dashboard',
        technician: '/technician/dashboard',
        fleet_manager: '/manager/dashboard',
        admin: '/admin/dashboard'
      };

      navigate(redirectMap[userType] || '/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join NAVA/MIYA</h1>
          <p>Water Delivery Management Platform</p>
        </div>

        {step === 1 ? (
          <>
            {(error || authError) && (
              <div className="error-alert">
                <FiAlertCircle /> {error || authError}
              </div>
            )}

            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <div className="input-with-icon">
                    <FiUser />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-with-icon">
                    <FiUser />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <FiMail />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <div className="input-with-icon">
                  <FiPhone />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966..."
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="homeowner">Homeowner/Resident</option>
                  <option value="driver">Water Tanker Driver</option>
                  <option value="technician">Maintenance Technician</option>
                  <option value="fleet_manager">Fleet Manager</option>
                </select>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <FiLock />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 8 characters"
                    minLength="8"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <FiLock />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    minLength="8"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Continue'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="success-message">
              <FiCheckCircle /> Registration successful!
            </div>

            {error && (
              <div className="error-alert">
                <FiAlertCircle /> {error}
              </div>
            )}

            <form onSubmit={handleOTPVerification} className="auth-form">
              <p className="form-label">
                An OTP has been sent to your phone. Please enter it below.
              </p>

              <div className="form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  required
                  disabled={loading}
                  className="otp-input"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
