import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSelection.css';

const LoginSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="login-selection-container">
      <div className="login-selection-overlay"></div>
      <div className="login-selection-content">
        <h1 className="login-selection-title">Welcome to UniMeals</h1>
        <p className="login-selection-subtitle">Select your portal to continue</p>
        
        <div className="login-selection-grid">
          <div 
            className="selection-card user-card"
            onClick={() => navigate('/login')}
          >
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2>User Side</h2>
            <p>Access your favorite meals, track orders, and manage your profile.</p>
            <button className="selection-btn">Login as Student</button>
          </div>

          <div className="selection-card admin-card no-hover-navigate">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>Admin & Staff</h2>
            <p>Select the specific portal you need to access.</p>
            <div className="sub-portal-buttons">
              <button className="selection-btn sub-btn" onClick={() => navigate('/admin-login')}>Admin Login</button>
              <button className="selection-btn sub-btn" onClick={() => navigate('/delivery/login')}>Delivery Login</button>
              <button className="selection-btn sub-btn" onClick={() => navigate('/dashbord')}>Staff Portal</button>
            </div>
          </div>
        </div>

        <button className="back-to-home" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default LoginSelection;
