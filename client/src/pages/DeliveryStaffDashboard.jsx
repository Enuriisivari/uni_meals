import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const todaysOrdersDummy = [
  { orderId: 'ORD_4829', pickup: 'Basement Canteen Main Building', delivery: 'New Building Library', status: 'pending', amount: 1550.00 },
  { orderId: 'ORD_4830', pickup: 'Anohana Canteen', delivery: 'Engineering Building', status: 'pending', amount: 850.00 },
  { orderId: 'ORD_4831', pickup: 'Basement Canteen New Building', delivery: 'G1403 Lecture New Building', status: 'pending', amount: 1200.00 },
  { orderId: 'ORD_4832', pickup: 'P&S Canteen', delivery: 'B403 Main Building', status: 'pending', amount: 1825.00 },
  { orderId: 'ORD_4833', pickup: 'Main Cafeteria', delivery: 'Sports Complex', status: 'pending', amount: 950.00 },
];

const DeliveryStaffDashboard = () => {
  const navigate = useNavigate();
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    navigate('/delivery/login');
  };

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Modal State for Orders Management
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);
  const [assignedOrders, setAssignedOrders] = useState({});
  const [todaysOrders, setTodaysOrders] = useState(todaysOrdersDummy);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/auth/delivery/all');
        if (response.data) {
          const formattedDB = response.data.map(item => ({ ...item, isActive: item.isActive ?? true }));
          setDeliveryPersons(formattedDB);
        }
      } catch (err) {
        console.error("Failed to load delivery staff from actual DB", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this delivery person?')) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/delivery/${id}`);
        setDeliveryPersons(deliveryPersons.filter(p => p._id !== id));
      } catch (err) {
        console.error("Failed to delete", err);
        alert(err.response?.data?.error || "Failed to delete");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/auth/delivery/${id}/status`);
      setDeliveryPersons(deliveryPersons.map(p =>
        p._id === id ? { ...p, isActive: response.data.isActive } : p
      ));
    } catch (err) {
      console.error("Failed to toggle status", err);
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', password: '' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (person) => {
    setEditingId(person._id);
    setFormData({ name: person.name, email: person.email, phone: person.phone || '', password: '' });
    setIsModalOpen(true);
  };

  const openOrdersModal = (person) => {
    setSelectedDeliveryPerson(person);
    // Initialize assigned orders for this delivery person if not already set
    if (!assignedOrders[person._id]) {
      setAssignedOrders({ ...assignedOrders, [person._id]: [] });
    }
    setIsOrdersModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        };
        await axios.put(`http://localhost:5000/api/auth/delivery/${editingId}`, payload);
        setDeliveryPersons(deliveryPersons.map(p =>
          p._id === editingId ? { ...p, ...payload } : p
        ));
        setIsModalOpen(false);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Failed to update person");
      }
    } else {
      try {
        const payload = {
          ...formData,
          vehicleType: "Motorcycle" // Default vehicle
        };
        const response = await axios.post('http://localhost:5000/api/auth/delivery/register', payload);
        
        const newPerson = {
          _id: response.data.deliveryPersonId,
          ...payload,
          createdAt: new Date().toISOString(),
          isActive: true
        };
        setDeliveryPersons([newPerson, ...deliveryPersons]);
        setIsModalOpen(false);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Failed to add person to database");
      }
    }
  };

  const handleOrderSelection = (orderId) => {
    const personId = selectedDeliveryPerson._id;
    const currentAssigned = assignedOrders[personId] || [];
    
    if (currentAssigned.includes(orderId)) {
      setAssignedOrders({
        ...assignedOrders,
        [personId]: currentAssigned.filter(id => id !== orderId)
      });
    } else {
      setAssignedOrders({
        ...assignedOrders,
        [personId]: [...currentAssigned, orderId]
      });
    }
  };

  const handleSaveOrders = () => {
    const assigned = assignedOrders[selectedDeliveryPerson._id] || [];
    if (assigned.length === 0) {
      alert('Please select at least one order to assign.');
      return;
    }
    alert(`Successfully assigned ${assigned.length} order(s) to ${selectedDeliveryPerson.name}!`);
    setIsOrdersModalOpen(false);
  };

  const getAssignedOrdersCount = (personId) => {
    return (assignedOrders[personId] || []).length;
  };

  return (
    <div style={styles.container}>
      <nav style={{ ...styles.navbar, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={styles.navBrand}>UniMeals Admin Panel</div>
          <div style={styles.navLinks}>
            <span style={styles.navActive}>Delivery Staff</span>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Delivery Staff Management</h1>
            <p style={styles.subtitle}>Overview and management of all registered delivery personnel.</p>
          </div>
          <button style={styles.addBtn} onClick={openAddModal}>+ Add Delivery Person</button>
        </div>

        <div style={styles.card}>
          {loading ? (
            <div style={styles.loading}>Loading staff directory...</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Contact Info</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Assigned Orders</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryPersons.map(person => (
                    <tr key={person._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.personName}>{person.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '13px' }}>ID: {person._id.slice(-6).toUpperCase()}</div>
                      </td>
                      <td style={styles.td}>
                        <div>{person.email}</div>
                        <div style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '4px' }}>{person.phone || 'N/A'}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: person.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: person.isActive ? '#10b981' : '#ef4444'
                        }}>
                          {person.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.orderBadge,
                          backgroundColor: 'rgba(168, 85, 247, 0.2)',
                          color: '#d8b4fe',
                          fontWeight: '600'
                        }}>
                          {getAssignedOrdersCount(person._id)} order(s)
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionGroup}>
                          <button style={styles.ordersBtn} onClick={() => openOrdersModal(person)}>Assign Orders</button>
                          <button style={styles.editBtn} onClick={() => openEditModal(person)}>Edit</button>
                          <button
                            style={styles.toggleBtn}
                            onClick={() => handleToggleStatus(person._id)}
                          >
                            {person.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(person._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {deliveryPersons.length === 0 && (
                    <tr>
                      <td colSpan="5" style={styles.emptyState}>No delivery personnel found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Orders Management Modal */}
      {isOrdersModalOpen && selectedDeliveryPerson && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '24px' }}>
              Manage Orders for {selectedDeliveryPerson.name}
            </h2>
            <p style={{ color: '#94a3b8', margin: '0 0 24px 0', fontSize: '14px' }}>
              Select orders to assign for today's delivery
            </p>
            
            <div style={styles.ordersContainer}>
              {todaysOrders.length === 0 ? (
                <div style={styles.emptyOrders}>No orders available for today.</div>
              ) : (
                todaysOrders.map(order => (
                  <div key={order.orderId} style={styles.orderItem}>
                    <input
                      type="checkbox"
                      checked={(assignedOrders[selectedDeliveryPerson._id] || []).includes(order.orderId)}
                      onChange={() => handleOrderSelection(order.orderId)}
                      style={styles.checkbox}
                    />
                    <div style={styles.orderDetails}>
                      <div style={styles.orderId}>{order.orderId}</div>
                      <div style={styles.orderRoute}>
                        <span style={{ color: '#94a3b8' }}>📍 {order.pickup}</span>
                        <span style={{ color: '#cbd5e1', margin: '0 8px' }}>→</span>
                        <span style={{ color: '#94a3b8' }}>{order.delivery}</span>
                      </div>
                      <div style={styles.orderAmount}>₹{order.amount.toFixed(2)}</div>
                    </div>
                    <span style={{
                      ...styles.orderStatus,
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#fca5a5'
                    }}>
                      {order.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div style={styles.ordersFooter}>
              <p style={{ color: '#cbd5e1', margin: '0 0 16px 0', fontSize: '14px' }}>
                Selected: <strong>{(assignedOrders[selectedDeliveryPerson._id] || []).length}</strong> order(s)
              </p>
              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  onClick={() => setIsOrdersModalOpen(false)} 
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveOrders} 
                  style={styles.saveBtn}
                >
                  Assign Selected Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px' }}>
              {editingId ? 'Edit Delivery Staff' : 'Add New Staff'}
            </h2>
            <form onSubmit={handleModalSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password {editingId && <span style={{fontSize: '12px', color: '#64748b'}}>(Hidden for security - editing not supported yet)</span>}</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ ...styles.input, width: '100%', paddingRight: '40px' }}
                    placeholder={editingId ? '**********' : 'Enter initial password'}
                    required={!editingId}
                    disabled={!!editingId}
                  />
                  {!editingId && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeBtn}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  )}
                </div>
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>{editingId ? 'Save Changes' : 'Add Staff'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a',
    fontFamily: '"Inter", sans-serif',
    color: '#f8fafc',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
  },
  navBrand: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#a855f7',
    marginRight: '40px'
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
  },
  navActive: {
    color: '#f8fafc',
    fontWeight: '600',
    borderBottom: '2px solid #a855f7',
    paddingBottom: '4px'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  main: {
    padding: '40px 32px',
    maxWidth: '1280px',
    margin: '0 auto',
    textAlign: 'left'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: 0,
  },
  addBtn: {
    backgroundColor: '#a855f7',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
    overflow: 'hidden',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '16px 24px',
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #334155',
  },
  tr: {
    borderBottom: '1px solid #334155',
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    verticalAlign: 'middle',
  },
  personName: {
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '4px'
  },
  badge: {
    backgroundColor: '#334155',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  actionGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  editBtn: {
    backgroundColor: '#3b82f6',
    border: 'none',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
  },
  toggleBtn: {
    backgroundColor: '#334155',
    border: 'none',
    color: '#cbd5e1',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
  },
  ordersBtn: {
    backgroundColor: '#a855f7',
    border: 'none',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
  },
  orderBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#94a3b8',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  ordersContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '24px',
    border: '1px solid #334155',
    borderRadius: '8px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)'
  },
  orderItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid #334155',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(168, 85, 247, 0.1)'
    }
  },
  checkbox: {
    marginTop: '4px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#a855f7'
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '6px',
  },
  orderRoute: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    marginBottom: '8px',
    color: '#94a3b8'
  },
  orderAmount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#a855f7'
  },
  orderStatus: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap'
  },
  emptyOrders: {
    padding: '40px 16px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '14px'
  },
  ordersFooter: {
    borderTop: '1px solid #334155',
    paddingTop: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    padding: '32px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    color: '#cbd5e1',
    fontWeight: '500',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px',
  },
  cancelBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #64748b',
    color: '#cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  saveBtn: {
    padding: '10px 16px',
    backgroundColor: '#a855f7',
    border: 'none',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  }
};

export default DeliveryStaffDashboard;
