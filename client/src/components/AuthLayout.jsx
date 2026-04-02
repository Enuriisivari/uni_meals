import { Link } from 'react-router-dom'
import '../styles/authPages.css'

function IconLogo() {
  return (
    <svg className="login-logo-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M8 4v20M8 4c0 4 2 6 4 6M12 10v14M20 4v24M24 4v8c0 2 2 4 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AuthLayout({ children }) {
  return (
    <div className="login-page">
      <div className="login-shell">
        <aside className="login-brand">
          <Link to="/" className="login-brand-logo">
            <IconLogo />
            <span>UniMeals</span>
          </Link>
          <div className="login-brand-body">
            <h1 className="login-brand-title">
              Fueling your <span className="login-brand-accent">academic journey.</span>
            </h1>
            <p className="login-brand-sub">
              Fresh, chef-curated meals delivered straight to your university campus locations.
            </p>
          </div>
          <blockquote className="login-testimonial">
            <span className="login-testimonial-dot" aria-hidden="true" />
            <p className="login-testimonial-quote">
              &ldquo;The best way to manage my lunch breaks between lectures.&rdquo;
            </p>
            <footer className="login-testimonial-by">— Sarah, Computer Science</footer>
          </blockquote>
        </aside>
        <main className="login-main">{children}</main>
      </div>
    </div>
  )
}
