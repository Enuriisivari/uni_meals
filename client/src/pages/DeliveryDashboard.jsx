import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [deliveryPersonId, setDeliveryPersonId] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [theme, setTheme] = useState('dark');
  const [tasks, setTasks] = useState([
    { id: 4829, pickup: 'Basement Canteen Main Building', delivery: 'New Building Library ', status: 'pending', paymentType: 'Card', amount: 1550.00 },
    { id: 4830, pickup: 'Anohana Canteen', delivery: 'Engineering Building', status: 'pending', paymentType: 'Cash', amount: 850.00 },
    { id: 4831, pickup: 'Basement Canteen New Building', delivery: 'G1403 Lecture New Building', status: 'pending', paymentType: 'Cash', amount: 1200.00 },
    { id: 4832, pickup: 'P&S Canteen', delivery: 'B403 Main Building', status: 'pending', paymentType: 'Card', amount: 1825.00 }
  ]);

  const filteredTasks = tasks.filter(t =>
    t.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.delivery.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toString().includes(searchQuery)
  );

  const handleUpdateStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (task.status === 'pending') {
          const confirmPickup = window.confirm(`Confirm collection of Order #${task.id} from ${task.pickup} canteen staff?`);
          if (!confirmPickup) return task;
          return { ...task, status: 'picked_up' };
        }
        if (task.status === 'picked_up') {
          if (task.paymentType === 'Cash') {
            const confirmCash = window.confirm(`Confirm cash collection of Rs.${task.amount.toFixed(2)} from the customer?`);
            if (!confirmCash) return task;
          } else {
            const confirmDelivery = window.confirm(`Confirm delivery of Order #${task.id} to ${task.delivery}?`);
            if (!confirmDelivery) return task;
          }
          return { ...task, status: 'delivered' };
        }
      }
      return task;
    }));
  };

  useEffect(() => {
    const id = localStorage.getItem('deliveryPersonId');
    if (!id) {
      navigate('/delivery/login');
    } else {
      setDeliveryPersonId(id);
    }
    const savedTheme = localStorage.getItem('dashboardTheme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('deliveryPersonId');
    navigate('/delivery/login');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    // Simulate password change
    setPasswordMessage('✓ Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMessage(''), 3000);
  };

  if (!deliveryPersonId) return null;

  const activeCount = tasks.filter(t => t.status !== 'delivered').length;
  const completedDynamic = tasks.filter(t => t.status === 'delivered').length;

  const isDark = theme === 'dark';
  const themeColors = {
    containerBg: isDark ? '#0f172a' : '#f8fafc',
    text: isDark ? '#f8fafc' : '#0f172a',
    navbarBg: isDark ? '#1e293b' : '#ffffff',
    navbarText: isDark ? '#38bdf8' : '#0284c7',
    panelBg: isDark ? '#1e293b' : '#ffffff',
    panelBorder: isDark ? '#334155' : '#cbd5e1',
    itemBg: isDark ? '#0f172a' : '#f1f5f9',
    inputBg: isDark ? '#0f172a' : '#ffffff',
    inputText: isDark ? '#f8fafc' : '#0f172a',
    subtitle: isDark ? '#94a3b8' : '#475569'
  };

  const panelStyles = {
    backgroundColor: themeColors.panelBg,
    border: `1px solid ${themeColors.panelBorder}`,
  };

  const inputStyles = {
    ...styles.searchInput,
    backgroundColor: themeColors.inputBg,
    color: themeColors.inputText,
    border: `1px solid ${themeColors.panelBorder}`,
  };

  return (
    <div style={{ ...styles.container, backgroundColor: themeColors.containerBg, color: themeColors.text }}>
      <nav style={{ ...styles.navbar, backgroundColor: themeColors.navbarBg, borderBottom: `1px solid ${isDark ? '#334155' : '#cbd5e1'}` }}>
        <div style={{ ...styles.navBrand, color: themeColors.navbarText }}>UniMeals Delivery Panel</div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </nav>

      <div style={styles.contentLayout}>
        {/* Sidebar */}
        <aside style={{ ...styles.sidebar, backgroundColor: themeColors.panelBg, borderRight: `1px solid ${themeColors.panelBorder}` }}>
          <div style={styles.sidebarMenu}>
            <button
              onClick={() => setActiveSection('home')}
              style={{
                ...styles.sidebarBtn,
                color: themeColors.text,
                ...(activeSection === 'home'
                  ? {
                      ...styles.sidebarBtnActive,
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                      color: isDark ? '#38bdf8' : '#0284c7',
                      borderLeft: `3px solid ${isDark ? '#38bdf8' : '#0284c7'}`
                    }
                  : {}),
              }}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setActiveSection('orders')}
              style={{
                ...styles.sidebarBtn,
                color: themeColors.text,
                ...(activeSection === 'orders'
                  ? {
                      ...styles.sidebarBtnActive,
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                      color: isDark ? '#38bdf8' : '#0284c7',
                      borderLeft: `3px solid ${isDark ? '#38bdf8' : '#0284c7'}`
                    }
                  : {}),
              }}
            >
              📦 My Orders
            </button>
            <button
              onClick={() => setActiveSection('password')}
              style={{
                ...styles.sidebarBtn,
                color: themeColors.text,
                ...(activeSection === 'password'
                  ? {
                      ...styles.sidebarBtnActive,
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                      color: isDark ? '#38bdf8' : '#0284c7',
                      borderLeft: `3px solid ${isDark ? '#38bdf8' : '#0284c7'}`
                    }
                  : {}),
              }}
            >
              🔐 Change Password
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              style={{
                ...styles.sidebarBtn,
                color: themeColors.text,
                ...(activeSection === 'settings'
                  ? {
                      ...styles.sidebarBtnActive,
                      backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                      color: isDark ? '#38bdf8' : '#0284c7',
                      borderLeft: `3px solid ${isDark ? '#38bdf8' : '#0284c7'}`
                    }
                  : {}),
              }}
            >
              ⚙️ Settings
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ ...styles.main, color: themeColors.text }}>
          {/* HOME SECTION */}
          {activeSection === 'home' && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>Welcome back!</h1>
                <p style={styles.subtitle}>Here is your delivery overview for today.</p>
              </div>

              <div style={styles.statsGrid}>
                <div style={{ ...styles.statCard, ...panelStyles }}>
                  <div style={styles.statLabel}>Active Deliveries</div>
                  <div style={styles.statValue}>{activeCount}</div>
                </div>
                <div style={{ ...styles.statCard, ...panelStyles }}>
                  <div style={styles.statLabel}>Completed Today</div>
                  <div style={styles.statValue}>{12 + completedDynamic}</div>
                </div>
                <div style={{ ...styles.statCard, ...panelStyles }}>
                  <div style={styles.statLabel}>Earnings Today</div>
                  <div style={styles.statValue}>Rs.{(45.50 + completedDynamic * 3.50).toFixed(2)}</div>
                </div>
              </div>

              <div style={{ ...styles.section, ...panelStyles }}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Current Tasks</h2>
                  <input
                    type="text"
                    placeholder="Search locations or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={inputStyles}
                  />
                </div>
                <div style={styles.taskList}>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <div style={{ ...styles.taskItem, backgroundColor: themeColors.itemBg, border: `1px solid ${themeColors.panelBorder}` }} key={task.id}>
                        <div>
                          <h4 style={styles.taskTitle}>
                            Order #{task.id}
                            <span style={{
                              fontSize: '11px',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              marginLeft: '12px',
                              backgroundColor: task.status === 'delivered' ? '#334155' : (task.status === 'picked_up' ? '#3b82f6' : '#d97706'),
                              color: 'white',
                              fontWeight: '600',
                              letterSpacing: '0.05em'
                            }}>
                              {task.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </h4>
                          <p style={styles.taskDesc}>Pickup at {task.pickup} • Deliver to {task.delivery}</p>
                          <p style={{ ...styles.taskDesc, marginTop: '6px', color: '#cbd5e1' }}>
                            Payment: <strong>{task.paymentType}</strong> {task.paymentType === 'Cash' && <span style={{ color: '#10b981' }}>(Rs.{task.amount.toFixed(2)})</span>}
                          </p>
                        </div>
                        <button
                          style={{
                            ...styles.actionBtn,
                            backgroundColor: task.status === 'picked_up' ? '#3b82f6' : (task.status === 'delivered' ? '#334155' : '#10b981'),
                            cursor: task.status === 'delivered' ? 'not-allowed' : 'pointer',
                            opacity: task.status === 'delivered' ? 0.5 : 1
                          }}
                          onClick={() => handleUpdateStatus(task.id)}
                          disabled={task.status === 'delivered'}
                        >
                          {task.status === 'pending'
                            ? 'Mark Picked Up'
                            : (task.status === 'picked_up'
                              ? (task.paymentType === 'Cash' ? 'Collect Cash & Deliver' : 'Mark Delivered')
                              : 'Completed')}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#94a3b8', margin: 0 }}>No tasks found matching "{searchQuery}".</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* MY ORDERS SECTION */}
          {activeSection === 'orders' && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>My Orders</h1>
                <p style={styles.subtitle}>View all your completed and ongoing deliveries</p>
              </div>

              <div style={{ ...styles.section, ...panelStyles }}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>All Orders</h2>
                  <input
                    type="text"
                    placeholder="Search locations or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={inputStyles}
                  />
                </div>
                <div style={styles.taskList}>
                  {tasks.length > 0 ? (
                    tasks.map(task => (
                      <div style={{ ...styles.taskItem, backgroundColor: themeColors.itemBg, border: `1px solid ${themeColors.panelBorder}` }} key={task.id}>
                        <div>
                          <h4 style={styles.taskTitle}>
                            Order #{task.id}
                            <span style={{
                              fontSize: '11px',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              marginLeft: '12px',
                              backgroundColor: task.status === 'delivered' ? '#10b981' : (task.status === 'picked_up' ? '#3b82f6' : '#d97706'),
                              color: 'white',
                              fontWeight: '600',
                              letterSpacing: '0.05em'
                            }}>
                              {task.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </h4>
                          <p style={styles.taskDesc}>Pickup at {task.pickup} • Deliver to {task.delivery}</p>
                          <p style={{ ...styles.taskDesc, marginTop: '6px', color: '#cbd5e1' }}>
                            Payment: <strong>{task.paymentType}</strong> {task.paymentType === 'Cash' && <span style={{ color: '#10b981' }}>(Rs.{task.amount.toFixed(2)})</span>}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#94a3b8', margin: 0 }}>No orders found.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* CHANGE PASSWORD SECTION */}
          {activeSection === 'password' && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>Change Password</h1>
                <p style={styles.subtitle}>Update your account password</p>
              </div>

              <div style={styles.section}>
                {passwordError && <div style={styles.error}>{passwordError}</div>}
                {passwordMessage && <div style={styles.success}>{passwordMessage}</div>}

                <form onSubmit={handleChangePassword} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{ ...styles.formInput, backgroundColor: themeColors.inputBg, color: themeColors.inputText, border: `1px solid ${themeColors.panelBorder}` }}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ ...styles.formInput, backgroundColor: themeColors.inputBg, color: themeColors.inputText, border: `1px solid ${themeColors.panelBorder}` }}
                      placeholder="Enter new password (minimum 6 characters)"
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ ...styles.formInput, backgroundColor: themeColors.inputBg, color: themeColors.inputText, border: `1px solid ${themeColors.panelBorder}` }}
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>

                  <button type="submit" style={styles.submitBtn}>
                    Update Password
                  </button>
                </form>
              </div>
            </>
          )}

          {/* SETTINGS SECTION */}
          {activeSection === 'settings' && (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>Settings</h1>
                <p style={styles.subtitle}>Manage your account preferences</p>
              </div>

              <div style={{ ...styles.section, ...panelStyles }}>
                <div style={styles.settingsGroup}>
                  <h3 style={styles.settingsTitle}>Account Information</h3>
                  <div style={styles.settingItem}>
                    <span style={styles.settingLabel}>Email:</span>
                    <span style={styles.settingValue}>delivery@unimeals.com</span>
                  </div>
                  <div style={styles.settingItem}>
                    <span style={styles.settingLabel}>Phone:</span>
                    <span style={styles.settingValue}>+1 234 567 8900</span>
                  </div>
                  <div style={styles.settingItem}>
                    <span style={styles.settingLabel}>Account ID:</span>
                    <span style={styles.settingValue}>{deliveryPersonId}</span>
                  </div>
                </div>

                <div style={styles.settingsGroup}>
                  <h3 style={styles.settingsTitle}>Notifications</h3>
                  <div style={styles.settingItem}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <span>Email notifications for new deliveries</span>
                    </label>
                  </div>
                  <div style={styles.settingItem}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <span>SMS alerts for urgent deliveries</span>
                    </label>
                  </div>
                </div>

                <div style={styles.settingsGroup}>
                  <h3 style={styles.settingsTitle}>App Preferences</h3>
                  <div style={styles.settingItem}>
                    <span style={styles.settingLabel}>Theme:</span>
                    <select
                      value={theme}
                      onChange={(e) => {
                        setTheme(e.target.value);
                        localStorage.setItem('dashboardTheme', e.target.value);
                      }}
                      style={{ ...styles.formInput, backgroundColor: themeColors.inputBg, color: themeColors.inputText }}
                    >
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                    </select>
                  </div>
                  <div style={styles.settingItem}>
                    <span style={styles.settingLabel}>Language:</span>
                    <select style={styles.formInput}>
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a',
    fontFamily: '"Inter", sans-serif',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
  },
  navBrand: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#38bdf8',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  contentLayout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#1e293b',
    borderRight: '1px solid #334155',
    padding: '20px',
    overflowY: 'auto',
  },
  sidebarMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sidebarBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s',
    borderLeft: '3px solid transparent',
  },
  sidebarBtnActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    color: '#38bdf8',
    borderLeft: '3px solid #38bdf8',
  },
  main: {
    flex: 1,
    padding: '40px 32px',
    overflowY: 'auto',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    textAlign: 'left',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#E3A8A0',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#1e293b',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #334155',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#f8fafc',
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #334155',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  searchInput: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: '14px',
    width: '100%',
    maxWidth: '300px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  taskTitle: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: '600',
  },
  taskDesc: {
    margin: 0,
    fontSize: '14px',
    color: '#94a3b8',
  },
  actionBtn: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '500px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#cbd5e1',
  },
  formInput: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: '14px',
    outline: 'none',
    transitions: 'border-color 0.2s',
  },
  submitBtn: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  success: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  settingsGroup: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #334155',
  },
  settingsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f8fafc',
    margin: '0 0 16px 0',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid rgba(52, 65, 85, 0.3)',
  },
  settingLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#cbd5e1',
  },
  settingValue: {
    fontSize: '14px',
    color: '#94a3b8',
  }
};

export default DeliveryDashboard;
