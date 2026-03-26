import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { changePasswordRequest } from '../api/auth.js'
import './ChangePassword.css'

const USER_KEY = 'uni_meals_user'

function IconLock() {
  return (
    <svg className="forgot-inputIcon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function ChangePassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      setEmail(parsed?.email || '')
    } catch {
      // ignore
    }
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Please login first.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const data = await changePasswordRequest({
        email,
        currentPassword,
        newPassword,
      })
      setMessage(data?.message || 'Password updated.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => navigate('/profile'), 500)
    } catch (err) {
      const data = err.response?.data
      setError((data && data.error) || err.message || 'Unable to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="change-pass-wrap">
        <h2 className="change-pass-title">Change Password</h2>
        <p className="change-pass-subtitle">Update your password to keep your account secure.</p>

        {error ? (
          <div className="change-pass-message change-pass-message--error" role="alert">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="change-pass-message" role="status">
            {message}
          </div>
        ) : null}

        <form className="change-pass-form" onSubmit={onSubmit} noValidate>
          <div className="change-pass-field">
            <label className="change-pass-label" htmlFor="cp-email">
              UNIVERSITY EMAIL
            </label>
            <input
              id="cp-email"
              className="change-pass-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="change-pass-field">
            <label className="change-pass-label" htmlFor="cp-current">
              CURRENT PASSWORD
            </label>
            <div className="change-pass-inputWrap">
              <IconLock />
              <input
                id="cp-current"
                type="password"
                className="change-pass-input change-pass-input--icon"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="change-pass-field">
            <label className="change-pass-label" htmlFor="cp-new">
              NEW PASSWORD
            </label>
            <div className="change-pass-inputWrap">
              <IconLock />
              <input
                id="cp-new"
                type="password"
                className="change-pass-input change-pass-input--icon"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="change-pass-field">
            <label className="change-pass-label" htmlFor="cp-confirm">
              CONFIRM NEW PASSWORD
            </label>
            <div className="change-pass-inputWrap">
              <IconLock />
              <input
                id="cp-confirm"
                type="password"
                className="change-pass-input change-pass-input--icon"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="change-pass-submit" type="submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'} <span aria-hidden="true">→</span>
          </button>

          <div className="change-pass-back">
            <Link to="/profile" className="change-pass-backLink">
              Back to Profile
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

