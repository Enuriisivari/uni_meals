import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useRef, useState } from 'react'
import './CanteenMenu.css'

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

function IconStar() {
  return (
    <svg className="menu-star" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l3.1 6.6L22 9.2l-5 4.8L18.2 22 12 18.6 5.8 22 7 14l-5-4.8 6.9-.6L12 2z"
        fill="currentColor"
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
          <div className="menu-itemPrice">{item.price}</div>
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

export default function CanteenMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  void location

  const [trayCount, setTrayCount] = useState(3)
  const [toastMsg, setToastMsg] = useState('')
  const toastTimerRef = useRef(null)

  const menu = useMemo(() => {
    // For now, we only need canteen 1 -> "Terrace Grill" UI.
    return {
      canteenName: 'Terrace Grill',
      canteenSubtitle:
        'Artisanal burgers, fresh seasonal salads, and signature bowls crafted daily at the heart of the North Campus.',
      tags: ['All Menu', 'Burgers', 'Salads', 'Bowls'],
      items: [
        {
          id: 1,
          badgeLeft: 'POPULAR',
          name: 'The Heritage Burger',
          price: '$12.50',
          description:
            'Prime angus beef, aged cheddar, caramelized onions, and our secret smoked aioli on a toasted brioche bun.',
          image:
            'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80&auto=format&fit=crop',
        },
        {
          id: 2,
          name: 'Harvest Grain Bowl',
          price: '$10.95',
          description:
            'Quinoa, roasted sweet potato, kale, pomegranate seeds, and a zesty lemon-tahini dressing.',
          image:
            'https://images.unsplash.com/photo-1541544181074-e9b0f0c35c8d?w=1200&q=80&auto=format&fit=crop',
        },
        {
          id: 3,
          badgeRight: 'GF',
          name: 'Pacific Rim Bowl',
          price: '$14.20',
          description:
            'Sashimi-style salmon, avocado, edamame, and pickled ginger over seasoned sushi rice.',
          image:
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80&auto=format&fit=crop',
        },
        {
          id: 4,
          name: 'Crispy Avocado Wrap',
          price: '$9.50',
          description:
            'Tempura avocado, spicy slaw, cilantro, and lime crema in a spinach tortilla.',
          image:
            'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=1200&q=80&auto=format&fit=crop',
        },
        {
          id: 5,
          name: 'Classic Terrace Caesar',
          price: '$11.00',
          description:
            'Romaine hearts, garlic sourdough croutons, shaved parmesan-reggiano, and house dressing.',
          image:
            'https://images.unsplash.com/photo-1543339308-43e59dcb2b3b?w=1200&q=80&auto=format&fit=crop',
        },
        {
          id: 6,
          badgeRight: 'DAILY SPECIAL',
          name: 'Artisan Flatbread',
          price: '$8.75',
          description:
            'Hand-stretched dough topped with roasted mushrooms, truffle oil, and fresh thyme.',
          image:
            'https://images.unsplash.com/photo-1600628422019-4e9f5d9b1d10?w=1200&q=80&auto=format&fit=crop',
        },
      ],
    }
  }, [])

  function addItem() {
    setTrayCount((c) => c + 1)
    setToastMsg('Added to cart')
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToastMsg(''), 1100)
  }

  return (
    <div className="menu-page">
      {toastMsg ? (
        <div className="menu-toast" role="status" aria-live="polite">
          {toastMsg}
        </div>
      ) : null}
      <header className="menu-topnav">
        <div className="menu-topnav-inner">
          <Link to="/" className="menu-brand">
            UniMeals
          </Link>
          <nav className="menu-nav" aria-label="Main">
            <Link to="/" className="menu-navLink">
              Home
            </Link>
            <Link to="/canteens" className="menu-navLink menu-navLink--active">
              Canteens
            </Link>
            <Link to="/orders" className="menu-navLink">
              Orders
            </Link>
            <Link to="/profile" className="menu-navLink">
              Profile
            </Link>
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
                  {t === 'All Menu' ? 'All Menu' : t}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="menu-gridWrap">
          <div className="menu-grid">
            {menu.items.map((it) => (
              <MenuCard key={it.id} item={it} onAdd={addItem} />
            ))}
          </div>

          <aside className="menu-tray" aria-live="polite">
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
          </aside>
        </section>
      </main>
    </div>
  )
}

