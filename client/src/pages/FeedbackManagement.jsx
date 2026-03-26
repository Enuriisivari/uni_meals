import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  const fetchFeedback = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/feedback');
      if (data.success) {
        setFeedbackList(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/feedback/${id}`, { status });
      fetchFeedback();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback/${id}`);
        fetchFeedback();
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchFeedback();
    };
    run();
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Feedback Management</h1>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--admin-text-main)' }}>Recent Feedback</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Email</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.length > 0 ? feedbackList.map((fb) => (
                <tr key={fb._id}>
                  <td style={{ fontWeight: 500 }}>{fb.userId?.name || 'Unknown'} <br/><span style={{fontSize: '0.75rem', color: '#666'}}>{fb.userId?.email}</span></td>
                  <td style={{ color: '#F59E0B', fontSize: '1.2rem' }}>{'★'.repeat(fb.rating)}{'☆'.repeat(5-fb.rating)}</td>
                  <td style={{ maxWidth: '250px' }}>{fb.comment}</td>
                  <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span 
                      className={`admin-badge ${fb.status === 'Reviewed' ? 'admin-badge-success' : 'admin-badge-warning'}`}
                    >
                      {fb.status}
                    </span>
                  </td>
                  <td>
                    {fb.status === 'Pending' && (
                      <button 
                        className="admin-btn admin-btn-outline" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                        onClick={() => updateStatus(fb._id, 'Reviewed')}
                      >
                        Mark Reviewed
                      </button>
                    )}
                    <button 
                      className="admin-btn admin-btn-danger" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => deleteFeedback(fb._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>No feedback available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
