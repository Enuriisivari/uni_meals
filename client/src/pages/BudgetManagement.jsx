import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BudgetForm from '../components/BudgetForm';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const { data } = await axios.get('/api/budget');
      // The API returns an array directly
      if (Array.isArray(data)) {
        setBudgets(data);
      }
    } catch (error) {
      console.error("Failed to fetch budgets", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSaveBudget = async (budgetData) => {
    try {
      const response = await axios.post('/api/budget', budgetData);
      if (response.status === 201) {
        toast.success(response.data.message || 'Budget allocated successfully!');
        if (response.data.budget) {
          setBudgets([response.data.budget, ...budgets]);
        } else {
          fetchBudgets();
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || 'Budget for this month already exists');
      } else {
        toast.error('Failed to save budget');
      }
      console.error(error);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Budget Management</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>
        <div className="admin-card">
          <BudgetForm onSave={handleSaveBudget} />
        </div>

        <div className="admin-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Allocated Amount</th>
                  <th>Spent Amount</th>
                  <th>Remaining</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {budgets.length > 0 ? budgets.map((budget) => {
                  const remaining = (budget.allocated_amount || 0) - (budget.spent_amount || 0);
                  return (
                    <tr key={budget._id}>
                      <td style={{ fontWeight: 'bold' }}>{budget.month}</td>
                      <td>${parseFloat(budget.allocated_amount).toFixed(2)}</td>
                      <td>${parseFloat(budget.spent_amount || 0).toFixed(2)}</td>
                      <td style={{ color: remaining < 0 ? 'red' : 'green', fontWeight: 'bold' }}>${remaining.toFixed(2)}</td>
                      <td>
                        <span className={budget.status === 'Active' ? 'admin-badge admin-badge-success' : 'admin-badge admin-badge-danger'}>
                          {budget.status}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No budget records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetManagement;
