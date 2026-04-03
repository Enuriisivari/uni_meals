import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/admin.css';

const AdminLogin = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/admin/login' : '/api/admin/register';
      const payload = mode === 'login' 
        ? { email: email.trim(), password } 
        : { name: name.trim(), email: email.trim(), password };
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);

      const token = response?.data?.token;
      if (!token) {
        setError('Login succeeded but no token was returned.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('adminUser', JSON.stringify(response?.data?.data || {}));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || (mode === 'login' ? 'Login failed. Please check credentials.' : 'Sign up failed. Please try again.'));
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
        <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '2px solid #eee' }}>
          <button 
            type="button"
            onClick={() => setMode('login')}
            style={{ flex: 1, paddingBottom: '0.75rem', borderBottom: mode === 'login' ? '3px solid var(--admin-primary)' : '3px solid transparent', color: mode === 'login' ? 'var(--admin-primary)' : '#999', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s' }}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => setMode('signup')}
            style={{ flex: 1, paddingBottom: '0.75rem', borderBottom: mode === 'signup' ? '3px solid var(--admin-primary)' : '3px solid transparent', color: mode === 'signup' ? 'var(--admin-primary)' : '#999', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s' }}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="admin-form-group">
              <label className="admin-form-label">Full Name</label>
              <input 
                type="text" 
                className="admin-form-input" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
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
          
          {mode === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Login to Dashboard' : 'Create Admin Account'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
            {mode === 'login' ? "New around here?" : "Already have an account?"}
            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{ marginLeft: '0.5rem', color: 'var(--admin-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
