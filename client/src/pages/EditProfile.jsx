import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './EditProfile.css'

const USER_KEY = 'uni_meals_user'
const TOKEN_KEY = 'uni_meals_token'
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

function SafeUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function Avatar({ name }) {
  const initials = useMemo(() => {
    const parts = String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    const first = parts[0]?.[0] || ''
    const second = parts[1]?.[0] || ''
    return (first + second).toUpperCase() || 'U'
  }, [name])

  return <div className="edit-avatar">{initials}</div>
}

export default function EditProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => SafeUser())
  const token = localStorage.getItem(TOKEN_KEY) || ''

  const studentEmail = String(user?.email || '')
  const studentId = studentEmail.includes('@') ? studentEmail.split('@')[0] : String(user?.id || '').slice(0, 8)

  const [fullName, setFullName] = useState(user?.name || '')
  const [universityEmail, setUniversityEmail] = useState(user?.email || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) return

    let active = true
    const fetchCurrentStudent = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/student/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!active) return
        setUser(data)
        setFullName(data?.name || '')
        setUniversityEmail(data?.email || '')
      } catch (error) {
        if (!active) return
        setErrorMsg(error?.response?.data?.error || 'Failed to load student profile.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchCurrentStudent()
    return () => {
      active = false
    }
  }, [token])

  function cancel() {
    navigate('/profile')
  }

  async function save() {
    if (!token) return
    try {
      setLoading(true)
      setErrorMsg('')
      const { data } = await axios.put(
        `${API_BASE_URL}/api/auth/student/me`,
        {
          name: fullName,
          email: universityEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (data?.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setUser(data.user)
      }
      setToastMsg('Profile updated successfully')
      setTimeout(() => {
        setToastMsg('')
        navigate('/profile')
      }, 900)
    } catch (error) {
      setErrorMsg(error?.response?.data?.error || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!newPassword.trim()) {
      setErrorMsg('Please enter a new password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      setErrorMsg('')
      await axios.post(`${API_BASE_URL}/api/auth/student/forgot-password`, {
        email: universityEmail,
        newPassword,
      })
      setNewPassword('')
      setConfirmPassword('')
      setToastMsg('Password updated successfully')
      setTimeout(() => setToastMsg(''), 1200)
    } catch (error) {
      setErrorMsg(error?.response?.data?.error || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteAccount() {
    if (!token) return
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return
    try {
      setLoading(true)
      setErrorMsg('')
      await axios.delete(`${API_BASE_URL}/api/auth/student/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      navigate('/signup')
    } catch (error) {
      setErrorMsg(error?.response?.data?.error || 'Failed to delete account.')
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="edit-page">
        <div className="edit-unauth">
          <h2>Please login</h2>
          <p>You need an account to edit your profile.</p>
          <Link className="edit-unauthLink" to="/login">
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-page">
      {toastMsg ? (
        <div className="edit-toast" role="status" aria-live="polite">
          {toastMsg}
        </div>
      ) : null}
      <header className="edit-topnav">
        <div className="edit-topnav-inner">
          <Link to="/" className="edit-brand">
            UniMeals
          </Link>
          <nav className="edit-nav" aria-label="Main">
            <Link to="/" className="edit-navLink">
              Home
            </Link>
            <Link to="/canteens" className="edit-navLink">
              Canteens
            </Link>
            <Link to="/orders" className="edit-navLink">
              Orders
            </Link>
            <Link to="/profile" className="edit-navLink edit-navLink--active">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="edit-main">
        <div className="edit-header">
          <h1 className="edit-title">Edit Profile</h1>
          <p className="edit-subtitle">
            Update your account details and security settings.
          </p>
        </div>

        <section className="edit-layout">
          <div className="edit-leftCol">
            <div className="edit-userCard">
              <div className="edit-userAvatarWrap">
                <Avatar name={fullName || user.name} />
              </div>
              <div className="edit-userName">{fullName || user.name}</div>
              <div className="edit-userMeta">Student Account</div>

              <div className="edit-statusCard">
                <div className="edit-statusRow">
                  <span className="edit-statusIcon" aria-hidden="true">
                    ✅
                  </span>
                  <span className="edit-statusTitle">Student Status</span>
                </div>
                <div className="edit-statusText">
                  Your account is connected to the student authentication service.
                </div>
              </div>
            </div>
          </div>

          <div className="edit-rightCol">
            <div className="edit-panel">
              {errorMsg ? (
                <p style={{ color: '#b91c1c', fontWeight: 600, margin: '0 0 0.8rem' }}>{errorMsg}</p>
              ) : null}
              <div className="edit-panelTitle">
                <span className="edit-panelIcon" aria-hidden="true">
                  👤
                </span>
                Personal Information
              </div>

              <div className="edit-formGrid">
                <label className="edit-field">
                  <div className="edit-label">NAME</div>
                  <input
                    className="edit-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>

                <label className="edit-field">
                  <div className="edit-label">STUDENT ID</div>
                  <input className="edit-input edit-input--muted" value={studentId} disabled />
                </label>

                <label className="edit-field edit-field--wide">
                  <div className="edit-label">UNIVERSITY EMAIL</div>
                  <input
                    className="edit-input"
                    value={universityEmail}
                    onChange={(e) => setUniversityEmail(e.target.value)}
                  />
                </label>
              </div>

              <div className="edit-sectionDivider" />

              <div className="edit-panelTitle">
                <span className="edit-panelIcon" aria-hidden="true">
                  🔐
                </span>
                Forgot Password
              </div>

              <div className="edit-formGrid">
                <label className="edit-field edit-field--wide">
                  <div className="edit-label">NEW PASSWORD</div>
                  <input
                    type="password"
                    className="edit-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </label>
                <label className="edit-field edit-field--wide">
                  <div className="edit-label">CONFIRM PASSWORD</div>
                  <input
                    type="password"
                    className="edit-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </label>
                <div className="edit-field edit-field--wide">
                  <button type="button" className="edit-cancelBtn" onClick={handleForgotPassword} disabled={loading}>
                    {loading ? 'Processing...' : 'Reset Password'}
                  </button>
                </div>
              </div>

              <div className="edit-sectionDivider" />

              <div className="edit-accountCard">
                <div className="edit-accountTitle">
                  <span aria-hidden="true">⚠️</span> Danger Zone
                </div>
                <button
                  type="button"
                  className="edit-accountRow"
                  style={{ width: '100%', textAlign: 'left', color: '#b91c1c' }}
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  Delete Current Student Account <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <div className="edit-actions">
              <button type="button" className="edit-cancelBtn" onClick={cancel} disabled={loading}>
                Cancel
              </button>
              <button type="button" className="edit-saveBtn" onClick={save} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

