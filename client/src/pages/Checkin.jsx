import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'

export default function Checkin() {
  const { token } = useParams()
  const [state, setState] = useState('loading')
  const [name, setName] = useState('')

  useEffect(() => {
    api.get(`/checkin/token/${token}`)
      .then(res => { setState('success'); setName(res.data.name) })
      .catch(() => setState('error'))
  }, [token])

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', padding: '20px 40px', borderBottom: '1px solid #1e1e1e' }}>
        <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff', textDecoration: 'none' }}>
          Will<span style={{ color: '#c84b31' }}>It</span>
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ background: '#161616', border: '1px solid #1e1e1e', borderRadius: 18, padding: '48px 40px', width: '100%', maxWidth: 400, textAlign: 'center' }}>

          {state === 'loading' && (
            <p style={{ color: '#444', fontSize: 14 }}>Verifying your check-in...</p>
          )}

          {state === 'success' && (
            <>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 500, marginBottom: 10 }}>
                You're good, {name}.
              </h2>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 32 }}>
                Check-in recorded. Your letter stays locked.<br />The clock resets now.
              </p>
              <Link to="/dashboard" style={{ display: 'inline-block', background: '#c84b31', color: '#fff', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                Go to dashboard
              </Link>
            </>
          )}

          {state === 'error' && (
            <>
              <div style={{ fontSize: 48, marginBottom: 20, color: '#c84b31' }}>✗</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 500, marginBottom: 10 }}>
                Link invalid or expired
              </h2>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 32 }}>
                This check-in link has already been used or doesn't exist.
              </p>
              <Link to="/login" style={{ display: 'inline-block', background: 'transparent', color: '#fff', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid #2a2a2a' }}>
                Sign in instead
              </Link>
            </>
          )}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1a1a1a', padding: '20px 40px', textAlign: 'center', color: '#2a2a2a', fontSize: 13 }}>
        WillIt — Built with care. Your data stays encrypted.
      </div>
    </div>
  )
}
