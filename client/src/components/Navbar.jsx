import React from 'react';

const Navbar = () => {
  return (
    <header className="admin-navbar" style={{ 
      backgroundColor: 'white', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid var(--admin-border)'
    }}>
      <div style={{ fontWeight: 'bold', color: 'var(--admin-text-main)' }}>Admin Portal</div>
      <div>
        <span style={{ marginRight: '1rem', color: 'var(--admin-text-muted)' }}>Welcome, System Admin</span>
        <button style={{
          backgroundColor: 'var(--admin-secondary)',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
