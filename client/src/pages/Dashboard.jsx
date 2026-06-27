import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import WillModal from '../components/WillModal'

function daysToHuman(d) {
  if (d >= 365) { const y = Math.round(d / 365 * 10) / 10; return `${y}y` }
  if (d >= 30) return `${Math.round(d / 30)}mo`
  if (d >= 1) return `${Math.round(d)}d`
  return `<1d`
}

function intervalLabel(days) {
  if (days >= 365) return `${Math.round(days / 365 * 10) / 10} year(s)`
  if (days >= 30) return `${Math.round(days / 30)} month(s)`
  return `${days} day(s)`
}

function deliveryDate(lastCheckin, deliverAfterDays) {
  const d = new Date(new Date(lastCheckin).getTime() + deliverAfterDays * 24 * 60 * 60 * 1000)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Sidebar({ active, setActive, theme, toggleTheme }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => { logout(); nav('/'); toast.success('Signed out') }

  const items = [
    { id: 'dashboard', label: 'Overview', icon: '◈' },
    { id: 'letters', label: 'My letters', icon: '✉' },
    { id: 'settings', label: 'Settings', icon: '⊙' },
  ]

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, padding: '0 8px' }}>
        <div className="sidebar-logo" style={{ margin: 0 }}>Will<span>It</span></div>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(item => (
          <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => setActive(item.id)}>
            <span style={{ fontSize: 15, opacity: 0.6 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ padding: '8px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          {user?.avatar && <img src={user.avatar} style={{ width: 28, height: 28, borderRadius: '50%', opacity: 0.8 }} />}
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{user?.email}</div>
          </div>
        </div>
        <button className="nav-item" onClick={handleLogout}>
          <span style={{ fontSize: 15, opacity: 0.6 }}>→</span>
          Sign out
        </button>
      </div>
    </div>
  )
}

function Overview({ status, onCheckin, onCheckinLoading }) {
  if (!status) return <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 40, textAlign: 'center' }}>Loading...</div>

  const pct = status.dangerPercent
  const barColor = pct < 50 ? '#2d6a4f' : pct < 80 ? '#d97706' : '#c84b31'
  const deliveryDateStr = new Date(new Date(status.lastCheckin).getTime() + status.checkinInterval * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      <h1 className="page-title">Overview</h1>
      <p className="page-sub">Your dead man's switch status</p>

      {status.triggerFired && (
        <div style={{ background: '#1a0a08', border: '1px solid #3d1410', borderRadius: 12, padding: '14px 16px', marginBottom: 20, fontSize: 14, color: '#c84b31' }}>
          ⚠ Your letters have been sent. Check in to reactivate.
        </div>
      )}

      {/* Hero */}
      <div className="card" style={{ padding: 32, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 280, height: 280, borderRadius: '50%', background: `${barColor}0a`, transform: 'translate(40%, -40%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 160, height: 160, borderRadius: '50%', background: `${barColor}06`, transform: 'translate(-40%, 40%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Time remaining</div>
            <div style={{ fontSize: 64, fontFamily: 'Playfair Display, serif', fontWeight: 500, color: 'var(--text)', lineHeight: 1, marginBottom: 10 }}>
              {daysToHuman(status.daysLeft)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Letters deliver on <span style={{ color: 'var(--text)', fontWeight: 500 }}>{deliveryDateStr}</span>
            </div>
          </div>
          <span className={`badge ${pct < 50 ? 'badge-green' : pct < 80 ? 'badge-amber' : 'badge-red'}`} style={{ fontSize: 13, padding: '5px 14px' }}>
            {pct < 50 ? '● Safe' : pct < 80 ? '● Check in soon' : '● Urgent'}
          </span>
        </div>

        <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>Last check-in: {new Date(status.lastCheckin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>{status.daysSince} days ago</span>
        </div>
        <div className="status-bar" style={{ marginBottom: 28, height: 8, borderRadius: 4 }}>
          <div className="status-bar-fill" style={{ width: `${pct}%`, background: barColor, borderRadius: 4 }} />
        </div>

        <button className="btn btn-primary" onClick={onCheckin} disabled={onCheckinLoading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: 15, borderRadius: 12 }}>
          {onCheckinLoading ? 'Checking in...' : "I'm okay — check in now"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3">
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Window</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>Every {intervalLabel(status.checkinInterval)}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Reminder</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>{daysToHuman(status.checkinInterval * 0.8)} mark</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Danger</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: barColor }}>{pct < 50 ? 'Low' : pct < 80 ? 'Medium' : 'High'} — {Math.round(pct)}%</div>
        </div>
      </div>
    </div>
  )
}

function Letters({ wills, lastCheckin, onNew, onEdit, onDelete }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">My letters</h1>
          <p className="page-sub">{wills.length} {wills.length === 1 ? 'letter' : 'letters'} — all encrypted</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onNew}>+ New letter</button>
      </div>

      {wills.length === 0 ? (
        <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✉</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: 'var(--text)' }}>No letters yet</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Write something for the people who matter.</div>
          <button className="btn btn-primary btn-sm" onClick={onNew}>Write your first letter</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {wills.map(w => (
            <div key={w._id} className="will-card" onClick={() => onEdit(w)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div className="will-card-title">{w.title}</div>
                  <div className="will-card-meta" style={{ marginTop: 4 }}>For {w.nomineeName} · {w.nomineeEmail}</div>
                  <div className="will-card-meta" style={{ marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>Updated {new Date(w.lastModified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {w.isDelivered
                      ? <span style={{ color: '#c84b31' }}>· Delivered</span>
                      : lastCheckin && w.deliverAfterDays && (
                        <span style={{ color: 'var(--text-muted)' }}>· Delivers by {deliveryDate(lastCheckin, w.deliverAfterDays)}</span>
                      )
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginLeft: 12 }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(w)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(w._id)}>Delete</button>
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>🔒 AES-256 encrypted</span>
                {!w.isDelivered && w.deliverAfterDays && (
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>Deliver after {intervalLabel(w.deliverAfterDays)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Settings({ user, setUser, onSaved }) {
  const [unit, setUnit] = useState('days')
  const [value, setValue] = useState(1)
  const [saving, setSaving] = useState(false)

  const toDays = () => {
    if (unit === 'days') return value
    if (unit === 'months') return value * 30
    if (unit === 'years') return value * 365
  }

  const save = async () => {
    const days = toDays()
    if (!days || days <= 0) return toast.error('Enter a valid value')
    setSaving(true)
    try {
      const res = await api.patch('/auth/settings', { checkinInterval: days })
      setUser(res.data.user)
      onSaved()
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const currentDays = user?.checkinInterval
  const currentLabel = intervalLabel(currentDays || 0)

  const presets = [
    { label: '1 week', unit: 'days', value: 7 },
    { label: '2 weeks', unit: 'days', value: 14 },
    { label: '1 month', unit: 'months', value: 1 },
    { label: '3 months', unit: 'months', value: 3 },
    { label: '6 months', unit: 'months', value: 6 },
    { label: '1 year', unit: 'years', value: 1 },
    { label: '2 years', unit: 'years', value: 2 },
    { label: '5 years', unit: 'years', value: 5 },
  ]

  const selectedDays = toDays()

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">Adjust your check-in preferences</p>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Current interval</div>
          <div style={{ fontSize: 28, fontFamily: 'Playfair Display, serif', color: 'var(--text)', fontWeight: 500 }}>{currentLabel}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Miss this window → letters get delivered</div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Reminder at</div>
          <div style={{ fontSize: 28, fontFamily: 'Playfair Display, serif', color: 'var(--text)', fontWeight: 500 }}>
            {daysToHuman((currentDays || 0) * 0.8)} mark
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>You'll get an email reminder here</div>
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Quick presets</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {presets.map(p => {
            const pDays = p.unit === 'days' ? p.value : p.unit === 'months' ? p.value * 30 : p.value * 365
            const selected = selectedDays === pDays
            return (
              <button key={p.label} onClick={() => { setUnit(p.unit); setValue(p.value) }}
                style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${selected ? '#c84b31' : 'var(--border-2)'}`, background: selected ? '#1a0a08' : 'var(--bg-3)', color: selected ? '#c84b31' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}>
                {p.label}
              </button>
            )
          })}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Custom interval</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input type="number" min="1" value={value} onChange={e => setValue(parseFloat(e.target.value))} style={{ width: 100 }} />
          <select value={unit} onChange={e => setUnit(e.target.value)} style={{ flex: 1 }}>
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={save} disabled={saving} style={{ width: '100%', justifyContent: 'center', padding: '13px', borderRadius: 10 }}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1a0a08', border: '1px solid #3d1410', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#c84b31' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'var(--bg-3)', color: 'var(--text-muted)', border: '1px solid var(--border-2)' }}>Google</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const [active, setActive] = useState('dashboard')
  const [wills, setWills] = useState([])
  const [status, setStatus] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingWill, setEditingWill] = useState(null)
  const [checkinLoading, setCheckinLoading] = useState(false)
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const fetchWills = useCallback(async () => {
    const res = await api.get('/will')
    setWills(res.data.wills)
  }, [])

  const fetchStatus = useCallback(async () => {
    const res = await api.get('/checkin/status')
    setStatus(res.data)
  }, [])

  useEffect(() => { fetchWills(); fetchStatus() }, [])

  const checkin = async () => {
    setCheckinLoading(true)
    try {
      await api.post('/checkin/now')
      await fetchStatus()
      toast.success("Checked in. You're all good.")
    } catch {
      toast.error('Check-in failed')
    } finally {
      setCheckinLoading(false)
    }
  }

  const deleteWill = async (id) => {
    if (!confirm('Delete this letter? This cannot be undone.')) return
    await api.delete(`/will/${id}`)
    toast.success('Letter deleted')
    fetchWills()
  }

  const openNew = () => { setEditingWill(null); setShowModal(true) }
  const openEdit = (w) => { setEditingWill(w); setShowModal(true) }
  const onSaved = () => { setShowModal(false); fetchWills() }

  return (
    <div className="layout">
      <Sidebar active={active} setActive={setActive} theme={theme} toggleTheme={toggleTheme} />
      <div className="main-content">
        {active === 'dashboard' && <Overview status={status} onCheckin={checkin} onCheckinLoading={checkinLoading} />}
        {active === 'letters' && <Letters wills={wills} lastCheckin={status?.lastCheckin} onNew={openNew} onEdit={openEdit} onDelete={deleteWill} />}
        {active === 'settings' && <Settings user={user} setUser={setUser} onSaved={fetchStatus} />}
      </div>
      {showModal && <WillModal will={editingWill} onClose={() => setShowModal(false)} onSaved={onSaved} />}
    </div>
  )
}