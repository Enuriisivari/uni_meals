import React, { useState } from 'react';

const BudgetForm = ({ onSave }) => {
  const [formData, setFormData] = useState({ 
    month: '', 
    allocated_amount: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.month && formData.allocated_amount) {
      onSave(formData);
      setFormData({ month: '', allocated_amount: '' });
    }
  };

  return (
    <div className="admin-form-group">
      <h3 style={{ marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Allocate Budget</h3>
      <form onSubmit={handleSubmit}>
        <label className="admin-form-label">Month (YYYY-MM)</label>
        <input type="month" name="month" value={formData.month} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required />
        
        <label className="admin-form-label">Allocated Amount ($)</label>
        <input type="number" name="allocated_amount" value={formData.allocated_amount} onChange={handleChange} className="admin-form-input" style={{ marginBottom: '1rem' }} required min="0" step="0.01" />
        
        <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }}>Save Budget</button>
      </form>
    </div>
  );
};

export default BudgetForm;
