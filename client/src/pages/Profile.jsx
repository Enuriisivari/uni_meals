import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './Profile.css'
import TopBar from '../components/TopBar.jsx'
import Footer from '../components/Footer.jsx'

const USER_KEY = 'uni_meals_user'
const TOKEN_KEY = 'uni_meals_token'
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

function SafeUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function Avatar({ name }) {
  const initials = useMemo(() => {
    const parts = String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    const first = parts[0]?.[0] || ''
    const second = parts[1]?.[0] || ''
    return (first + second).toUpperCase() || 'U'
  }, [name])

  return <div className="profile-avatar">{initials}</div>
}

export default function Profile() {
  const navigate = useNavigate()
  const token = localStorage.getItem(TOKEN_KEY) || ''
  const [user, setUser] = useState(() => SafeUser())
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [recentOrders, setRecentOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const studentEmail = String(user?.email || '')
  const studentIdFromEmail = studentEmail.includes('@')
    ? studentEmail.split('@')[0]
    : ''
  const displayName = studentIdFromEmail || user?.name || 'Student'
  const activeOrder = useMemo(
    () => recentOrders.find((order) => ['pending', 'preparing', 'ready'].includes(order.status)),
    [recentOrders],
  )
  const completedCount = useMemo(
    () => recentOrders.filter((order) => order.status === 'completed').length,
    [recentOrders],
  )

  useEffect(() => {
    if (!token) return

    let active = true
    const fetchCurrentStudent = async () => {
      try {
        setProfileLoading(true)
        setProfileError('')
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/student/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!active) return
        setUser(data || null)
        localStorage.setItem(USER_KEY, JSON.stringify(data || {}))
      } catch (error) {
        if (!active) return
        setProfileError(error?.response?.data?.error || 'Failed to load profile data.')
      } finally {
        if (active) setProfileLoading(false)
      }
    }

    fetchCurrentStudent()
    return () => {
      active = false
    }
  }, [token])

  useEffect(() => {
    if (!user) return

    let active = true
    const fetchRecentOrders = async () => {
      try {
        setOrdersLoading(true)
        setOrdersError('')
        const { data } = await axios.get(`${API_BASE_URL}/api/orders`, { params: { studentName: displayName } })
        if (!active) return

        const orders = Array.isArray(data?.data) ? data.data : []
        setRecentOrders(orders.slice(0, 5))
      } catch (error) {
        if (!active) return
        setOrdersError(error?.response?.data?.message || 'Failed to load recent orders.')
      } finally {
        if (active) setOrdersLoading(false)
      }
    }

    fetchRecentOrders()
    return () => {
      active = false
    }
  }, [displayName, user])

  function openTrackOrder(order) {
    if (!order?.id) return
    navigate('/tracking-order', {
      state: {
        orderDbId: order.id,
        orderId: `#${order.id}`,
        service: 'Pickup',
        deliveryMeta: {
          expected: 'Today',
          pickupPoint: order.deliveryLocation || 'Pickup point not set',
        },
      },
    })
  }

  function signOut() {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    navigate('/')
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-unauth">
          <h2>Please login</h2>
          <p>You need an account to view your profile.</p>
          <Link className="profile-unauth-link" to="/login">
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <TopBar />

      <main className="profile-main">
        <section className="profile-userCard">
          <div className="profile-userAvatar">
            <Avatar name={displayName} />
          </div>

          <div className="profile-userInfo">
            <div className="profile-userName">{displayName}</div>
            {profileError ? <div className="profile-ordersSubtitle">{profileError}</div> : null}
            <div className="profile-userMeta">
              <span className="profile-metaItem">
                <span className="profile-metaIcon">🆔</span>
                ID: {studentIdFromEmail || String(user.id || user._id || '').slice(0, 8) || '—'}
              </span>
              <span className="profile-metaItem">
                <span className="profile-metaIcon">🎓</span>
                Student
              </span>
              <span className="profile-metaItem">
                <span className="profile-metaIcon">✉️</span>
                {user.email || '—'}
              </span>
              <span className="profile-metaItem">
                <span className="profile-metaIcon">📦</span>
                Orders: {recentOrders.length}
              </span>
            </div>
          </div>

          <div className="profile-userActions">
            <Link to="/edit-profile" className="profile-editBtn">
              Edit Profile
            </Link>
            <button type="button" className="profile-signOutBtn" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </section>

        <section className="profile-grid">
          <div className="profile-leftCol">
            <div className="profile-orderCard">
              <div className="profile-orderTop">
                <span className="profile-orderBadge">{activeOrder ? 'ONGOING ORDER' : 'NO ACTIVE ORDER'}</span>
                <span className="profile-orderId">
                  {activeOrder ? `Order #${String(activeOrder.id).slice(0, 8)}` : '--'}
                </span>
              </div>
              <div className="profile-orderSub">
                {activeOrder
                  ? `${activeOrder.items?.[0]?.name || 'Order item'} (${activeOrder.status})`
                  : 'No pending orders right now. You can place a new one from menu.'}
                <span className="profile-orderX" aria-hidden="true">
                  {activeOrder ? '•' : ''}
                </span>
              </div>
              <div className="profile-progressWrap">
                <div className="profile-progressRow">
                  <span className="profile-progressDot">▪</span>
                  <div>
                    <div className="profile-progressTitle">
                      {activeOrder ? `Status: ${activeOrder.status}` : 'Recent completed orders'}
                    </div>
                    <div className="profile-progressEta">
                      {activeOrder
                        ? `Delivery: ${activeOrder.deliveryLocation || 'Pickup'}`
                        : `${completedCount} completed in your latest 5 orders`}
                    </div>
                  </div>
                </div>
                <div className="profile-progressBar" />
              </div>
              {activeOrder ? (
                <button
                  type="button"
                  className="profile-editBtn"
                  style={{ marginTop: '0.9rem' }}
                  onClick={() => openTrackOrder(activeOrder)}
                >
                  Track Active Order
                </button>
              ) : null}
            </div>

            <div className="profile-ordersSection">
              <div className="profile-ordersHead">
                <div className="profile-ordersTitle">Recent Orders</div>
              </div>
              <div className="profile-ordersSubtitle">
                Last 5 orders
              </div>

              <div className="profile-recentList">
                {profileLoading || ordersLoading ? (
                  <div className="profile-recentRow">
                    <div className="profile-recentLeft">
                      <div>
                        <div className="profile-recentName">Loading account data...</div>
                      </div>
                    </div>
                  </div>
                ) : ordersError ? (
                  <div className="profile-recentRow">
                    <div className="profile-recentLeft">
                      <div>
                        <div className="profile-recentName">{ordersError}</div>
                      </div>
                    </div>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="profile-recentRow">
                    <div className="profile-recentLeft">
                      <div>
                        <div className="profile-recentName">No recent orders.</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="profile-recentRow">
                      <div className="profile-recentLeft">
                        <div className="profile-recentIcon">🍽️</div>
                        <div>
                          <div className="profile-recentName">
                            {order.items?.[0]?.name || 'Order item'}
                            {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''}
                          </div>
                          <div className="profile-recentMeta">
                            {new Date(order.createdAt || order.orderTime || Date.now()).toLocaleDateString()} ·{' '}
                            {(order.status || 'pending').toUpperCase()} · {order.deliveryLocation || 'Pickup'}
                          </div>
                        </div>
                      </div>
                      <div className="profile-recentPrice">
                        <div>Rs. {Number(order.totalPrice || 0).toFixed(2)}</div>
                        <button
                          type="button"
                          className="profile-viewAll cursor-pointer"
                          onClick={() => openTrackOrder(order)}
                          style={{ marginTop: '0.35rem', display: 'inline-block' }}
                        >
                          Track
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="profile-rightCol">
            <div className="profile-card">
              <div className="profile-cardTitle">Account Settings</div>
              <Link
                to="/edit-profile"
                className="profile-settingRow profile-settingRow--link"
              >
                <div className="profile-settingLeft">
                  <span className="profile-settingIcon">✏️</span>
                  Edit Profile Info
                </div>
                <span className="profile-settingChevron">›</span>
              </Link>
              <Link
                to="/change-password"
                className="profile-settingRow profile-settingRow--link"
              >
                <div className="profile-settingLeft">
                  <span className="profile-settingIcon">🔒</span>
                  Edit Profile & Password
                </div>
                <span className="profile-settingChevron">›</span>
              </Link>
              <button
                type="button"
                className="profile-settingRow profile-settingRow--link"
                style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={signOut}
              >
                <div className="profile-settingLeft">
                  <span className="profile-settingIcon">🚪</span>
                  Sign Out
                </div>
                <span className="profile-settingChevron">›</span>
              </button>
            </div>

            <div className="profile-card profile-favs">
              <div className="profile-cardTitle">Quick Stats</div>
              <div className="profile-favTiles">
                <div className="profile-favTile">
                  <div className="profile-favImg" />
                  <div className="profile-favName">Recent Orders: {recentOrders.length}</div>
                </div>
                <div className="profile-favTile">
                  <div className="profile-favImg profile-favImg--2" />
                  <div className="profile-favName">Completed: {completedCount}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

