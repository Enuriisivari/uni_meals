import React, { useState } from 'react';

const NotificationForm = ({ onSave }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    recipientRole: 'All', 
    message: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.message) {
      onSave(formData);
      setFormData({ title: '', recipientRole: 'All', message: '' });
    }
  };

  return (
    <div className="admin-form-group">
      <h3 style={{ marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Send Notification</h3>
      <form onSubmit={handleSubmit}>
        <label className="admin-form-label">Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required placeholder="Notification Title" />
        
        <label className="admin-form-label">Recipient Group</label>
        <select name="recipientRole" value={formData.recipientRole} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }}>
          <option value="All">All Users</option>
          <option value="Student">Students Only</option>
          <option value="Staff">Staff Only</option>
          <option value="Delivery">Delivery Staff Only</option>
        </select>
        
        <label className="admin-form-label">Message</label>
        <textarea name="message" value={formData.message} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem', minHeight: '100px', resize: 'vertical' }} required placeholder="Type your message here..."></textarea>
        
        <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>Send Notification</button>
      </form>
    </div>
  );
};

export default NotificationForm;
