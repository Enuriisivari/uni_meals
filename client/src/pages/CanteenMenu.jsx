import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useRef, useState } from 'react'
import './CanteenMenu.css'
import { useEffect } from 'react'
import axios from 'axios'

function CartIcon() {
  return (
    <svg className="menu-cartIcon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function CartSmallIcon() {
  return (
    <svg className="menu-cartSmall" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h15l-1.5 9h-12L6 7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Badge({ text }) {
  return <span className="menu-badge">{text}</span>
}

function MenuCard({ item, onAdd }) {
  const badgeLeft = item.badgeLeft ? <Badge text={item.badgeLeft} /> : null
  const badgeRight = item.badgeRight ? <Badge text={item.badgeRight} /> : null

  return (
    <article className="menu-card">
      <div className="menu-cardMedia">
        <img src={item.image} alt="" className="menu-cardImg" loading="lazy" />
        {badgeLeft ? <div className="menu-badgeLeft">{badgeLeft}</div> : null}
        {badgeRight ? <div className="menu-badgeRight">{badgeRight}</div> : null}
      </div>

      <div className="menu-cardBody">
        <div className="menu-cardTop">
          <div className="menu-itemName">{item.name}</div>
          <div className="menu-itemPrice">Rs. {item.price}</div>
        </div>
        <div className="menu-itemDesc">{item.description}</div>
        <button type="button" className="menu-addBtn" onClick={onAdd}>
          <CartSmallIcon />
          Add to Cart
        </button>
      </div>
    </article>
  )
}

const CART_KEY = 'unimeals_cart'

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

export default function CanteenMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  void location

  const [trayCount, setTrayCount] = useState(0)
  const [toastMsg, setToastMsg] = useState('')
  const toastTimerRef = useRef(null)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('http://localhost:5000/api/student/menu-items')
        setItems(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch menu items', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const menu = useMemo(() => {
    return {
      canteenName: 'Canteen Menu',
      canteenSubtitle: 'Fresh menu items.',
      tags: ['All Menu'],
      items: items.map((it) => ({
        id: it.id || it._id,
        name: it.name || 'Untitled',
        price: Number(it.price) || 0,
        description: it.description || '',
        image: it.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image',
      })),
    }
  }, [items])

  function addItem(item) {
    const cart = loadCart()
    const existing = cart.find((c) => c.id === item.id)

    let next
    if (existing) {
      next = cart.map((c) =>
        c.id === item.id ? { ...c, qty: (c.qty || 1) + 1 } : c
      )
    } else {
      next = [
        ...cart,
        {
          id: item.id,
          name: item.name,
          unitPrice: item.price,
          qty: 1,
          image: item.image,
          section: 'MENU ITEM',
        },
      ]
    }

    saveCart(next)

    const count = next.reduce((sum, it) => sum + (it.qty || 1), 0)
    setTrayCount(count)

    setToastMsg('Added to cart')
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToastMsg(''), 1100)
  }

  return (
    <div className="menu-page">
      {toastMsg ? <div className="menu-toast" role="status" aria-live="polite">{toastMsg}</div> : null}

      <header className="menu-topnav">
        <div className="menu-topnav-inner">
          <Link to="/" className="menu-brand">
            UniMeals
          </Link>
          <nav className="menu-nav" aria-label="Main">
            <Link to="/" className="menu-navLink">Home</Link>
            <Link to="/canteens" className="menu-navLink menu-navLink--active">
              Canteens
            </Link>
            <Link to="/orders" className="menu-navLink">Orders</Link>
            <Link to="/profile" className="menu-navLink">Profile</Link>
          </nav>

          <button
            type="button"
            className="menu-cartBtn"
            aria-label="Open cart"
            onClick={() => navigate('/orders')}
          >
            <CartIcon />
            <span className="menu-cartBadge">{trayCount}</span>
          </button>
        </div>
      </header>

      <main className="menu-main">
        <section className="menu-hero">
          <div className="menu-heroLeft">
            <div className="menu-serving">— NOW SERVING</div>
            <h1 className="menu-title">{menu.canteenName}</h1>
            <p className="menu-sub">{menu.canteenSubtitle}</p>
          </div>

          <div className="menu-heroRight">
            <div className="menu-chipRow">
              {menu.tags.map((t, idx) => (
                <button
                  key={t}
                  type="button"
                  className={'menu-chip' + (idx === 0 ? ' menu-chip--active' : '')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="menu-gridWrap">
          <div className="menu-grid">
            {loading ? (
              <p>Loading menu...</p>
            ) : menu.items.length === 0 ? (
              <p>No menu items found.</p>
            ) : (
              menu.items.map((it) => (
                <MenuCard key={it.id} item={it} onAdd={() => addItem(it)} />
              ))
            )}
          </div>

          {/* <aside className="menu-tray" aria-live="polite">
            <div className="menu-tray-head">
              <IconStar />
              <div className="menu-trayTitle">YOUR TRAY</div>
              <div className="menu-trayMeta">
                {trayCount} Items — $37.65
              </div>
              <button type="button" className="menu-trayCheckout">
                Checkout
              </button>
            </div>
          </aside> */}
        </section>
      </main>
    </div>
  )
}
