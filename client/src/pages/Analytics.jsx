import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState({
    orders: { total: 0, delivered: 0, cancelled: 0, revenue: 0 },
    feedback: { total: 0, averageRating: 0 },
    users: { total: 0, staff: 0 },
    budget: { allocated: 0, spent: 0 }
  });

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/analytics');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchAnalytics();
    };
    run();
  }, []);

  const handleExport = () => {
    const reportStr = JSON.stringify(stats, null, 2);
    const blob = new Blob([reportStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uni_eats_report.json";
    a.click();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">System Analytics & Report Generation</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="admin-btn admin-btn-primary" onClick={handleExport}>Generate Full Report</button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3 className="admin-stat-title">Total Revenue</h3>
          <p className="admin-stat-value" style={{ color: 'var(--admin-success)' }}>Rs. {stats.orders.revenue}</p>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>From {stats.orders.delivered} delivered orders</p>
        </div>
        <div className="admin-stat-card">
          <h3 className="admin-stat-title">Total Orders</h3>
          <p className="admin-stat-value" style={{ color: 'var(--admin-primary)' }}>{stats.orders.total}</p>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>({stats.orders.cancelled} cancelled)</p>
        </div>
        <div className="admin-stat-card">
          <h3 className="admin-stat-title">System Users</h3>
          <p className="admin-stat-value" style={{ color: 'var(--admin-secondary)' }}>{stats.users.total}</p>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{stats.users.staff} staff/delivery personnel</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Feedback Overview</h2>
          <div style={{ padding: '2rem', backgroundColor: '#f8fafc', border: '1px dashed var(--admin-border)', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '3rem', margin: 0, color: '#F59E0B' }}>{stats.feedback.averageRating} <span style={{fontSize: '1.5rem'}}>★</span></h3>
            <p style={{ color: 'var(--admin-text-muted)' }}>Average Rating across {stats.feedback.total} reviews</p>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Budget Overview</h2>
          <div style={{ padding: '2rem', backgroundColor: '#f8fafc', border: '1px dashed var(--admin-border)', borderRadius: '8px', textAlign: 'center' }}>
            <p><strong>Allocated:</strong> Rs. {stats.budget.allocated}</p>
            <p><strong>Spent:</strong> Rs. {stats.budget.spent}</p>
            <p style={{ color: (stats.budget.allocated - stats.budget.spent) < 0 ? 'red' : 'green', fontWeight: 'bold' }}>
              <strong>Remaining:</strong> Rs. {stats.budget.allocated - stats.budget.spent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
