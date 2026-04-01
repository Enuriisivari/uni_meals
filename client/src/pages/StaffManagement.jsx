import React from 'react';
import StaffForm from '../components/StaffForm';
import StaffTable from '../components/StaffTable';

const StaffManagement = () => {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Canteen Staff Management</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="admin-card"><StaffForm /></div>
        <div className="admin-card"><StaffTable data={[]} /></div>
      </div>
    </div>
  );
};

export default StaffManagement;
