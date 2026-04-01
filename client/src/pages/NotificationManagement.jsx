import React, { useState } from 'react';

const Notifications = () => {
  const [notifications] = useState([
    { id: 1, title: 'System Maintenance', message: 'Server will be down for 2 hours on Sunday.', recipient: 'All Users', date: '2023-10-26 10:00 AM' },
    { id: 2, name: 'New Menu Items Added', message: 'Check out the new healthy section in the canteen.', recipient: 'Student', date: '2023-10-25 02:30 PM' },
    { id: 3, name: 'Delivery Route Update', message: 'New guidelines for South Wing deliveries.', recipient: 'Delivery', date: '2023-10-24 09:15 AM' },
  ]);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Notifications Management</h1>
        <button className="admin-btn admin-btn-primary">+ Create Notification</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Create Form */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--admin-text-main)' }}>Send New Notification</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="admin-form-group">
              <label className="admin-form-label">Title</label>
              <input type="text" className="admin-form-input" placeholder="Notification Title" />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Recipient Group</label>
              <select className="admin-form-input">
                <option value="All">All Users</option>
                <option value="Student">Students Only</option>
                <option value="Staff">Staff Only</option>
                <option value="Delivery">Delivery Staff Only</option>
                <option value="Specific">Specific User</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Message</label>
              <textarea 
                className="admin-form-input" 
                rows="4" 
                placeholder="Type your message here..."
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            <button type="button" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>Send Notification</button>
          </form>
        </div>

        {/* List */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--admin-text-main)' }}>Recent Notifications Sent</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map(notif => (
              <div key={notif.id} style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '8px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--admin-text-main)' }}>{notif.title || notif.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{notif.date}</span>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
                  {notif.message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="admin-badge admin-badge-primary">To: {notif.recipient}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="admin-btn admin-btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                    <button className="admin-btn admin-btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
