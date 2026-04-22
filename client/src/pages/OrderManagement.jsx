import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const STATUS_OPTIONS = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(`${API_BASE_URL}/api/orders`, {
        params: statusFilter ? { status: statusFilter } : {},
      });
      if (data.success) {
        setOrders(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError('');
      await axios.put(`${API_BASE_URL}/api/orders/${id}`, { status });
      await fetchOrders();
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId('');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Monitor Orders & Deliveries</h1>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <select
            className="admin-form-input"
            style={{ minWidth: '160px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button className="admin-btn" onClick={fetchOrders} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        {error ? (
          <p style={{ color: '#c0392b', marginBottom: '1rem', fontWeight: 600 }}>{error}</p>
        ) : null}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Student Name</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Delivery Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id}>
                  <td>{String(order.id || '').substring(0, 8)}</td>
                  <td>{order.studentName || 'Unknown'}</td>
                  <td>Rs. {Number(order.totalPrice || 0).toFixed(2)}</td>
                  <td>
                    <span
                      className={`admin-badge admin-badge-${
                        order.status === 'completed'
                          ? 'success'
                          : order.status === 'cancelled'
                            ? 'danger'
                            : 'primary'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.deliveryLocation || 'Pickup'}</td>
                  <td>
                    <select 
                      className="admin-form-input" 
                      style={{ padding: '0.25rem', width: 'auto', marginRight: '0.5rem' }}
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    {loading ? 'Loading orders...' : 'No orders found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
