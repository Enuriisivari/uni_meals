import React from 'react';

const OrderTable = ({ data }) => {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>Customer ID: {order.userId}</td>
              <td>${order.totalAmount}</td>
              <td><span className="admin-badge admin-badge-primary">{order.status}</span></td>
              <td>
                <button className="admin-btn admin-btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View Details</button>
              </td>
            </tr>
          )) || <tr><td colSpan="5">No orders found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
