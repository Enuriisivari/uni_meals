import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/feedback.css";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [listRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/feedback/admin?page=1&limit=100"),
        axios.get("http://localhost:5000/api/feedback/admin/stats")
      ]);
      setFeedbacks(listRes.data?.data || []);
      setStats(statsRes.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin feedback data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = feedbacks.filter((item) => {
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    const queryText = `${item.customerName} ${item.email} ${item.subject} ${item.message}`.toLowerCase();
    const queryMatch = query ? queryText.includes(query.toLowerCase()) : true;
    return statusMatch && queryMatch;
  });

  const updateStatus = async (id, newStatus) => {
    try {
      setSavingId(id);
      await axios.put(`http://localhost:5000/api/feedback/admin/${id}`, { status: newStatus });
      setFeedbacks((prev) => prev.map((f) => (f._id === id ? { ...f, status: newStatus } : f)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update feedback status.");
    } finally {
      setSavingId("");
    }
  };

  const removeFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      setSavingId(id);
      await axios.delete(`http://localhost:5000/api/feedback/admin/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete feedback.");
    } finally {
      setSavingId("");
    }
  };

  if (loading) return <div className="admin-feedback-wrap">Loading feedback...</div>;

  return (
    <div className="admin-feedback-wrap">
      <div className="admin-feedback-header">
        <h2>Feedback Management</h2>
        <button className="btn-primary" type="button" onClick={loadData}>Refresh</button>
      </div>

      {stats && (
        <div className="admin-stats-grid">
          <div className="stat-card"><h4>Total</h4><p>{stats.total}</p></div>
          <div className="stat-card"><h4>Pending</h4><p>{stats.pending}</p></div>
          <div className="stat-card"><h4>Resolved</h4><p>{stats.resolved}</p></div>
          <div className="stat-card"><h4>Avg Rating</h4><p>{Number(stats.averageRating || 0).toFixed(1)}</p></div>
        </div>
      )}

      {error && <div className="server-error">{error}</div>}

      <div className="admin-filters">
        <input
          placeholder="Search name, subject, message..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="table-scroll">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7">No feedback records found.</td>
              </tr>
            ) : (
              filtered.map((f) => (
                <tr key={f._id}>
                  <td>
                    <div>{f.customerName}</div>
                    <small>{f.email}</small>
                  </td>
                  <td>{f.category}</td>
                  <td>{f.rating}/5</td>
                  <td>
                    <div>{f.subject}</div>
                    <small>{(f.message || "").slice(0, 70)}...</small>
                  </td>
                  <td>
                    <select
                      value={f.status}
                      disabled={savingId === f._id}
                      onChange={(e) => updateStatus(f._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger"
                      disabled={savingId === f._id}
                      onClick={() => removeFeedback(f._id)}
                    >
                      {savingId === f._id ? "Working..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackManagement;