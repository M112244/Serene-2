import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiHome } from 'react-icons/fi';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (user?.userType) {
      case 'homeowner':
        return [
          { label: 'Dashboard', path: '/homeowner/dashboard' },
          { label: 'Tanks', path: '/homeowner/tanks' },
          { label: 'Orders', path: '/homeowner/orders' },
          { label: 'Maintenance', path: '/homeowner/maintenance' }
        ];
      case 'driver':
        return [
          { label: 'Dashboard', path: '/driver/dashboard' },
          { label: 'Available Orders', path: '/driver/orders' },
          { label: 'Earnings', path: '/driver/earnings' }
        ];
      case 'technician':
        return [
          { label: 'Dashboard', path: '/technician/dashboard' },
          { label: 'Jobs', path: '/technician/jobs' }
        ];
      case 'fleet_manager':
        return [
          { label: 'Dashboard', path: '/manager/dashboard' },
          { label: 'Drivers', path: '/manager/drivers' },
          { label: 'Orders', path: '/manager/orders' },
          { label: 'Analytics', path: '/manager/analytics' }
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Users', path: '/admin/users' },
          { label: 'Analytics', path: '/admin/analytics' },
          { label: 'Settings', path: '/admin/settings' }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FiHome /> NAVA/MIYA
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <Link to={link.path} className="nav-link" onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <>
              <li className="nav-item user-info">
                <span className="user-name">{user?.firstName}</span>
              </li>
              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
