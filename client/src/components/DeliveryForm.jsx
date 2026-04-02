import React from 'react';

const DeliveryForm = () => {
  return (
    <div className="admin-form-group">
      <h3 style={{ marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Add / Edit Delivery Person</h3>
      <label className="admin-form-label">Name</label>
      <input type="text" className="admin-form-input" style={{ marginBottom: '1rem' }} />
      <label className="admin-form-label">Email</label>
      <input type="email" className="admin-form-input" style={{ marginBottom: '1rem' }} />
      <button className="admin-btn admin-btn-primary">Save Delivery Person</button>
    </div>
  );
};

export default DeliveryForm;
