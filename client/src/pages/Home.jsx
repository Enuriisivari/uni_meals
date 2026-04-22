import { Link } from 'react-router-dom'
import './Home.css'

const HERO_BG =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80&auto=format&fit=crop'

const CANTEENS = [
  {
    id: 1,
    name: 'Central Hub Dining',
    location: 'Main Plaza',
    cuisine: 'Continental',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Quad Grill & Fries',
    location: 'North Quad',
    cuisine: 'American',
    rating: '4.7',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=640&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Green Leaf Vegan',
    location: 'Science Wing',
    cuisine: 'Plant-based',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'East Noodle Bar',
    location: 'East Hall',
    cuisine: 'Asian',
    rating: '4.6',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=640&q=80&auto=format&fit=crop',
  },
]

function IconSearch() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15zM21 21l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconBasket() {
  return (
    <svg className="home-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h15l-1.5 9h-12L6 7zm0 0L5 3H2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  )
}

function IconForkKnife() {
  return (
    <svg className="home-feature-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M14 6v14c0 2 1.5 3.5 3.5 3.5H18V42" stroke="currentColor" strokeWidth="2.5" />
      <path d="M10 6v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 6v36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 6c0 8-4 12-4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function IconTruck() {
  return (
    <svg className="home-feature-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M6 14h24v16H6V14zm24 4h6l4 6v6h-4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="34" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="34" cy="34" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg className="home-feature-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="10" y="8" width="28" height="32" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 16h20M14 22h12M14 28h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconStore() {
  return (
    <svg className="home-step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M8 20h32v22H8V20zm0 0V12l4-6h24l4 6v8" stroke="currentColor" strokeWidth="2.5" />
      <path d="M16 42V28h16v14" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}

function IconTap() {
  return (
    <svg className="home-step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M18 38V22l-4-2v-6c0-2 2-4 4-4s4 2 4 4v14l4-2v-8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30 14v20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function IconTray() {
  return (
    <svg className="home-step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M8 18h32l-4 20H12L8 18z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M4 18h40" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header-inner">
          <Link to="/" className="home-logo">
            Uni Meals
          </Link>
          <nav className="home-nav" aria-label="Main">
            <Link to="/" className="home-nav-link home-nav-link--active">
              Home
            </Link>
            <Link to="/canteens" className="home-nav-link">
              Canteens
            </Link>
            <Link to="/orders" className="home-nav-link">
              Orders
            </Link>
            <Link to="/profile" className="home-nav-link">
              Profile
            </Link>
          </nav>
          <div className="home-auth">
            <Link to="/login-selection" className="home-login">
              Login
            </Link>
            <Link to="/signup" className="home-btn home-btn--primary home-btn--sm">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section className="home-hero" style={{ '--hero-bg': `url(${HERO_BG})` }}>
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Order Your Favorite <span className="home-text-accent">Campus Meals</span> Easily.
          </h1>
          <p className="home-hero-sub">
            Browse canteens, order food, and skip the queue! The digital campus cafeteria in your
            pocket.
          </p>
        </div>
      </section>

      <section className="home-section home-quick">
        <div className="home-container">
          <div className="home-feature-grid">
            <article className="home-feature-card">
              <IconForkKnife />
              <h3 className="home-feature-title">Order Food</h3>
              <p className="home-feature-text">
                Pick a canteen, add dishes to your tray, and pay securely in seconds.
              </p>
              <span className="home-feature-link">EXPLORE MENU →</span>
            </article>
            <article className="home-feature-card">
              <IconTruck />
              <h3 className="home-feature-title">Track Order</h3>
              <p className="home-feature-text">
                Follow prep status in real time and know exactly when your meal is ready.
              </p>
              <span className="home-feature-link">CHECK STATUS →</span>
            </article>
            <article className="home-feature-card">
              <IconMenu />
              <h3 className="home-feature-title">View Menu</h3>
              <p className="home-feature-text">
                See weekly specials, dietary tags, and prices before you line up.
              </p>
              <span className="home-feature-link">WEEKLY PLAN →</span>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-canteens" id="canteens">
        <div className="home-container">
          <div className="home-section-head">
            <div>
              <h2 className="home-section-title">Popular Canteens</h2>
              <p className="home-section-desc">The highest-rated spots on campus, updated weekly.</p>
            </div>
            <Link to="/canteens" className="home-section-link">
              View All Canteens
            </Link>
          </div>
          <div className="home-canteen-grid">
            {CANTEENS.map((c) => (
              <article key={c.id} className="home-canteen-card">
                <div className="home-canteen-image-wrap">
                  <img src={c.image} alt="" className="home-canteen-image" loading="lazy" />
                  <span className="home-canteen-rating">★ {c.rating}</span>
                </div>
                <div className="home-canteen-body">
                  <h3 className="home-canteen-name">{c.name}</h3>
                  <p className="home-canteen-meta">
                    {c.location} <span aria-hidden="true">•</span> {c.cuisine}
                  </p>
                  <button type="button" className="home-btn home-btn--primary home-btn--block">
                    View Menu
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-how">
        <div className="home-container">
          <p className="home-tag">PROCESS</p>
          <h2 className="home-how-title">Hungry? Here&apos;s how it works</h2>
          <div className="home-steps">
            <div className="home-step-line" aria-hidden="true" />
            <div className="home-step">
              <div className="home-step-circle">
                <IconStore />
              </div>
              <h3 className="home-step-title">Choose Canteen</h3>
              <p className="home-step-text">
                Browse open locations, cuisines, and wait times near your next class.
              </p>
            </div>
            <div className="home-step">
              <div className="home-step-circle">
                <IconTap />
              </div>
              <h3 className="home-step-title">Order Food</h3>
              <p className="home-step-text">
                Build your tray, apply meal plans or cards, and confirm in one tap.
              </p>
            </div>
            <div className="home-step">
              <div className="home-step-circle">
                <IconTray />
              </div>
              <h3 className="home-step-title">Pick Up / Delivery</h3>
              <p className="home-step-text">
                Grab at the counter when ready—or choose campus delivery where available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-promo">
        <div className="home-container home-promo-inner">
          <div className="home-promo-copy">
            <h2 className="home-promo-title">Skip the Lunch Rush. Every. Single. Day.</h2>
            <p className="home-promo-text">
              Uni Meals syncs with your campus ID, shows live kitchen load, and keeps your
              favorites one tap away—so you eat on your schedule, not the queue&apos;s.
            </p>
            <div className="home-store-btns">
              <a href="#" className="home-store-btn">
                App Store
              </a>
              <a href="#" className="home-store-btn">
                Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-container home-footer-inner">
          <div className="home-footer-brand">
            <span className="home-logo">Uni Meals</span>
            <p className="home-footer-tagline">
              Revolutionizing campus dining—one order, one tray, one happy student at a time.
            </p>
          </div>
          <nav className="home-footer-links" aria-label="Footer">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Help</a>
          </nav>
          <p className="home-footer-copy">© 2024 Uni Meals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
