import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback/all');
      setFeedbacks(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading feedback", err);
    }
  };

  // Fetch all feedback on load
  useEffect(() => {
    const run = async () => {
      await fetchFeedback();
    };
    run();
  }, []);

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      await axios.delete(`http://localhost:5000/api/feedback/${id}`);
      setFeedbacks(feedbacks.filter(item => item._id !== id));
    }
  };

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>Admin Feedback Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
            <th style={cellStyle}>Order ID</th>
            <th style={cellStyle}>User</th>
            <th style={cellStyle}>Rating</th>
            <th style={cellStyle}>Comment</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f) => (
            <tr key={f._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{f.orderId}</td>
              <td style={cellStyle}>{f.userId}</td>
              <td style={cellStyle}>{f.rating} ⭐</td>
              <td style={cellStyle}>{f.comment}</td>
              <td style={cellStyle}>
                <button 
                  onClick={() => deleteFeedback(f._id)}
                  style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle = { padding: '12px', border: '1px solid #ddd' };

export default AdminFeedback;