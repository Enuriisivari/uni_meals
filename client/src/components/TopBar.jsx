import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './TopBar.css'

const USER_KEY = 'uni_meals_user'
const TOKEN_KEY = 'uni_meals_token'
const CART_KEY = 'unimeals_cart'

function CartIcon() {
  return (
    <svg className="topbar-cart-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h15l-1.5 9h-12L6 7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M6 7L5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  )
}

function readAuth() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    return Boolean(raw && token)
  } catch {
    return false
  }
}

function readCartCount() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    const items = raw ? JSON.parse(raw) : []
    if (!Array.isArray(items)) return 0
    return items.reduce((sum, item) => sum + Number(item.qty || 1), 0)
  } catch {
    return 0
  }
}

export default function TopBar({ showCart = true }) {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(() => readAuth())
  const [cartCount, setCartCount] = useState(() => readCartCount())

  useEffect(() => {
    const syncState = () => {
      setIsLoggedIn(readAuth())
      setCartCount(readCartCount())
    }

    syncState()
    window.addEventListener('storage', syncState)
    window.addEventListener('focus', syncState)
    return () => {
      window.removeEventListener('storage', syncState)
      window.removeEventListener('focus', syncState)
    }
  }, [])

  const cartBadge = useMemo(() => (cartCount > 99 ? '99+' : String(cartCount)), [cartCount])

  function handleLogout() {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="topbar-brand">
          UniMeals
        </Link>

        <nav className="topbar-nav" aria-label="Main">
          <NavLink to="/" className={({ isActive }) => `topbar-link${isActive ? ' topbar-link--active' : ''}`}>
            Home
          </NavLink>
          <NavLink
            to="/canteens"
            className={({ isActive }) => `topbar-link${isActive ? ' topbar-link--active' : ''}`}
          >
            Canteens
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `topbar-link${isActive ? ' topbar-link--active' : ''}`}>
            Orders
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `topbar-link${isActive ? ' topbar-link--active' : ''}`}
          >
            Profile
          </NavLink>
        </nav>

        <div className="topbar-actions">
          {showCart && isLoggedIn ? (
            <button type="button" className="topbar-cart-btn" onClick={() => navigate('/orders')} aria-label="Open cart">
              <CartIcon />
              {cartCount > 0 ? <span className="topbar-cart-badge">{cartBadge}</span> : null}
            </button>
          ) : null}

          {isLoggedIn ? (
            <button type="button" className="topbar-auth-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login-selection" className="topbar-auth-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
