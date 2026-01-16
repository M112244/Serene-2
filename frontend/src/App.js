import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomeownerDashboard from './pages/HomeownerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import OrderRefill from './pages/OrderRefill';
import MaintenanceRequestPage from './pages/MaintenanceRequestPage';
import FleetManagerDashboard from './pages/FleetManagerDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Styles
import './styles/index.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/components.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.userType)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Homeowner Routes */}
        <Route
          path="/homeowner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['homeowner']}>
              <HomeownerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeowner/refill/:tankId"
          element={
            <ProtectedRoute allowedRoles={['homeowner']}>
              <OrderRefill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeowner/maintenance/:tankId"
          element={
            <ProtectedRoute allowedRoles={['homeowner']}>
              <MaintenanceRequestPage />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Technician Routes */}
        <Route
          path="/technician/dashboard"
          element={
            <ProtectedRoute allowedRoles={['technician']}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fleet Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={['fleet_manager']}>
              <FleetManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/homeowner/dashboard" /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
