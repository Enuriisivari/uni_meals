import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './TrackingOrder.css'

function RunnerAvatar() {
  return (
    <div className="tracking-runnerAvatar" aria-hidden="true">
      <span>👤</span>
    </div>
  )
}

function StatusDot({ variant }) {
  return (
    <div
      className={
        'tracking-statusDot' +
        (variant === 'done' ? ' tracking-statusDot--done' : '') +
        (variant === 'out' ? ' tracking-statusDot--out' : '') +
        (variant === 'prep' ? ' tracking-statusDot--prep' : '')
      }
      aria-hidden="true"
    >
      ●
    </div>
  )
}

export default function TrackingOrder() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderId = location?.state?.orderId ?? '#CC-89241-U'

  useEffect(() => {
    document.title = 'UniMeals'
  }, [])

  return (
    <div className="tracking-page">
      <header className="tracking-topnav">
        <div className="tracking-topnav-inner">
          <Link to="/" className="tracking-serviceName">
            UniMeals
          </Link>
          <nav className="tracking-nav" aria-label="Main">
            <Link to="/" className="tracking-navLink">
              Home
            </Link>
            <Link to="/canteens" className="tracking-navLink">
              Canteens
            </Link>
            <Link
              to="/orders"
              className="tracking-navLink tracking-navLink--active"
            >
              Orders
            </Link>
            <Link to="/profile" className="tracking-navLink">
              Profile
            </Link>
          </nav>
          <div className="tracking-cart" aria-hidden="true">
            🛒
          </div>
        </div>
      </header>

      <main className="tracking-main">
        <div className="tracking-hero">
          <div className="tracking-trackLabel">TRACK YOUR FEAST</div>
          <h1 className="tracking-title">Order {orderId}</h1>
          <div className="tracking-estArrival">
            Estimated Arrival: <b>12:45 PM</b>
          </div>
        </div>

        <section className="tracking-topGrid">
          <div className="tracking-liveCard">
            <div className="tracking-liveTitle">Live Status</div>

            <div className="tracking-timeline">
              <div className="tracking-timelineRow">
                <StatusDot variant="prep" />
                <div className="tracking-timelineBody">
                  <div className="tracking-statusName">Preparing</div>
                  <div className="tracking-statusDesc">
                    Chef is crafting your artisanal meal at North Canteen.
                  </div>
                  <div className="tracking-statusMeta">COMPLETED 12:15 PM</div>
                </div>
              </div>

              <div className="tracking-timelineRow tracking-timelineRow--out">
                <StatusDot variant="out" />
                <div className="tracking-timelineBody">
                  <div className="tracking-statusName">Out for Delivery</div>
                  <div className="tracking-statusDesc">
                    Your order is on the way with Courier Alex.
                  </div>
                  <div className="tracking-statusTag">IN TRANSIT</div>
                </div>
              </div>

              <div className="tracking-timelineRow tracking-timelineRow--done">
                <StatusDot variant="done" />
                <div className="tracking-timelineBody">
                  <div className="tracking-statusName tracking-statusName--muted">
                    Delivered
                  </div>
                  <div className="tracking-statusDesc">
                    Estimated at Science Block A - Room 402.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tracking-rightCol">
            <div className="tracking-mapCard" aria-hidden="true">
              <div className="tracking-mapImg" />
              <div className="tracking-mapETA">2 mins away</div>
            </div>

            <div className="tracking-runnerCard">
              <div className="tracking-runnerTop">
                <RunnerAvatar />
                <div className="tracking-runnerInfo">
                  <div className="tracking-runnerName">Alex Johnson</div>
                  <div className="tracking-runnerMeta">
                    ⭐ 4.9 Runner
                  </div>
                </div>
              </div>
              <button type="button" className="tracking-contactBtn">
                📞 Contact Runner
              </button>
            </div>
          </div>
        </section>

        <section className="tracking-details">
          <div className="tracking-detailsTitle">Order Details</div>
          <div className="tracking-itemsList">
            <div className="tracking-detailRow">
              <div className="tracking-detailIcon">🍔</div>
              <div className="tracking-detailInfo">
                <div className="tracking-detailName">Truffle Umami Burger</div>
                <div className="tracking-detailMeta">QUANTITY: 1</div>
              </div>
              <div className="tracking-detailPrice">$12.50</div>
            </div>

            <div className="tracking-detailRow">
              <div className="tracking-detailIcon">☕</div>
              <div className="tracking-detailInfo">
                <div className="tracking-detailName">Cold Brew Coffee</div>
                <div className="tracking-detailMeta">QUANTITY: 1</div>
              </div>
              <div className="tracking-detailPrice">$4.50</div>
            </div>
          </div>

          <div className="tracking-deliveryCard">
            <div className="tracking-deliveryBadge">DELIVERY TO</div>
            <div className="tracking-deliveryText">
              Main Science Library, Floor 4
            </div>
            <div className="tracking-totalPaid">TOTAL PAID $17.00</div>
          </div>
        </section>

        <button
          type="button"
          className="tracking-chatFab"
          onClick={() => navigate('/orders')}
          aria-label="Chat"
        >
          💬
        </button>
      </main>
    </div>
  )
}

