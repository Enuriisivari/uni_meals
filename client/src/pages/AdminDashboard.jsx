import React from 'react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,248', color: 'var(--admin-primary)' },
    { title: 'Canteen Staff', value: '34', color: 'var(--admin-success)' },
    { title: 'Delivery Staff', value: '56', color: 'var(--admin-warning)' },
    { title: 'Total Orders (Today)', value: '312', color: 'var(--admin-secondary)' },
  ];

  const recentActivities = [
    { id: 1, action: 'User registered', role: 'Student', time: '5 mins ago' },
    { id: 2, action: 'Order #4823 delivered', role: 'Delivery', time: '12 mins ago' },
    { id: 3, action: 'New menu item added', role: 'Staff', time: '1 hr ago' },
    { id: 4, action: 'Delivery staff application pending', role: 'System', time: '2 hrs ago' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard Overview</h1>
        <button className="admin-btn admin-btn-primary">Generate Report</button>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="admin-stat-card">
            <h3 className="admin-stat-title">{stat.title}</h3>
            <p className="admin-stat-value" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Recent Activity</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Role</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td style={{ fontWeight: 500 }}>{activity.action}</td>
                    <td><span className="admin-badge admin-badge-primary">{activity.role}</span></td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Notifications Preview</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderLeft: '4px solid var(--admin-warning)', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
              <p style={{ margin: 0, fontWeight: 500, color: '#92400e' }}></p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#b45309' }}></p>
            </div>
            <div style={{ padding: '1rem', borderLeft: '4px solid var(--admin-success)', backgroundColor: '#d1fae5', borderRadius: '4px' }}>
              <p style={{ margin: 0, fontWeight: 500, color: '#065f46' }}>System Backup Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
