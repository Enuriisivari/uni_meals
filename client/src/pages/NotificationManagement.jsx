import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NotificationForm from '../components/NotificationForm';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notification');
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSendNotification = async (notificationData) => {
    try {
      const response = await axios.post('/api/notification', notificationData);
      if (response.data.success) {
        toast.success(response.data.message || 'Notification sent successfully!');
        if (response.data.data) {
          setNotifications([response.data.data, ...notifications]);
        } else {
          fetchNotifications();
        }
      }
    } catch (error) {
      toast.error('Failed to send notification');
      console.error(error);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      const response = await axios.delete(`/api/notification/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Notification deleted');
        setNotifications(notifications.filter(n => n._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete notification');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Notifications Management</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Create Form */}
        <div className="admin-card">
          <NotificationForm onSave={handleSendNotification} />
        </div>

        {/* List */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--admin-text-main)' }}>Recent Notifications Sent</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.length > 0 ? notifications.map(notif => (
              <div key={notif._id} style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '8px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--admin-text-main)' }}>{notif.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
                  {notif.message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="admin-badge admin-badge-primary">To: {notif.recipientRole}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleDeleteNotification(notif._id)} className="admin-btn admin-btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Delete</button>
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--admin-text-muted)' }}>No recent notifications found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
