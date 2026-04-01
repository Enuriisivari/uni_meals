import { Link, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import './Profile.css'

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

  return <div className="profile-avatar">{initials}</div>
}

function Footer() {
  return (
    <footer className="profile-footer">
      <div className="profile-footer-inner">
        <div className="profile-footer-col">
          <div className="profile-footer-brand">UniMeals</div>
          <p className="profile-footer-text">
            Elevating campus dining through curated experiences and digital ease.
          </p>
        </div>
        <div className="profile-footer-col">
          <div className="profile-footer-head">Explore</div>
          <a className="profile-footer-link" href="#">
            Campus Canteens
          </a>
          <a className="profile-footer-link" href="#">
            Daily Specials
          </a>
          <a className="profile-footer-link" href="#">
            Dietary Filters
          </a>
        </div>
        <div className="profile-footer-col">
          <div className="profile-footer-head">Support</div>
          <a className="profile-footer-link" href="#">
            Help Center
          </a>
          <a className="profile-footer-link" href="#">
            Contact Us
          </a>
          <a className="profile-footer-link" href="#">
            Privacy Policy
          </a>
        </div>
        <div className="profile-footer-col">
          <div className="profile-footer-head">Connect</div>
          <div className="profile-social-row">
            <a className="profile-social" href="#" aria-label="Google">
              G
            </a>
            <a className="profile-social" href="#" aria-label="Chat">
              @
            </a>
          </div>
        </div>
      </div>
      <div className="profile-footer-copy">
        © 2024 UNI MEALS. ALL RIGHTS RESERVED. PART OF UNIVERSITY SERVICES.
      </div>
    </footer>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const user = SafeUser()
  const studentEmail = String(user?.email || '')
  const studentIdFromEmail = studentEmail.includes('@')
    ? studentEmail.split('@')[0]
    : ''
  const displayName = studentIdFromEmail || user?.name || 'Student'

  function signOut() {
    localStorage.removeItem(USER_KEY)
    navigate('/')
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-unauth">
          <h2>Please login</h2>
          <p>You need an account to view your profile.</p>
          <Link className="profile-unauth-link" to="/login">
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <header className="profile-topnav">
        <div className="profile-topnav-inner">
          <Link to="/" className="profile-brand">
            UniMeals
          </Link>
          <nav className="profile-nav" aria-label="Main">
            <Link to="/" className="profile-nav-link">
              Home
            </Link>
            <Link to="/canteens" className="profile-nav-link">
              Canteens
            </Link>
            <Link to="/orders" className="profile-nav-link">
              Orders
            </Link>
            <Link to="/profile" className="profile-nav-link profile-nav-link--active">
              Profile
            </Link>
          </nav>
          <div className="profile-topnav-actions" aria-hidden="true">
            <div className="profile-bell">🔔</div>
            <div className="profile-cart">🛒</div>
            <div className="profile-usrDot">
              <Avatar name={user.name} />
            </div>
          </div>
        </div>
      </header>

      <main className="profile-main">
        <section className="profile-userCard">
          <div className="profile-userAvatar">
            <Avatar name={displayName} />
          </div>

          <div className="profile-userInfo">
            <div className="profile-userName">{displayName}</div>
            <div className="profile-userMeta">
              <span className="profile-metaItem">
                <span className="profile-metaIcon">🆔</span>
                ID: {studentIdFromEmail || String(user.id || user._id || '').slice(0, 8) || '—'}
              </span>
              <span className="profile-metaItem">
                <span className="profile-metaIcon">🎓</span>
                Computer Science
              </span>
              <span className="profile-metaItem">
                <span className="profile-metaIcon">✉️</span>
                {user.email || '—'}
              </span>
            </div>
          </div>

          <div className="profile-userActions">
            <Link to="/edit-profile" className="profile-editBtn">
              Edit Profile
            </Link>
            <button type="button" className="profile-signOutBtn" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </section>

        <section className="profile-grid">
          <div className="profile-leftCol">
            <div className="profile-orderCard">
              <div className="profile-orderTop">
                <span className="profile-orderBadge">ONGOING ORDER</span>
                <span className="profile-orderId">Order #1234</span>
              </div>
              <div className="profile-orderSub">
                From The Blueprint Bistro
                <span className="profile-orderX" aria-hidden="true">
                  ✕
                </span>
              </div>
              <div className="profile-progressWrap">
                <div className="profile-progressRow">
                  <span className="profile-progressDot">▪</span>
                  <div>
                    <div className="profile-progressTitle">Preparing your meal</div>
                    <div className="profile-progressEta">Estimated ready in 12 minutes</div>
                  </div>
                </div>
                <div className="profile-progressBar" />
              </div>
            </div>

            <div className="profile-ordersSection">
              <div className="profile-ordersHead">
                <div className="profile-ordersTitle">Recent Orders</div>
                <Link className="profile-viewAll" to="/orders">
                  View All
                </Link>
              </div>
              <div className="profile-ordersSubtitle">
                Your culinary journey so far
              </div>

              <div className="profile-recentList">
                <div className="profile-recentRow">
                  <div className="profile-recentLeft">
                    <div className="profile-recentIcon">📜</div>
                    <div>
                      <div className="profile-recentName">Artisan Pepperoni Pizza</div>
                      <div className="profile-recentMeta">Oct 24 · Chapters Cafe</div>
                    </div>
                  </div>
                  <div className="profile-recentPrice">$12.50</div>
                </div>
                <div className="profile-recentRow">
                  <div className="profile-recentLeft">
                    <div className="profile-recentIcon">🍔</div>
                    <div>
                      <div className="profile-recentName">Double Smash Burger Combo</div>
                      <div className="profile-recentMeta">Oct 22 · The Blueprint Bistro</div>
                    </div>
                  </div>
                  <div className="profile-recentPrice">$15.90</div>
                </div>
                <div className="profile-recentRow">
                  <div className="profile-recentLeft">
                    <div className="profile-recentIcon">🥗</div>
                    <div>
                      <div className="profile-recentName">Vegan Buddha Bowl</div>
                      <div className="profile-recentMeta">Oct 20 · Green Garden</div>
                    </div>
                  </div>
                  <div className="profile-recentPrice">$10.00</div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-rightCol">
            <div className="profile-card">
              <div className="profile-cardTitle">Account Settings</div>
              <Link
                to="/edit-profile"
                className="profile-settingRow profile-settingRow--link"
              >
                <div className="profile-settingLeft">
                  <span className="profile-settingIcon">✏️</span>
                  Edit Profile Info
                </div>
                <span className="profile-settingChevron">›</span>
              </Link>
              <Link
                to="/change-password"
                className="profile-settingRow profile-settingRow--link"
              >
                <div className="profile-settingLeft">
                  <span className="profile-settingIcon">🔒</span>
                  Security & Password
                </div>
                <span className="profile-settingChevron">›</span>
              </Link>
              <div className="profile-settingRow">
                <div className="profile-settingLeft">
                  <span className="profile-settingIcon">💳</span>
                  Payment Methods
                </div>
                <span className="profile-settingChevron">›</span>
              </div>
              <div className="profile-settingRow profile-settingRow--last">
                <div className="profile-settingLeft">
                  <span className="profile-settingIcon">⚙️</span>
                  App Preferences
                </div>
                <span className="profile-settingChevron">›</span>
              </div>
            </div>

            <div className="profile-card profile-favs">
              <div className="profile-cardTitle">Favorites</div>
              <div className="profile-favTiles">
                <div className="profile-favTile">
                  <div className="profile-favImg" />
                  <div className="profile-favName">The Blueprint Bistro</div>
                </div>
                <div className="profile-favTile">
                  <div className="profile-favImg profile-favImg--2" />
                  <div className="profile-favName">Chapters Cafe</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

