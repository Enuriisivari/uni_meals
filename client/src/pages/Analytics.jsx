import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Analytics = () => {
  const [stats, setStats] = useState({
    orders: { total: 0, delivered: 0, cancelled: 0, revenue: 0 },
    feedback: { total: 0, averageRating: 0 },
    users: { total: 0, staff: 0 },
    budget: { allocated: 0, spent: 0 }
  });
  
  const [detailedBudgets, setDetailedBudgets] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/analytics');
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    }
  };

  const fetchDetails = async () => {
    try {
      const budgetRes = await axios.get('/api/budget');
      if (Array.isArray(budgetRes.data)) setDetailedBudgets(budgetRes.data);

      const feedbackRes = await axios.get('/api/feedback/admin');
      if (feedbackRes.data && Array.isArray(feedbackRes.data.data)) setFeedbacks(feedbackRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchDetails();
  }, []);

  const handleExport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.text("UniMeals System Analytics Report", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Revenue & Orders
    doc.setFontSize(16);
    doc.text("Orders & Revenue", 14, 45);
    
    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: [
        ['Total Orders', stats.orders.total],
        ['Delivered', stats.orders.delivered],
        ['Cancelled', stats.orders.cancelled],
        ['Revenue (Rs.)', stats.orders.revenue]
      ]
    });
    
    // Users & Feedback
    let finalY = doc.lastAutoTable.finalY || 50;
    doc.setFontSize(16);
    doc.text("Users & Feedback", 14, finalY + 15);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Metric', 'Value']],
      body: [
        ['Total System Users', stats.users.total],
        ['Staff / Delivery Personnel', stats.users.staff],
        ['Total Feedback Reviews', stats.feedback.total],
        ['Average Rating', `${stats.feedback.averageRating} / 5.0`]
      ]
    });
    
    // Budget Tracking
    finalY = doc.lastAutoTable.finalY || 50;
    doc.setFontSize(16);
    doc.text("Budget Tracking", 14, finalY + 15);
    
    const remaining = stats.budget.allocated - stats.budget.spent;
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Metric', 'Amount (Rs.)']],
      body: [
        ['Allocated Budget', stats.budget.allocated],
        ['Spent Budget', stats.budget.spent],
        ['Remaining Budget', remaining]
      ]
    });
    
    doc.save("UniMeals_Analytics_Report.pdf");
  };

  // Chart Data preparation
  const getFeedbackCategoryData = () => {
    const counts = {};
    feedbacks.forEach(f => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  };
  const feedbackData = getFeedbackCategoryData();
  const FEEDBACK_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const mappedBudgetData = detailedBudgets.map(b => ({
    name: b.month,
    Allocated: b.allocated_amount,
    Spent: b.spent_amount
  }));

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">System Analytics & Report Generation</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="admin-btn admin-btn-primary" onClick={handleExport}>Generate Full PDF Report</button>
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

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Feedback Categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={feedbackData} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
                {feedbackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={FEEDBACK_COLORS[index % FEEDBACK_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Budget Allocation vs Spent History</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mappedBudgetData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="Allocated" fill="#3B82F6" />
              <Bar dataKey="Spent" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Feedback Overview</h2>
          <div style={{ padding: '2rem', backgroundColor: '#f8fafc', border: '1px dashed var(--admin-border)', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '3rem', margin: 0, color: '#F59E0B' }}>{stats.feedback.averageRating} <span style={{fontSize: '1.5rem'}}>★</span></h3>
            <p style={{ color: 'var(--admin-text-muted)' }}>Average Rating across {stats.feedback.total} reviews</p>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Raw Budget Stats</h2>
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
