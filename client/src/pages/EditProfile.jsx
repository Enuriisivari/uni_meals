import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './EditProfile.css'

const USER_KEY = 'uni_meals_user'

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

function Toggle({ checked, onChange, label }) {
  return (
    <label className="edit-toggle" aria-label={label}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="edit-toggleTrack" aria-hidden="true">
        <span className="edit-toggleThumb" aria-hidden="true" />
      </span>
    </label>
  )
}

export default function EditProfile() {
  const navigate = useNavigate()
  const user = SafeUser()

  const studentEmail = String(user?.email || '')
  const studentId = studentEmail.includes('@') ? studentEmail.split('@')[0] : ''

  const [fullName, setFullName] = useState(user?.name || '')
  const [major, setMajor] = useState('Computer Science')
  const [universityEmail, setUniversityEmail] = useState(user?.email || '')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [toastMsg, setToastMsg] = useState('')

  useEffect(() => {
    if (!user) return
    setFullName(user?.name || '')
    setUniversityEmail(user?.email || '')
  }, [user])

  function cancel() {
    navigate('/profile')
  }

  function save() {
    if (!user) return
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        ...user,
        name: fullName,
        email: universityEmail,
      }),
    )
    setToastMsg('Successfully chage the details')
    // Delay navigation so user can see the popup message.
    setTimeout(() => {
      setToastMsg('')
      navigate('/profile')
    }, 850)
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
            Update your campus dining preferences and account details.
          </p>
        </div>

        <section className="edit-layout">
          <div className="edit-leftCol">
            <div className="edit-userCard">
              <div className="edit-userAvatarWrap">
                <Avatar name={fullName || user.name} />
              </div>
              <div className="edit-userName">{fullName || user.name}</div>
              <div className="edit-userMeta">Computer Science</div>
              <button type="button" className="edit-photoBtn">
                Change Photo
              </button>

              <div className="edit-statusCard">
                <div className="edit-statusRow">
                  <span className="edit-statusIcon" aria-hidden="true">
                    ✅
                  </span>
                  <span className="edit-statusTitle">Student Status</span>
                </div>
                <div className="edit-statusText">
                  Your account is verified with University ID. Major updates may require registrar
                  approval.
                </div>
              </div>
            </div>
          </div>

          <div className="edit-rightCol">
            <div className="edit-panel">
              <div className="edit-panelTitle">
                <span className="edit-panelIcon" aria-hidden="true">
                  👤
                </span>
                Personal Information
              </div>

              <div className="edit-formGrid">
                <label className="edit-field">
                  <div className="edit-label">User</div>
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

                <label className="edit-field">
                  <div className="edit-label">MAJOR/COURSE</div>
                  <input className="edit-input" value={major} onChange={(e) => setMajor(e.target.value)} />
                </label>

                <label className="edit-field edit-field--wide">
                  <div className="edit-label">UNIVERSITY EMAIL</div>
                  <input
                    className="edit-input edit-input--muted"
                    value={universityEmail}
                    onChange={(e) => setUniversityEmail(e.target.value)}
                  />
                </label>
              </div>

              <div className="edit-sectionDivider" />

              <div className="edit-panelTitle">
                <span className="edit-panelIcon" aria-hidden="true">
                  🔔
                </span>
                Notification Preferences
              </div>

              <div className="edit-notifRows">
                <div className="edit-notifRow">
                  <div className="edit-notifLeft">
                    <div className="edit-notifName">Email Notifications</div>
                    <div className="edit-notifDesc">
                      Daily menu updates and order receipts
                    </div>
                  </div>
                  <Toggle
                    checked={emailNotifs}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                    label="Email notifications"
                  />
                </div>

                <div className="edit-notifRow">
                  <div className="edit-notifLeft">
                    <div className="edit-notifName">Push Notifications</div>
                    <div className="edit-notifDesc">Real-time alerts when your meal is ready</div>
                  </div>
                  <Toggle
                    checked={pushNotifs}
                    onChange={(e) => setPushNotifs(e.target.checked)}
                    label="Push notifications"
                  />
                </div>
              </div>

              <div className="edit-sectionDivider" />

              <div className="edit-accountCard">
                <div className="edit-accountTitle">
                  <span aria-hidden="true">🔒</span> Account Settings
                </div>
                <Link to="/change-password" className="edit-accountRow">
                  Change Password <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="edit-actions">
              <button type="button" className="edit-cancelBtn" onClick={cancel}>
                Cancel
              </button>
              <button type="button" className="edit-saveBtn" onClick={save}>
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

