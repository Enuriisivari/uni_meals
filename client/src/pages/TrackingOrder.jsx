import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './TrackingOrder.css'
import TopBar from '../components/TopBar.jsx'
import Footer from '../components/Footer.jsx'

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

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

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
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const {
    orderId = '#CC-00000-U',
    orderDbId = '',
    items = [],
    total = 0,
    subtotal = 0,
    serviceFee = 0,
    service = 'Pickup',
    deliveryMeta = { expected: 'Today, 12:45 PM', pickupPoint: 'The Central Commons' },
  } = location?.state || {}

  const normalizedOrderId = useMemo(() => {
    const raw = String(orderDbId || orderId || '')
    return raw.startsWith('#') ? raw.slice(1) : raw
  }, [orderDbId, orderId])

  useEffect(() => {
    document.title = 'UniMeals'
  }, [])

  useEffect(() => {
    if (!normalizedOrderId) return

    let active = true
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setLoadError('')
        const { data } = await axios.get(`${API_BASE_URL}/api/orders/${normalizedOrderId}`)
        if (!active) return
        setOrderData(data?.data || null)
      } catch (error) {
        if (!active) return
        setLoadError(error?.response?.data?.message || 'Failed to load order details.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchOrder()
    return () => {
      active = false
    }
  }, [normalizedOrderId])

  const estimatedArrival = deliveryMeta?.expected || 'Today, 12:45 PM'

  const status = useMemo(() => {
    const current = String(orderData?.status || '').toLowerCase()
    const delivered = current === 'completed' || current === 'delivered'
    const outForDelivery = current === 'ready' || current === 'out for delivery'
    const preparing = current === 'pending' || current === 'preparing'

    return {
      preparing,
      outForDelivery,
      delivered,
    }
  }, [orderData?.status])

  const viewItems = orderData?.items?.length
    ? orderData.items.map((it, idx) => ({
        id: `${it.menuItemId || it.name || 'item'}-${idx}`,
        name: it.name || 'Menu Item',
        qty: Number(it.quantity) || 1,
        unitPrice: Number(it.price) || 0,
      }))
    : items

  const viewSubtotal = orderData?.totalPrice ?? subtotal
  const viewTotal = orderData?.totalPrice ?? total
  const viewLocation = orderData?.deliveryLocation || deliveryMeta?.pickupPoint || 'Pickup point not set'
  const viewNotes = orderData?.notes || ''
  const displayOrderId = orderData?.id ? `#${orderData.id}` : orderId

  return (
    <div className="tracking-page">
      <TopBar />

      <main className="tracking-main">
        <div className="tracking-hero">
          <div className="tracking-trackLabel">TRACK YOUR FEAST</div>
          <h1 className="tracking-title">Order {displayOrderId}</h1>
          <div className="tracking-estArrival">
            Estimated Arrival: <b>{estimatedArrival}</b>
          </div>
          {loading ? <div className="tracking-estArrival">Loading latest order details...</div> : null}
          {loadError ? <div className="tracking-estArrival">{loadError}</div> : null}
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
                    {service === 'Delivery' ? 'Courier is on the way.' : 'Ready for pickup.'}
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
            {viewItems.length === 0 ? (
              <div className="tracking-detailRow">
                <div className="tracking-detailInfo">No items found.</div>
              </div>
            ) : (
              viewItems.map((it) => (
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
              {viewLocation}
            </div>
            {viewNotes ? <div className="tracking-deliveryText">Notes: {viewNotes}</div> : null}
            <div className="tracking-totalPaid">
              SUBTOTAL {toMoney(viewSubtotal)} • FEE {toMoney(serviceFee)} • TOTAL {toMoney(viewTotal)}
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
      <Footer />
    </div>
  )
}