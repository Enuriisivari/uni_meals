import React, { useEffect, useRef, useState } from 'react'
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

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

const CanteenManagement = () => {
  const [canteens, setCanteens] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeCardId, setActiveCardId] = useState(null)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const formSectionRef = useRef(null)

  const fetchCanteens = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_BASE_URL}/api/canteens`)
      setCanteens(Array.isArray(data) ? data : [])
      setFeedback((prev) => (prev.type === 'error' ? prev : { type: '', message: '' }))
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to fetch canteens.',
      })
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
    if (!form.name.trim() || !form.location.trim()) {
      setFeedback({ type: 'error', message: 'Name and location are required.' })
      return
    }

    const payload = {
      ...form,
      rating: form.rating === '' ? null : Number(form.rating),
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    }

    try {
      setSubmitting(true)
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/canteens/${editingId}`, payload)
        setFeedback({ type: 'success', message: 'Canteen updated successfully.' })
      } else {
        await axios.post(`${API_BASE_URL}/api/canteens`, payload)
        setFeedback({ type: 'success', message: 'Canteen created successfully.' })
      }
      setForm(emptyForm)
      setEditingId(null)
      await fetchCanteens()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to save canteen.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (id) => {
    try {
      setActiveCardId(id)
      const { data } = await axios.get(`${API_BASE_URL}/api/canteens/${id}`)
      setEditingId(data._id)
      setForm({
        name: data.name || '',
        location: data.location || '',
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        imageUrl: data.imageUrl || '',
        rating: data.rating ?? '',
        isActive: data.isActive !== false,
      })
      setFeedback({ type: '', message: '' })
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to load canteen details.',
      })
    } finally {
      setActiveCardId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this canteen?')) return
    try {
      setActiveCardId(id)
      await axios.delete(`${API_BASE_URL}/api/canteens/${id}`)
      setFeedback({ type: 'success', message: 'Canteen deleted successfully.' })
      await fetchCanteens()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to delete canteen.',
      })
    } finally {
      setActiveCardId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Canteen Management</h1>
          <p className="mt-1 text-sm text-slate-500">Create, update, and manage all canteen details in one place.</p>
        </div>
        {editingId && (
          <button
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            onClick={handleCancelEdit}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div ref={formSectionRef} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {editingId ? 'Edit Canteen' : 'Add New Canteen'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {feedback.message && (
            <p
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                feedback.type === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {feedback.message}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            name="description"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
            />
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              name="rating"
              type="number"
              step="0.1"
              placeholder="Rating"
              value={form.rating}
              onChange={handleChange}
            />
            <label className="inline-flex h-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Active
            </label>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? editingId
                ? 'Updating...'
                : 'Creating...'
              : editingId
                ? 'Update Canteen'
                : 'Create Canteen'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">All Canteens</h2>

        {loading ? (
          <p className="text-sm text-slate-500">Loading canteens...</p>
        ) : canteens.length === 0 ? (
          <p className="text-sm text-slate-500">No canteens found.</p>
        ) : (
          <div className="space-y-3">
            {canteens.map((canteen) => (
              <div
                key={canteen._id}
                className="grid gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 md:grid-cols-[1fr_auto] md:items-center"
              >
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-slate-900">{canteen.name || 'Untitled'}</h3>
                  <p className="text-sm text-slate-500">
                    {canteen.location || 'No location'} • Rating: {canteen.rating ?? 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-slate-700">Status:</span>{' '}
                    <span
                      className={`font-medium ${
                        canteen.isActive === false ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {canteen.isActive === false ? 'Inactive' : 'Active'}
                    </span>
                  </p>
                  {Array.isArray(canteen.tags) && canteen.tags.length > 0 && (
                    <p className="text-xs text-slate-500">Tags: {canteen.tags.join(', ')}</p>
                  )}
                  <p className="text-sm text-slate-700">{canteen.description || 'No description'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => handleEdit(canteen._id)}
                    disabled={activeCardId === canteen._id}
                  >
                    {activeCardId === canteen._id ? 'Loading...' : 'Edit'}
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => handleDelete(canteen._id)}
                    disabled={activeCardId === canteen._id}
                  >
                    {activeCardId === canteen._id ? 'Working...' : 'Delete'}
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