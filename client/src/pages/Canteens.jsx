import { Link, useNavigate } from 'react-router-dom'
import './Canteens.css'

function CartIcon() {
  return (
    <svg className="canteens-cart-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function Star() {
  return (
    <svg className="canteens-star" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l3.1 6.6L22 9.2l-5 4.8L18.2 22 12 18.6 5.8 22 7 14l-5-4.8 6.9-.6L12 2z"
        fill="currentColor"
      />
    </svg>
  )
}

const CANTEENS = [
  {
    id: 1,
    rating: 4.8,
    location: 'ENGINEERING BLOCK',
    name: 'The Blueprint Bistro',
    description:
      'Fresh coffee, fresh salads, and build-your-own grain bowls tailored for productive lunch hours.',
    tags: ['COFFEE', 'HEALTHY'],
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    rating: 4.5,
    location: 'GLOBAL PLAZA',
    name: 'Wok & Wisdom',
    description:
      'Authentic Pan-Asian flavors featuring sizzling stir-fry, hand-pulled noodles, and fresh sushi rolls.',
    tags: ['ASIAN', 'HOT-MEAL'],
    image:
      'https://images.unsplash.com/photo-1559339352-11d035f7f8c8?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    rating: 4.9,
    location: 'ARTS & HUMANITIES',
    name: 'The Agora Kitchen',
    description:
      'Sun-drenched Mediterranean flavors. House-made hummus, grilled halloumi, and artisanal flatbreads.',
    tags: ['VEGAN', 'BISTRO'],
    image:
      'https://images.unsplash.com/photo-1529692236671-f1f6cf6d1e6e?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    rating: 4.3,
    location: 'SPORTS COMPLEX',
    name: 'Velocity Grill',
    description:
      'High-protein meals and gourmet burgers. The perfect fueling station for athletes and active students.',
    tags: ['PROTEIN', 'GRILL'],
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 5,
    rating: 4.6,
    location: 'CENTRAL LIBRARY',
    name: 'Chapters Cafe',
    description:
      'A quiet sanctuary offering seasonal pastries, herbal teas, and a selection of premium deli sandwiches.',
    tags: ['BAKERY', 'QUIET'],
    image:
      'https://images.unsplash.com/photo-1464306076886-da185f7a9c63?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 6,
    rating: 4.6,
    location: 'SCIENCE PARK',
    name: 'Elemental Juice',
    description:
      'Cold-pressed juices and nutrient-dense superfood bowls designed for peak cognitive performance.',
    tags: ['ORGANIC', 'QUICK'],
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?w=900&q=80&auto=format&fit=crop',
  },
]

function TrayOverlay() {
  return (
    <div className="canteens-tray" role="status" aria-live="polite">
      <div className="canteens-tray-head">
        <span className="canteens-tray-icon" aria-hidden="true">
          🥡
        </span>
        <div className="canteens-tray-title">CURRENT TRAY</div>
      </div>
      <div className="canteens-tray-empty">No items selected</div>
      <button type="button" className="canteens-tray-btn">
        View Orders
      </button>
    </div>
  )
}

function CanteenCard({ canteen, showTrayOverlay, onSelect }) {
  return (
    <article className="canteens-card">
      <div className="canteens-card-imageWrap">
        <img src={canteen.image} alt="" loading="lazy" className="canteens-card-image" />
        <div className="canteens-rating">
          <Star />
          <span>{canteen.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="canteens-card-body">
        <div className="canteens-card-location">{canteen.location}</div>
        <h3 className="canteens-card-name">{canteen.name}</h3>
        <p className="canteens-card-desc">{canteen.description}</p>

        <div className="canteens-card-footer">
          <div className="canteens-tags">
            {canteen.tags.map((t) => (
              <span key={t} className="canteens-tag">
                {t}
              </span>
            ))}
          </div>
          <button type="button" className="canteens-select-btn" onClick={onSelect}>
            SELECT
          </button>
        </div>
      </div>

      {showTrayOverlay ? (
        <div className="canteens-trayOverlayWrap">
          <TrayOverlay />
        </div>
      ) : null}
    </article>
  )
}

export default function Canteens() {
  const navigate = useNavigate()

  function handleSelect(canteenId) {
    // As requested: when user clicks SELECT on the 1st canteen, show the UI.
    if (canteenId === 1) {
      navigate('/canteen-menu')
    }
  }

  return (
    <div className="canteens-page">
      <header className="canteens-topnav">
        <div className="canteens-topnav-inner">
          <Link to="/" className="canteens-brand">
            UniMeals
          </Link>

          <nav className="canteens-nav" aria-label="Main">
            <Link to="/" className="canteens-nav-link">
              Home
            </Link>
            <Link to="/canteens" className="canteens-nav-link canteens-nav-link--active">
              Canteens
            </Link>
            <Link to="/orders" className="canteens-nav-link">
              Orders
            </Link>
            <Link to="/profile" className="canteens-nav-link">
              Profile
            </Link>
          </nav>

          <button type="button" className="canteens-cart-btn" aria-label="Open tray">
            <CartIcon />
          </button>
        </div>
      </header>

      <main className="canteens-main">
        <section className="canteens-hero">
          <h1 className="canteens-title">Campus Dining</h1>
          <p className="canteens-subtitle">
            Discover diverse culinary experiences across campus. From artisan bistros to global
            fast-casual hubs.
          </p>
        </section>

        <section className="canteens-filters">
          <div className="canteens-search">
            <span className="canteens-searchIcon" aria-hidden="true">
              🔍
            </span>
            <input
              className="canteens-searchInput"
              placeholder="Search for canteens or cuisines..."
              aria-label="Search canteens or cuisines"
            />
          </div>

          <div className="canteens-pillRow" role="group" aria-label="Filters">
            <button type="button" className="canteens-pill">
              ALL LOCATIONS
            </button>
            <button type="button" className="canteens-pill">
              VEGAN FRIENDLY
            </button>
            <button type="button" className="canteens-pill">
              OPEN NOW
            </button>
            <button type="button" className="canteens-pill">
              NEAR ME
            </button>
          </div>
        </section>

        <section className="canteens-grid">
          <CanteenCard
            canteen={CANTEENS[0]}
            onSelect={() => handleSelect(CANTEENS[0].id)}
          />
          <CanteenCard
            canteen={CANTEENS[1]}
            onSelect={() => handleSelect(CANTEENS[1].id)}
          />
          <CanteenCard
            canteen={CANTEENS[2]}
            onSelect={() => handleSelect(CANTEENS[2].id)}
          />
          <CanteenCard
            canteen={CANTEENS[3]}
            onSelect={() => handleSelect(CANTEENS[3].id)}
          />
          <CanteenCard
            canteen={CANTEENS[4]}
            showTrayOverlay
            onSelect={() => handleSelect(CANTEENS[4].id)}
          />
          <CanteenCard
            canteen={CANTEENS[5]}
            onSelect={() => handleSelect(CANTEENS[5].id)}
          />
        </section>
      </main>
    </div>
  )
}

