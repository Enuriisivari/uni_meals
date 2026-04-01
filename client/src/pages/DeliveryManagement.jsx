import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeliveryManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchStaff = async () => {
    const res = await axios.get('http://localhost:5000/api/delivery/all');
    setStaffList(res.data);
  };

  useEffect(() => {
    const run = async () => {
      await fetchStaff();
    };
    run();
  }, []);

  const addStaff = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/delivery/add', { name, email, status: 'Available' });
    setName(''); setEmail('');
    fetchStaff();
  };

  const handleAssignToken = async (id) => {
    await axios.put(`http://localhost:5000/api/delivery/assign-token/${id}`);
    fetchStaff(); // Refresh list to show new token
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000' }}>
      <h2>Delivery Staff Token Management</h2><br />

      {/* Add Staff Form */}
      <form onSubmit={addStaff} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <button type="submit" style={btnPrimary}>Add Token</button>
      </form>

      {/* Staff Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <th style={tdStyle}>Name</th>
            <th style={tdStyle}>Status</th>
            <th style={tdStyle}>Active Token</th>
            <th style={tdStyle}>Rating</th>
            <th style={tdStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map(s => (
            <tr key={s._id}>
              <td style={{ color: 'black' }}>{s.name}</td>
              <td style={tdStyle}>
                <span style={{ color: s.status === 'Available' ? 'green' : 'orange', fontWeight: 'bold' }}>
                  {s.status}
                </span>
              </td>
              <td style={tdStyle}>
                {s.activeToken ? <code style={tokenBadge}>{s.activeToken}</code> : '---'}
              </td>
              <td style={tdStyle}>{s.rating} ⭐</td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleAssignToken(s._id)}
                  disabled={s.status === 'Busy'}
                  style={s.status === 'Busy' ? btnDisabled : btnAssign}
                >
                  Generate Token
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Simple Styles
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #111111' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #ffffff' };
const btnPrimary = { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
const btnAssign = { backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' };
const btnDisabled = { backgroundColor: '#bdc3c7', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'not-allowed' };
const tokenBadge = { backgroundColor: '#f1c40f', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' };

export default DeliveryManagement;