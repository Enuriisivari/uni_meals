import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { registerRequest } from '../api/auth.js'

function IconUser() {
  return (
    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6 20v-1a6 6 0 0112 0v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconAt() {
  return (
    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 108 0 0 8-8 8-8-4 0-8 4-8 8v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconLock() {
  return (
    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await registerRequest({ name, email, password })
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      const msg =
        (typeof data === 'object' && data?.error) ||
        (typeof data === 'string' ? data : null) ||
        err.message ||
        'Could not create account.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-form-wrap">
        <h2 className="login-title">Create your account</h2>
        <p className="login-subtitle">Add your details to save credentials in our database</p>

        {error ? (
          <p className="login-error" role="alert">
            {error}
          </p>
        ) : null}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label" htmlFor="name">
              Full name
            </label>
            <div className="login-input-wrap">
              <IconUser />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="login-input"
                placeholder="Alex Student"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="email">
              University email
            </label>
            <div className="login-input-wrap">
              <IconAt />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="login-input"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <div className="login-input-wrap">
              <IconLock />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="login-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="confirm">
              Confirm password
            </label>
            <div className="login-input-wrap">
              <IconLock />
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                className="login-input"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="login-footer">
          Already have an account?{' '}
          <Link to="/login" className="login-footer-link">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
