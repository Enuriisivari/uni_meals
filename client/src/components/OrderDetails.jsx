import React from 'react';

const OrderDetails = ({ order }) => {
  if (!order) return <div>Select an order to view details.</div>;

  return (
    <div className="admin-card">
      <h3 style={{ marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Order #{order._id}</h3>
      <p><strong>Total:</strong> ${order.totalAmount}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem', color: 'var(--admin-text-muted)' }}>
        {order.items?.map((item, idx) => (
          <li key={idx}>{item.quantity}x {item.name} - ${item.price}</li>
        ))}
      </ul>
      <button className="admin-btn admin-btn-primary">Update Status</button>
    </div>
  );
};

export default OrderDetails;
