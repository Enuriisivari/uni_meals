import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email: email.trim(),
        password
      });

      const token = response?.data?.token;
      if (!token) {
        setError('Login succeeded but no token was returned.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('adminUser', JSON.stringify(response?.data?.data || {}));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--admin-primary)', fontSize: '2rem' }}>
          UniMeals Admin
        </h2>
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label className="admin-form-label">Email or Username</label>
            <input 
              type="text" 
              className="admin-form-input" 
              placeholder="admin@unimeals.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input 
              type="password" 
              className="admin-form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>

          {error && (
            <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
