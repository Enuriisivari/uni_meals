import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/budgets');
      if (data.success) {
        setBudgets(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch budgets", error);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchBudgets();
    };
    run();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Budget Management</h1>
        <button className="admin-btn admin-btn-primary">+ Allocate Budget</button>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Allocated Amount</th>
                <th>Spent Amount</th>
                <th>Remaining</th>
                <th>Fiscal Year</th>
              </tr>
            </thead>
            <tbody>
              {budgets.length > 0 ? budgets.map((budget) => {
                const remaining = (budget.allocatedAmount || 0) - (budget.spentAmount || 0);
                return (
                  <tr key={budget._id}>
                    <td style={{ fontWeight: 'bold' }}>{budget.name || budget.department}</td>
                    <td>${budget.allocatedAmount}</td>
                    <td>${budget.spentAmount}</td>
                    <td style={{ color: remaining < 0 ? 'red' : 'green', fontWeight: 'bold' }}>${remaining}</td>
                    <td>{budget.fiscalYear}</td>
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
  );
};

export default BudgetManagement;
