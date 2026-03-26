import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import { loginRequest } from '../api/auth.js'

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

function IconEye({ off }) {
  if (off) {
    return (
      <svg className="login-input-icon login-input-icon--btn" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 3l18 18M10.5 10.5a3 3 0 004.2 4.2M9.9 5.1A10.4 10.4 0 0112 5c4 0 7.5 2.5 10 7-1 1.8-2.3 3.3-3.8 4.5M6.3 6.3C4.3 7.8 2.7 9.8 2 12c2.5 4.5 6 7 10 7 1.2 0 2.4-.2 3.5-.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg className="login-input-icon login-input-icon--btn" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg className="login-btn-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconGradCap() {
  return (
    <svg className="login-alt-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10l8-4 8 4-8 4-8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 10v6l8 4 8-4v-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg className="login-alt-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const USER_KEY = 'uni_meals_user'

export default function StudentLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const cleanEmail = String(email || '').trim()
      if (!cleanEmail.includes('@')) {
        setError('Please enter a valid email address with "@"')
        return
      }

      const data = await loginRequest({ email: cleanEmail, password })
      // Backend may return either `{ user: {...} }` or `{ userId }` depending on version.
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } else if (data.userId) {
        localStorage.setItem(
          USER_KEY,
          JSON.stringify({
            id: data.userId,
            name: data.name || 'Student',
            email: data.email || email,
          }),
        )
      }
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      const msg =
        (typeof data === 'object' && data?.error) ||
        (typeof data === 'string' ? data : null) ||
        err.message ||
        'Unable to sign in. Check your connection and try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-form-wrap">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to access your campus meals</p>

        {error ? (
          <p className="login-error" role="alert">
            {error}
          </p>
        ) : null}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
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
            <div className="login-label-row">
              <label className="login-label" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="login-forgot">
                Forgot Password?
              </Link>
            </div>
            <div className="login-input-wrap">
              <IconLock />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="login-input login-input--has-toggle"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-toggle-pass"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <IconEye off={showPassword} />
              </button>
            </div>
          </div>

          <label className="login-remember">
            <input type="checkbox" name="remember" className="login-checkbox" />
            <span>Keep me signed in</span>
          </label>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
            {!loading ? <IconArrowRight /> : null}
          </button>
        </form>

        <div className="login-divider">
          <span>or connect with</span>
        </div>

        <div className="login-alt-btns">
          <button type="button" className="login-alt-btn">
            <IconGradCap />
            Student ID
          </button>
          <button type="button" className="login-alt-btn">
            <IconMail />
            Outlook
          </button>
        </div>

        <p className="login-footer">
          New to UniMeals?{' '}
          <Link to="/signup" className="login-footer-link">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
