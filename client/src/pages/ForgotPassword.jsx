import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    // No backend reset endpoint exists yet in this repo.
    // This keeps the UI functional while you connect it later.
    setTimeout(() => {
      setLoading(false)
      setMessage('If this email exists, you will receive a password reset link shortly.')
    }, 900)
  }

  return (
    <div className="forgot-page">
      <div className="forgot-bg" aria-hidden="true" />

      <div className="forgot-shell">
        <div className="forgot-header">
          <span className="forgot-brand">UniMeals</span>
        </div>

        <div className="forgot-card">
          <div className="forgot-card-top">
            <h2 className="forgot-title">Forgot Password?</h2>
            <p className="forgot-subtitle">
              Enter your university email to receive a password reset link.
            </p>
          </div>

          {message ? <div className="forgot-message">{message}</div> : null}

          <form className="forgot-form" onSubmit={handleSubmit} noValidate>
            <label className="forgot-label" htmlFor="fp-email">
              UNIVERSITY EMAIL ADDRESS
            </label>
            <div className="forgot-inputWrap">
              <span className="forgot-inputIcon" aria-hidden="true">
                ✉️
              </span>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@university.edu"
                className="forgot-input"
                required
              />
            </div>

            <button type="submit" className="forgot-submit" disabled={loading}>
              {loading ? 'Sending…' : 'Reset Password'}{' '}
              <span className="forgot-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>

          <div className="forgot-back">
            <Link className="forgot-backLink" to="/login" onClick={() => navigate('/login')}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

