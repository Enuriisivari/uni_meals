import { Link } from 'react-router-dom'
import './PlaceholderPage.css'

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="placeholder">
      <header className="placeholder-header">
        <Link to="/" className="placeholder-logo">
          Uni Meals
        </Link>
      </header>
      <main className="placeholder-main">
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-desc">{description}</p>
        <Link to="/" className="placeholder-back">
          ← Back to home
        </Link>
      </main>
    </div>
  )
}
