import React from 'react';

const NotificationForm = () => {
  return (
    <div className="admin-form-group">
      <h3 style={{ marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Send Notification</h3>
      <label className="admin-form-label">Recipient</label>
      <select className="admin-form-input" style={{ marginBottom: '1rem' }}>
        <option value="all">All Users</option>
        <option value="staff">Staff Only</option>
        <option value="delivery">Delivery Persons Only</option>
      </select>
      <label className="admin-form-label">Message</label>
      <textarea className="admin-form-input" style={{ marginBottom: '1rem', minHeight: '100px' }}></textarea>
      <button className="admin-btn admin-btn-primary">Send Notification</button>
    </div>
  );
};

export default NotificationForm;
