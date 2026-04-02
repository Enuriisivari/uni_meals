import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Orders.css'

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
  return `$${n.toFixed(2)}`
}

export default function Orders() {
  const navigate = useNavigate()
  const [service, setService] = useState('Pickup')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [cartItems, setCartItems] = useState([
    {
      id: 'a',
      section: 'MAIN COURSE',
      name: 'Artisan Harvest Bowl',
      unitPrice: 12.5,
      qty: 1,
      image:
        'https://images.unsplash.com/photo-1543362906-acfc16c67580?w=240&q=80&auto=format&fit=crop',
    },
    {
      id: 'b',
      section: 'PASTA BAR',
      name: 'Wild Mushroom Tagliatelle',
      unitPrice: 14.0,
      qty: 2,
      image:
        'https://images.unsplash.com/photo-1604908554103-3a7f0d7f2c3b?w=240&q=80&auto=format&fit=crop',
    },
    {
      id: 'c',
      section: 'BEVERAGES',
      name: 'Fresh Berry Lemonade',
      unitPrice: 4.5,
      qty: 1,
      image:
        'https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=240&q=80&auto=format&fit=crop',
    },
  ])

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
    setCartItems((items) => items.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)))
  }

  function dec(id) {
    setCartItems((items) =>
      items.map((it) => {
        if (it.id !== id) return it
        return { ...it, qty: Math.max(1, it.qty - 1) }
      }),
    )
  }

  function remove(id) {
    setCartItems((items) => items.filter((it) => it.id !== id))
  }

  function handlePlaceOrder() {
    // UI-only order placement
    const suffix = Math.floor(100000 + Math.random() * 900000)
    setOrderId(`#CC-${suffix}-U`)
    setOrderPlaced(true)
  }

  function handleTrackOrder() {
    // Navigate to live tracking UI.
    navigate('/tracking-order', { state: { orderId } })
  }

  if (orderPlaced) {
    return (
      <div className="orderPlaced-page">
        <header className="orders-topnav">
          <div className="orders-topnav-inner">
            <Link to="/" className="orders-brand">
              UniMeals
            </Link>
            <nav className="orders-nav" aria-label="Main">
              <Link to="/" className="orders-navLink">
                Home
              </Link>
              <Link to="/canteens" className="orders-navLink">
                Canteens
              </Link>
              <Link
                to="/orders"
                className="orders-navLink orders-navLink--active"
              >
                Orders
              </Link>
              <Link to="/profile" className="orders-navLink">
                Profile
              </Link>
            </nav>
            <div className="orders-topnavRight" aria-hidden="true">
              🔔 🛒 👤
            </div>
          </div>
        </header>

        <main className="orderPlaced-main">
          <div className="orderPlaced-iconCircle" aria-hidden="true">
            <span className="orderPlaced-check">✓</span>
          </div>

          <h1 className="orderPlaced-title">Order Placed Successfully!</h1>
          <div className="orderPlaced-orderId">Order ID: {orderId}</div>

          <div className="orderPlaced-summaryCard">
            <div className="orderPlaced-summaryHead">Order Summary</div>

            <div className="orderPlaced-line">
              <img
                src="https://images.unsplash.com/photo-1525351484163-7529414344d8?w=90&q=80&auto=format&fit=crop"
                alt=""
                className="orderPlaced-lineImg"
              />
              <div className="orderPlaced-lineInfo">
                <div className="orderPlaced-lineName">Artisan Avocado Bowl</div>
                <div className="orderPlaced-lineMeta">Qty: 1</div>
              </div>
              <div className="orderPlaced-linePrice">₹180.00</div>
            </div>

            <div className="orderPlaced-line">
              <img
                src="https://images.unsplash.com/photo-1599785209707-28f2f0e6f3a6?w=90&q=80&auto=format&fit=crop"
                alt=""
                className="orderPlaced-lineImg"
              />
              <div className="orderPlaced-lineInfo">
                <div className="orderPlaced-lineName">Cold Brew Classic</div>
                <div className="orderPlaced-lineMeta">Qty: 2</div>
              </div>
              <div className="orderPlaced-linePrice">₹240.00</div>
            </div>

            <div className="orderPlaced-summaryTotals">
              <div className="orderPlaced-totalLine">
                <span>Subtotal</span>
                <span>₹420.00</span>
              </div>
              <div className="orderPlaced-totalLine">
                <span>Canteen Convenience Fee</span>
                <span>₹15.00</span>
              </div>
              <div className="orderPlaced-totalGrand">
                <span>Total Price</span>
                <span>₹435.00</span>
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
      </div>
    )
  }

  return (
    <div className="orders-page">
      <header className="orders-topnav">
        <div className="orders-topnav-inner">
          <Link to="/" className="orders-brand">
            UniMeals
          </Link>
          <nav className="orders-nav" aria-label="Main">
            <Link to="/" className="orders-navLink">
              Home
            </Link>
            <Link to="/canteens" className="orders-navLink">
              Canteens
            </Link>
            <Link to="/orders" className="orders-navLink orders-navLink--active">
              Orders
            </Link>
            <Link to="/profile" className="orders-navLink">
              Profile
            </Link>
          </nav>
          <div className="orders-topnavRight" aria-hidden="true">
            🔔 🛒 👤
          </div>
        </div>
      </header>

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

              <button type="button" className="orders-placeBtn" onClick={handlePlaceOrder}>
                Place Order
              </button>

              <div className="orders-secureNote">SECURE UNIVERSITY CHECKOUT</div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

