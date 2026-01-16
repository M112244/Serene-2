import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiBell, FiTruck, FiTool, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const NotificationsPage = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock notifications
    setNotifications([
      {
        id: 1,
        type: 'order',
        title: 'Order Completed',
        message: 'Your water delivery order ORD001 has been completed',
        read: false,
        date: new Date(),
        icon: FiTruck
      },
      {
        id: 2,
        type: 'maintenance',
        title: 'Maintenance Scheduled',
        message: 'Your tank cleaning is scheduled for tomorrow at 2:00 PM',
        read: false,
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: FiTool
      },
      {
        id: 3,
        type: 'alert',
        title: 'Low Water Level',
        message: 'Tank "Main Tank" is running low (25% remaining)',
        read: true,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        icon: FiAlertCircle
      },
      {
        id: 4,
        type: 'system',
        title: 'Payment Received',
        message: 'Payment of 2,500 SAR received for completed delivery',
        read: true,
        date: new Date(Date.now() - 48 * 60 * 60 * 1000),
        icon: FiCheckCircle
      }
    ]);
  }, []);

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type) => {
    switch (type) {
      case 'order':
        return '#3b82f6';
      case 'maintenance':
        return '#8b5cf6';
      case 'alert':
        return '#ef4444';
      case 'system':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="page-container">
      <div className="notifications-header">
        <h1>
          <FiBell /> Notifications
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </h1>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === 'order' ? 'active' : ''}`}
          onClick={() => setFilter('order')}
        >
          Orders
        </button>
        <button
          className={`filter-tab ${filter === 'maintenance' ? 'active' : ''}`}
          onClick={() => setFilter('maintenance')}
        >
          Maintenance
        </button>
        <button
          className={`filter-tab ${filter === 'alert' ? 'active' : ''}`}
          onClick={() => setFilter('alert')}
        >
          Alerts
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <FiBell size={48} />
            <p>No notifications</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              style={{ borderLeftColor: getTypeColor(notification.type) }}
            >
              <div className="notification-icon" style={{ color: getTypeColor(notification.type) }}>
                {notification.icon && <notification.icon size={24} />}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-type">
                    {getTypeLabel(notification.type)}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">
                  {notification.date.toLocaleTimeString('en-SA', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: 'short'
                  })}
                </p>
              </div>
              {!notification.read && <div className="notification-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
