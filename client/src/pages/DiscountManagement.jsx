import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DiscountForm from '../components/DiscountForm';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    try {
      const { data } = await axios.get('/api/discount');
      // The API returns an array directly
      if (Array.isArray(data)) {
        setDiscounts(data);
      }
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSaveDiscount = async (discountData) => {
    try {
      const response = await axios.post('/api/discount', discountData);
      if (response.status === 201) {
        toast.success(response.data.message || 'Discount created successfully!');
        if (response.data.discount) {
          setDiscounts([response.data.discount, ...discounts]);
        } else {
          fetchDiscounts();
        }
      }
    } catch (error) {
      toast.error('Failed to save discount');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Discount Management</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>
        <div className="admin-card">
          <DiscountForm onSave={handleSaveDiscount} />
        </div>

        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Discount Name</th>
                  <th>Value</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {discounts.length > 0 ? discounts.map((discount) => (
                  <tr key={discount._id}>
                    <td style={{ fontWeight: 'bold' }}>{discount.discount_name}</td>
                    <td>{discount.discount_percentage}%</td>
                    <td>{new Date(discount.start_date).toLocaleDateString()}</td>
                    <td>{new Date(discount.end_date).toLocaleDateString()}</td>
                    <td>
                      <span className={discount.status === 'Active' ? 'admin-badge admin-badge-success' : 'admin-badge admin-badge-danger'}>
                        {discount.status}
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
    </div>
  );
};

export default DiscountManagement;
