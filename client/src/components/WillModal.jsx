import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

export default function WillModal({ will, onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', content: '', nomineeEmail: '', nomineeName: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (will) {
      api.get(`/will/${will._id}`).then(res => {
        const w = res.data.will
        setForm({ title: w.title, content: w.content, nomineeEmail: w.nomineeEmail, nomineeName: w.nomineeName })
      })
    }
  }, [will])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.content || !form.nomineeEmail || !form.nomineeName)
      return toast.error('Fill all fields')
    setLoading(true)
    try {
      if (will) {
        await api.put(`/will/${will._id}`, form)
        toast.success('Letter updated')
      } else {
        await api.post('/will', form)
        toast.success('Letter saved and encrypted')
      }
      onSaved()
    } catch {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3 className="modal-title">{will ? 'Edit letter' : 'Write a new letter'}</h3>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Letter title</label>
            <input placeholder="e.g. For my family, Passwords & accounts..." value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Your message</label>
            <textarea rows={8} placeholder="Write anything — passwords, final wishes, account details..." value={form.content} onChange={e => set('content', e.target.value)} />
            <span style={{ fontSize: 12, color: '#3a3a3a' }}>AES-256 encrypted. Only your nominee will read this.</span>
          </div>

          <div className="divider" />

          <p style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>Who receives this letter</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Their name</label>
              <input placeholder="Ravi Kumar" value={form.nomineeName} onChange={e => set('nomineeName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Their email</label>
              <input type="email" placeholder="ravi@example.com" value={form.nomineeEmail} onChange={e => set('nomineeEmail', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Saving...' : will ? 'Save changes' : 'Save letter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
