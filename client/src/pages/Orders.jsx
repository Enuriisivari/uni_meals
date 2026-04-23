import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Orders.css'
import TopBar from '../components/TopBar.jsx'
import Footer from '../components/Footer.jsx'

function TrashIcon() {
  return (
    <svg className="orders-trash" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 7l1 14h10l1-14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Stepper({ value, onDec, onInc }) {
  return (
    <div className="orders-stepper" aria-label="Quantity">
      <button type="button" className="orders-stepBtn" onClick={onDec} aria-label="Decrease">
        -
      </button>
      <div className="orders-stepVal" aria-live="polite">
        {value}
      </div>
      <button type="button" className="orders-stepBtn" onClick={onInc} aria-label="Increase">
        +
      </button>
    </div>
  )
}

function toMoney(n) {
  return `Rs. ${n.toFixed(2)}`
}

const CART_KEY = 'unimeals_cart'
const USER_KEY = 'uni_meals_user'
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export default function Orders() {
  const navigate = useNavigate()
  const [service, setService] = useState('Pickup')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [orderDbId, setOrderDbId] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [specialNotes, setSpecialNotes] = useState('')

  const [cartItems, setCartItems] = useState(() => {
    const stored = loadCart()
    return stored.length > 0 ? stored : []
  })
  const [deliveryLocation, setDeliveryLocation] = useState('')

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  const studentName = useMemo(() => {
    const studentEmail = String(user?.email || '')
    const studentIdFromEmail = studentEmail.includes('@') ? studentEmail.split('@')[0] : ''
    return studentIdFromEmail || user?.name || 'Student'
  }, [user])

  const serviceFee = 1.5

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, it) => sum + it.unitPrice * it.qty, 0)
    const total = subtotal + serviceFee
    return { subtotal, total }
  }, [cartItems])

  const deliveryMeta = useMemo(() => {
    if (service === 'Dining') {
      return { expected: 'Today, 12:10 PM', pickupPoint: 'On-campus dining hall' }
    }
    if (service === 'Delivery') {
      return { expected: 'Today, 12:55 PM', pickupPoint: 'Campus delivery (limited zones)' }
    }
    return { expected: 'Today, 12:45 PM', pickupPoint: 'The Central Commons' }
  }, [service])

  function inc(id) {
    setCartItems((items) => {
      const next = items.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
      saveCart(next)
      return next
    })
  }

  function dec(id) {
    setCartItems((items) => {
      const next = items.map((it) => {
        if (it.id !== id) return it
        return { ...it, qty: Math.max(1, it.qty - 1) }
      })
      saveCart(next)
      return next
    })
  }

  function remove(id) {
    setCartItems((items) => {
      const next = items.filter((it) => it.id !== id)
      saveCart(next)
      return next
    })
  }

  async function handlePlaceOrder() {
    if (cartItems.length === 0) {
      setOrderError('Your cart is empty.')
      return
    }

    const payload = {
      studentName,
      deliveryLocation: deliveryLocation.trim() || deliveryMeta.pickupPoint,
      notes: specialNotes.trim(),
      items: cartItems.map((it) => ({
        menuItemId: it.id,
        quantity: Number(it.qty) || 1,
      })),
    }

    try {
      setPlacingOrder(true)
      setOrderError('')
      const orderSnapshot = {
        items: cartItems,
        totals,
        service,
        deliveryMeta,
      }
      const { data } = await axios.post(`${API_BASE_URL}/api/orders`, payload)
      const createdId = data?.data?.id || data?.order?.id || data?._id || data?.id || ''
      setOrderDbId(createdId || '')
      setOrderId(createdId ? `#${createdId}` : 'Order created')
      setPlacedOrder(orderSnapshot)
      setOrderPlaced(true)
      saveCart([])
      setCartItems([])
    } catch (error) {
      setOrderError(error?.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  function handleTrackOrder() {
    navigate('/tracking-order', {
      state: {
        orderId,
        orderDbId,
        items: placedOrder?.items || [],
        total: placedOrder?.totals?.total || 0,
        subtotal: placedOrder?.totals?.subtotal || 0,
        serviceFee,
        service: placedOrder?.service || service,
        deliveryMeta: placedOrder?.deliveryMeta || deliveryMeta,
      },
    })
  }

  if (orderPlaced) {
    return (
      <div className="orderPlaced-page">
        <TopBar />

        <main className="orderPlaced-main">
          <div className="orderPlaced-iconCircle" aria-hidden="true">
            <span className="orderPlaced-check">✓</span>
          </div>

          <h1 className="orderPlaced-title">Order Placed Successfully!</h1>
          <div className="orderPlaced-orderId">Order ID: {orderId}</div>

          <div className="orderPlaced-summaryCard">
            <div className="orderPlaced-summaryHead">Order Summary</div>

            {!placedOrder?.items?.length ? (
              <div className="orderPlaced-line">
                <div className="orderPlaced-lineInfo">
                  <div className="orderPlaced-lineName">No items found</div>
                </div>
              </div>
            ) : (
              placedOrder.items.map((it) => (
                <div key={it.id} className="orderPlaced-line">
                  <img
                    src={it.image}
                    alt=""
                    className="orderPlaced-lineImg"
                  />
                  <div className="orderPlaced-lineInfo">
                    <div className="orderPlaced-lineName">{it.name}</div>
                    <div className="orderPlaced-lineMeta">Qty: {it.qty}</div>
                  </div>
                  <div className="orderPlaced-linePrice">
                    {toMoney(it.unitPrice * it.qty)}
                  </div>
                </div>
              ))
            )}

            <div className="orderPlaced-summaryTotals">
              <div className="orderPlaced-totalLine">
                <span>Subtotal</span>
                <span>{toMoney(placedOrder?.totals?.subtotal || 0)}</span>
              </div>
              <div className="orderPlaced-totalLine">
                <span>Canteen Convenience Fee</span>
                <span>{toMoney(serviceFee)}</span>
              </div>
              <div className="orderPlaced-totalGrand">
                <span>Total Price</span>
                <span>{toMoney(placedOrder?.totals?.total || 0)}</span>
              </div>
            </div>
          </div>

          <div className="orderPlaced-twoCards">
            <div className="orderPlaced-smallCard">
              <div className="orderPlaced-smallTitle">PAYMENT METHOD</div>
              <div className="orderPlaced-smallValue">Cash on Delivery</div>
            </div>
            <div className="orderPlaced-smallCard">
              <div className="orderPlaced-smallTitle">PICKUP POINT</div>
              <div className="orderPlaced-smallValue">Central Library Canteen</div>
            </div>
          </div>

          <button
            type="button"
            className="orderPlaced-trackBtn"
            onClick={() => handleTrackOrder()}
          >
            Track Live Order
          </button>
          <button
            type="button"
            className="orderPlaced-returnBtn"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="orders-page">
      <TopBar />

      <main className="orders-main">
        <section className="orders-head">
          <h1 className="orders-title">Review Order</h1>
          <p className="orders-subtitle">
            Freshly prepared, locally sourced, ready for dining, pickup or delivery.
          </p>
        </section>

        <section className="orders-layout">
          <div className="orders-items">
            {cartItems.map((it) => (
              <article key={it.id} className="orders-itemCard">
                <img src={it.image} alt="" className="orders-itemImg" />
                <div className="orders-itemInfo">
                  <div className="orders-itemSection">{it.section}</div>
                  <div className="orders-itemName">{it.name}</div>
                  <div className="orders-itemControls">
                    <Stepper value={it.qty} onDec={() => dec(it.id)} onInc={() => inc(it.id)} />
                  </div>
                </div>

                <div className="orders-itemPrice">
                  <div className="orders-itemPriceVal">{toMoney(it.unitPrice)}</div>
                  <button type="button" className="orders-removeBtn" onClick={() => remove(it.id)} aria-label="Remove">
                    <TrashIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="orders-summary">
            <div className="orders-card">
              <div className="orders-cardTitle">Service Options</div>
              <div className="orders-serviceRow" role="tablist" aria-label="Service">
                {['Dining', 'Pickup', 'Delivery'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={'orders-serviceBtn' + (service === opt ? ' orders-serviceBtn--active' : '')}
                    onClick={() => setService(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="orders-divider" />

              <div className="orders-cardTitle orders-summaryTitle">Order Details</div>
              <div className="orders-fieldGroup">
                <label className="orders-fieldLabel" htmlFor="orders-student-name">
                  Student Name
                </label>
                <input
                  id="orders-student-name"
                  className="orders-fieldInput"
                  value={studentName}
                  readOnly
                />
              </div>
              <div className="orders-fieldGroup">
                <label className="orders-fieldLabel" htmlFor="orders-delivery-location">
                  {service === 'Delivery' ? 'Delivery Location' : 'Pickup Location'}
                </label>
                <input
                  id="orders-delivery-location"
                  className="orders-fieldInput"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder={deliveryMeta.pickupPoint}
                />
              </div>
              <div className="orders-fieldGroup">
                <label className="orders-fieldLabel" htmlFor="orders-special-notes">
                  Special Notes
                </label>
                <textarea
                  id="orders-special-notes"
                  className="orders-fieldInput orders-fieldInput--textarea"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Add notes for kitchen or delivery person (optional)"
                  rows={3}
                />
              </div>

              <div className="orders-divider" />

              <div className="orders-cardTitle orders-summaryTitle">Order Summary</div>

              <div className="orders-summaryLine">
                <span>Subtotal</span>
                <span className="orders-money">{toMoney(totals.subtotal)}</span>
              </div>
              <div className="orders-summaryLine">
                <span>Service Fee</span>
                <span className="orders-money">{toMoney(serviceFee)}</span>
              </div>

              <div className="orders-totalLine">
                <span>Total</span>
                <span className="orders-money orders-totalMoney">{toMoney(totals.total)}</span>
              </div>

              <div className="orders-metaCard">
                <div className="orders-metaRow">
                  <span className="orders-metaDot" aria-hidden="true">
                    ●
                  </span>
                  <div>
                    <div className="orders-metaLabel">EXPECTED TIME</div>
                    <div className="orders-metaValue">{deliveryMeta.expected}</div>
                  </div>
                </div>
              </div>

              <div className="orders-metaCard">
                <div className="orders-metaRow">
                  <span className="orders-metaDot" aria-hidden="true">
                    ●
                  </span>
                  <div>
                    <div className="orders-metaLabel">{service === 'Delivery' ? 'DELIVERY' : 'PICKUP POINT'}</div>
                    <div className="orders-metaValue">{deliveryMeta.pickupPoint}</div>
                  </div>
                </div>
              </div>

              {orderError ? <div className="orders-errorText">{orderError}</div> : null}

              <button
                type="button"
                className="orders-placeBtn"
                onClick={handlePlaceOrder}
                disabled={placingOrder || cartItems.length === 0}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>

              <div className="orders-secureNote">SECURE UNIVERSITY CHECKOUT</div>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  )
}

