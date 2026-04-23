import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-brand">
          <span className="app-footer-logo">Uni Meals</span>
          <p className="app-footer-tagline">
            Revolutionizing campus dining - one order, one tray, one happy student at a time.
          </p>
        </div>
        <nav className="app-footer-links" aria-label="Footer">
          <Link to="/">About</Link>
          <Link to="/">Contact</Link>
          <Link to="/">Help</Link>
        </nav>
        <p className="app-footer-copy">© 2024 Uni Meals. All rights reserved.</p>
      </div>
    </footer>
  )
}
