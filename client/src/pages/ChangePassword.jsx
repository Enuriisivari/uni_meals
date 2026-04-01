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

function IconEye({ isVisible }) {
  if (isVisible) {
    return (
      <svg className="change-pass-eyeIcon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 5c-4 0-7.5 2.5-9 6 1.5 3.5 5 6 9 6s7.5-2.5 9-6c-1.5-3.5-5-6-9-6z" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg className="change-pass-eyeIcon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18M5 12c0 3.5 3 6 7 6s7-2.5 7-6-3-6-7-6-7 2.5-7 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
              disabled
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
                type={showCurrentPassword ? 'text' : 'password'}
                className="change-pass-input change-pass-input--icon"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="change-pass-toggleBtn"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                <IconEye isVisible={showCurrentPassword} />
              </button>
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
                type={showNewPassword ? 'text' : 'password'}
                className="change-pass-input change-pass-input--icon"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="change-pass-toggleBtn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                <IconEye isVisible={showNewPassword} />
              </button>
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
                type={showConfirmPassword ? 'text' : 'password'}
                className="change-pass-input change-pass-input--icon"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="change-pass-toggleBtn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <IconEye isVisible={showConfirmPassword} />
              </button>
            </div>
          </div>

          <button className="change-pass-submit" type="submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'} <span aria-hidden="true">→</span>
          </button>

          <div className="change-pass-back">
            <Link to="/edit-profile" className="change-pass-backLink">
              Edit Profile
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

