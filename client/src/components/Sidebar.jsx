import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/admin.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Delivery Persons', path: '/admin/delivery', icon: '🚚' },
    { name: 'Canteen Staff', path: '/admin/staff', icon: '👥' },
    { name: 'Token Assignment', path: '/admin/tokens', icon: '🔑' },
    { name: 'Staff ID Assignment', path: '/admin/staff-id', icon: '🏷️' },
    { name: 'Orders Monitoring', path: '/admin/orders', icon: '📦' },
    { name: 'Delivery Tracking', path: '/admin/tracking', icon: '📍' },
    { name: 'Discounts', path: '/admin/discounts', icon: '💰' },
    { name: 'Budgets', path: '/admin/budgets', icon: '📉' },
    { name: 'Notifications', path: '/admin/notifications', icon: '🔔' },
    { name: 'Reports', path: '/admin/reports', icon: '📑' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { name: 'Feedback', path: '/admin/feedback', icon: '⭐' }
  ];

  return (
    <aside className="admin-sidebar" style={{ backgroundColor: 'var(--admin-primary)', color: 'white' }}>
      <div className="admin-sidebar-header" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: 'var(--admin-secondary)', margin: 0 }}>UniMeals Admin</h2>
      </div>
      <nav className="admin-sidebar-nav" style={{ padding: '1rem 0' }}>
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              padding: '0.75rem 1.5rem',
              color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              backgroundColor: isActive ? 'var(--admin-secondary)' : 'transparent',
              marginBottom: '0.25rem',
              transition: 'background-color 0.2s',
              borderLeft: isActive ? '4px solid white' : '4px solid transparent'
            })}
          >
            <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
