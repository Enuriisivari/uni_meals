import React from 'react';

const DeliveryTable = ({ data }) => {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(person => (
            <tr key={person._id}>
              <td>{person.name}</td>
              <td>{person.email}</td>
              <td><span className="admin-badge admin-badge-success">{person.status}</span></td>
              <td>
                <button className="admin-btn admin-btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit/Delete</button>
              </td>
            </tr>
          )) || <tr><td colSpan="4">No delivery personnel found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTable;
