import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeliveryLogin = () => {
  const [email, setEmail] = useState('test@unimeals.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.endsWith('@unimeals.com')) {
      setError('Please use a valid @unimeals.com email address.');
      setLoading(false);
      return;
    }

    // Specific dummy data case to login without an API request
    if (email === 'admin@unimeals.com' && password === '123456') {
      setTimeout(() => {
        localStorage.setItem('adminId', 'dummy-admin');
        navigate('/admin/delivery-staff');
      }, 400); // Simulate network delay
      return;
    }

    if (email === 'test@unimeals.com' && password === '123456') {
      setTimeout(() => {
        localStorage.setItem('deliveryPersonId', 'dummy-123');
        navigate('/delivery/dashboard');
      }, 400); // Simulate network delay
      return;
    }
    if (email === 'delivery@unimeals.com' && password === '123456') {
      setTimeout(() => {
        localStorage.setItem('adminId', 'dummy-admin');
        navigate('/admin/delivery-staff');
      }, 400); // Simulate network delay
      return;
    }

    if (email === 'person1@unimeals.com' && password === '123456') {
      setTimeout(() => {
        localStorage.setItem('deliveryPersonId', 'dummy-123');
        navigate('/delivery/dashboard');
      }, 400); // Simulate network delay
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/delivery/login', {
        email,
        password
      });

      // Assume successful login returns deliveryPersonId or token
      if (response.data) {
        localStorage.setItem('deliveryPersonId', response.data.deliveryPersonId);
        navigate('/delivery/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Delivery Partner</h2>
          <p style={styles.subtitle}>Log in to your dashboard</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.quickLogin}>
          <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#94a3b8' }}>Quick auto-fill (Testing):</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setEmail('test@unimeals.com')} style={styles.quickBtn}>Delivery Person</button>
            <button type="button" onClick={() => setEmail('admin@unimeals.com')} style={styles.quickBtn}>Delivery Staff</button>
          </div>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Yourname@unimeals.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            disabled={loading}
          >
            {loading ? 'Login...' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={() => navigate('/delivery/forget-password')}
            style={styles.forgetPasswordBtn}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a',
    fontFamily: '"Inter", sans-serif',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    color: '#f8fafc',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'left'
  },
  label: {
    color: '#cbd5e1',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    marginTop: '10px',
    padding: '14px',
    borderRadius: '8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  buttonDisabled: {
    backgroundColor: '#2563eb',
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  quickLogin: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px dashed #38bdf8'
  },
  quickBtn: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    border: '1px solid #38bdf8',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    flex: 1,
    transition: 'all 0.2s',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  forgetPasswordBtn: {
    backgroundColor: 'transparent',
    color: '#38bdf8',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'color 0.2s',
    textDecoration: 'underline',
  }
};

export default DeliveryLogin;
