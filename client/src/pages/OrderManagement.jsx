import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchOrders();
    };
    run();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Monitor Orders & Deliveries</h1>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(0, 8)}</td>
                  <td>{order.userId?.name || 'Unknown'}</td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'primary'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select 
                      className="admin-form-input" 
                      style={{ padding: '0.25rem', width: 'auto', marginRight: '0.5rem' }}
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
