import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import './TrackingOrder.css'

function RunnerAvatar() {
  return (
    <div className="tracking-runnerAvatar" aria-hidden="true">
      <span>👤</span>
    </div>
  )
}

function toMoney(n) {
  return `Rs. ${Number(n || 0).toFixed(2)}`
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

  const {
    orderId = '#CC-00000-U',
    items = [],
    total = 0,
    subtotal = 0,
    serviceFee = 0,
    service = 'Pickup',
    deliveryMeta = { expected: 'Today, 12:45 PM', pickupPoint: 'The Central Commons' },
  } = location?.state || {}

  useEffect(() => {
    document.title = 'UniMeals'
  }, [])

  const estimatedArrival = deliveryMeta?.expected || 'Today, 12:45 PM'

  const status = useMemo(() => {
    // simple fake status for now
    return {
      preparing: true,
      outForDelivery: service === 'Delivery',
      delivered: false,
    }
  }, [service])

  return (
    <div className="tracking-page">
      <header className="tracking-topnav">
        <div className="tracking-topnav-inner">
          <Link to="/" className="tracking-serviceName">UniMeals</Link>
          <nav className="tracking-nav" aria-label="Main">
            <Link to="/" className="tracking-navLink">Home</Link>
            <Link to="/canteens" className="tracking-navLink">Canteens</Link>
            <Link to="/orders" className="tracking-navLink tracking-navLink--active">Orders</Link>
            <Link to="/profile" className="tracking-navLink">Profile</Link>
          </nav>
          <div className="tracking-cart" aria-hidden="true">🛒</div>
        </div>
      </header>

      <main className="tracking-main">
        <div className="tracking-hero">
          <div className="tracking-trackLabel">TRACK YOUR FEAST</div>
          <h1 className="tracking-title">Order {orderId}</h1>
          <div className="tracking-estArrival">
            Estimated Arrival: <b>{estimatedArrival}</b>
          </div>
        </div>

        <section className="tracking-topGrid">
          <div className="tracking-liveCard">
            <div className="tracking-liveTitle">Live Status</div>

            <div className="tracking-timeline">
              <div className="tracking-timelineRow">
                <StatusDot variant={status.preparing ? 'prep' : ''} />
                <div className="tracking-timelineBody">
                  <div className="tracking-statusName">Preparing</div>
                  <div className="tracking-statusDesc">Your order is being prepared.</div>
                  {status.preparing && <div className="tracking-statusMeta">IN PROGRESS</div>}
                </div>
              </div>

              <div className="tracking-timelineRow tracking-timelineRow--out">
                <StatusDot variant={status.outForDelivery ? 'out' : ''} />
                <div className="tracking-timelineBody">
                  <div className="tracking-statusName">Out for Delivery</div>
                  <div className="tracking-statusDesc">
                    {service === 'Delivery' ? 'Courier is on the way.' : 'Pickup selected.'}
                  </div>
                  {status.outForDelivery && <div className="tracking-statusTag">IN TRANSIT</div>}
                </div>
              </div>

              <div className="tracking-timelineRow tracking-timelineRow--done">
                <StatusDot variant={status.delivered ? 'done' : ''} />
                <div className="tracking-timelineBody">
                  <div className="tracking-statusName tracking-statusName--muted">Delivered</div>
                  <div className="tracking-statusDesc">
                    {deliveryMeta?.pickupPoint || 'Pickup point assigned.'}
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
                  <div className="tracking-runnerName">Campus Runner</div>
                  <div className="tracking-runnerMeta">⭐ 4.9 Runner</div>
                </div>
              </div>
              <button type="button" className="tracking-contactBtn">📞 Contact Runner</button>
            </div>
          </div>
        </section>

        <section className="tracking-details">
          <div className="tracking-detailsTitle">Order Details</div>
          <div className="tracking-itemsList">
            {items.length === 0 ? (
              <div className="tracking-detailRow">
                <div className="tracking-detailInfo">No items found.</div>
              </div>
            ) : (
              items.map((it) => (
                <div key={it.id} className="tracking-detailRow">
                  <div className="tracking-detailIcon">🍽️</div>
                  <div className="tracking-detailInfo">
                    <div className="tracking-detailName">{it.name}</div>
                    <div className="tracking-detailMeta">QUANTITY: {it.qty}</div>
                  </div>
                  <div className="tracking-detailPrice">
                    {toMoney(it.unitPrice * it.qty)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="tracking-deliveryCard">
            <div className="tracking-deliveryBadge">
              {service === 'Delivery' ? 'DELIVERY TO' : 'PICKUP POINT'}
            </div>
            <div className="tracking-deliveryText">
              {deliveryMeta?.pickupPoint || 'Pickup point not set'}
            </div>
            <div className="tracking-totalPaid">
              SUBTOTAL {toMoney(subtotal)} • FEE {toMoney(serviceFee)} • TOTAL {toMoney(total)}
            </div>
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