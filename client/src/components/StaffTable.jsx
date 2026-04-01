import React from 'react';

const StaffTable = ({ data }) => {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Staff ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(staff => (
            <tr key={staff._id}>
              <td>{staff.name}</td>
              <td>{staff.email}</td>
              <td>{staff.staffId || 'Pending'}</td>
              <td><span className="admin-badge admin-badge-primary">{staff.status}</span></td>
              <td>
                <button className="admin-btn admin-btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Approve/Reject</button>
              </td>
            </tr>
          )) || <tr><td colSpan="5">No canteen staff found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
