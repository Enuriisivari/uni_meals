import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/discounts');
      if (data.success) {
        setDiscounts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchDiscounts();
    };
    run();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Discount Management</h1>
        <button className="admin-btn admin-btn-primary">+ Create Discount</button>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Value</th>
                <th>Description</th>
                <th>Validity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length > 0 ? discounts.map((discount) => (
                <tr key={discount._id}>
                  <td style={{ fontWeight: 'bold' }}>{discount.code}</td>
                  <td>{discount.discountType === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}</td>
                  <td>{discount.description}</td>
                  <td>{new Date(discount.validUntil).toLocaleDateString()}</td>
                  <td>
                    <span className={discount.isActive ? 'admin-badge admin-badge-success' : 'admin-badge admin-badge-danger'}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>No discounts configured</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiscountManagement;
