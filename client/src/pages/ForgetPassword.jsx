import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgetPassword = () => {
  const [step, setStep] = useState('email'); // 'email' or 'verify'
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoFetched, setAutoFetched] = useState(false);
  const emailRef = useRef('');
  const navigate = useNavigate();

  // Auto-fetch verification code when valid email is entered
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (email.endsWith('@unimeals.com') && email.length > 0 && !autoFetched) {
        setError('');
        setSuccess('');
        setLoading(true);
        setAutoFetched(true);

        try {
          // Simulate API call - in production, this would send a verification code via email
          await new Promise(resolve => setTimeout(resolve, 600));
          
          // For demo purposes, we'll generate a code
          const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
          localStorage.setItem('tempVerificationCode', demoCode);
          localStorage.setItem('tempEmail', email);
          
          // Auto-fill the verification code
          setVerificationCode(demoCode);
          
          setSuccess(`✓ Verification code sent to ${email}`);
          setTimeout(() => {
            setStep('verify');
            setSuccess('');
          }, 1500);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to send verification code. Please try again.');
          setAutoFetched(false);
        } finally {
          setLoading(false);
        }
      }
    }, 800); // Wait 800ms after user stops typing

    return () => clearTimeout(timer);
  }, [email, autoFetched]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email.endsWith('@unimeals.com')) {
      setError('Please use a valid @unimeals.com email address.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call - in production, this would send a verification code via email
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // For demo purposes, we'll generate a code
      const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('tempVerificationCode', demoCode);
      localStorage.setItem('tempEmail', email);
      
      // Auto-fill the verification code
      setVerificationCode(demoCode);
      
      setSuccess(`Verification code sent to ${email}.`);
      setTimeout(() => {
        setStep('verify');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const storedCode = localStorage.getItem('tempVerificationCode');
    const storedEmail = localStorage.getItem('tempEmail');

    if (verificationCode !== storedCode) {
      setError('Invalid verification code. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Clear temporary data
      localStorage.removeItem('tempVerificationCode');
      localStorage.removeItem('tempEmail');

      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/delivery/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Clear any temporary data
    localStorage.removeItem('tempVerificationCode');
    localStorage.removeItem('tempEmail');
    navigate('/delivery/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.subtitle}>Recover access to your account</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} style={styles.form}>
            <p style={styles.stepDescription}>
              Enter your email address and we'll automatically send you a verification code to reset your password.
            </p>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setAutoFetched(false); // Reset auto-fetched flag when email changes
                }}
                style={styles.input}
                placeholder="Your name @unimeals.com"
                required
              />
              {loading && (
                <p style={styles.hint}>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span> Sending verification code...
                </p>
              )}
            </div>

            {!loading && (
              <button
                type="submit"
                style={styles.button}
              >
                Send Verification Code
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} style={styles.form}>
            <p style={styles.stepDescription}>
              Verification code has been sent to your email and auto-filled below. Set a new password to complete the reset.
            </p>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Verification Code</label>
              <div style={styles.autoFilledNote}>
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '500' }}>✓ Auto-fetched</span>
              </div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{
                  ...styles.input,
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderColor: '#10b981'
                }}
                placeholder="6-digit code"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={styles.footer}>
          <button
            type="button"
            onClick={handleBackToLogin}
            style={styles.backBtn}
          >
            ← Back to Login
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
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a',
    fontFamily: '"Inter", sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '450px',
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
  stepDescription: {
    color: '#cbd5e1',
    fontSize: '14px',
    marginBottom: '20px',
    lineHeight: '1.6',
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
    textAlign: 'left',
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
  hint: {
    color: '#94a3b8',
    fontSize: '12px',
    margin: '0',
    marginTop: '4px',
  },
  button: {
    marginTop: '10px',
    padding: '14px',
    borderRadius: '8px',
    backgroundColor: '#a855f7',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  buttonDisabled: {
    backgroundColor: '#9333ea',
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
  success: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #64748b',
    color: '#cbd5e1',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  autoFilledNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
};

export default ForgetPassword;
