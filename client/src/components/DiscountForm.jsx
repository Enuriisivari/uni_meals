import React, { useState } from 'react';

const DiscountForm = ({ onSave }) => {
  const [formData, setFormData] = useState({ 
    discount_name: '', 
    discount_percentage: '', 
    start_date: '', 
    end_date: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.discount_name && formData.discount_percentage && formData.start_date && formData.end_date) {
      onSave(formData);
      setFormData({ discount_name: '', discount_percentage: '', start_date: '', end_date: '' });
    }
  };

  return (
    <div className="admin-form-group">
      <h3 style={{ marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Create Discount</h3>
      <form onSubmit={handleSubmit}>
        <label className="admin-form-label">Discount Name</label>
        <input type="text" name="discount_name" value={formData.discount_name} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required />
        
        <label className="admin-form-label">Percentage (%)</label>
        <input type="number" name="discount_percentage" value={formData.discount_percentage} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required max="100" min="1" />
        
        <label className="admin-form-label">Start Date</label>
        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required />
        
        <label className="admin-form-label">End Date</label>
        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required />
        
        <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>Save Discount</button>
      </form>
    </div>
  );
};

export default DiscountForm;
