import React, { useEffect, useState } from 'react'
import axios from 'axios'

const emptyForm = {
  name: '',
  location: '',
  description: '',
  tags: '',
  imageUrl: '',
  rating: '',
  isActive: true,
}

const CanteenManagement = () => {
  const [canteens, setCanteens] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchCanteens = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('http://localhost:5000/api/canteens')
      setCanteens(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch canteens', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCanteens()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      rating: form.rating === '' ? null : Number(form.rating),
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/canteens/${editingId}`, payload)
      } else {
        await axios.post('http://localhost:5000/api/canteens', payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchCanteens()
    } catch (err) {
      console.error('Save failed', err)
    }
  }

  const handleEdit = (canteen) => {
    setEditingId(canteen._id)
    setForm({
      name: canteen.name || '',
      location: canteen.location || '',
      description: canteen.description || '',
      tags: Array.isArray(canteen.tags) ? canteen.tags.join(', ') : '',
      imageUrl: canteen.imageUrl || '',
      rating: canteen.rating ?? '',
      isActive: canteen.isActive !== false,
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this canteen?')) return
    try {
      await axios.delete(`http://localhost:5000/api/canteens/${id}`)
      fetchCanteens()
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Canteen Management</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {editingId && (
            <button className="admin-btn" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          {editingId ? 'Edit Canteen' : 'Add New Canteen'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              className="admin-input"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              className="admin-input"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <textarea
            className="admin-input"
            name="description"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              className="admin-input"
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
            />
            <input
              className="admin-input"
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              className="admin-input"
              name="rating"
              type="number"
              step="0.1"
              placeholder="Rating"
              value={form.rating}
              onChange={handleChange}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <button className="admin-btn admin-btn-primary" type="submit">
            {editingId ? 'Update Canteen' : 'Create Canteen'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>All Canteens</h2>

        {loading ? (
          <p>Loading...</p>
        ) : canteens.length === 0 ? (
          <p>No canteens found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {canteens.map((canteen) => (
              <div
                key={canteen._id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{canteen.name || 'Untitled'}</h3>
                  <p style={{ margin: '0.25rem 0', color: 'var(--admin-text-muted)' }}>
                    {canteen.location || 'No location'} • Rating: {canteen.rating ?? 'N/A'}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    {canteen.description || 'No description'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="admin-btn" onClick={() => handleEdit(canteen)}>
                    Edit
                  </button>
                  <button className="admin-btn" onClick={() => handleDelete(canteen._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CanteenManagement