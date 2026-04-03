import React, { useState } from 'react';

const StaffForm = ({ onSave }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      onSave(formData);
      setFormData({ name: '', email: '', password: '' });
    }
  };

  return (
    <div className="admin-form-group">
      <h3 style={{ marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Add / Edit Canteen Staff</h3>
      <form onSubmit={handleSubmit}>
        <label className="admin-form-label">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required />
        
        <label className="admin-form-label">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required />
        
        <label className="admin-form-label">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required />
        
        <button type="submit" className="admin-btn admin-btn-primary">Save Staff Member</button>
      </form>
    </div>
  );
};

export default StaffForm;
