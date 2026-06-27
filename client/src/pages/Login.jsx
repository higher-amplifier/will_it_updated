import { useSearchParams, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Login() {
  const [params] = useSearchParams()

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', padding: '20px 40px', borderBottom: '1px solid #1e1e1e' }}>
        <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 80, color: '#fff', textDecoration: 'none' }}>
          Will<span style={{ color: '#c84b31' }}>It</span>
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ background: '#161616', border: '1px solid #1e1e1e', borderRadius: 18, padding: '48px 40px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
         <div style={{ fontSize: 40, marginBottom: 20 }}>📜</div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 500, marginBottom: 8 }}>
            Enter the vault
          </h1>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 32 }}>
            <br />
            No anonymous access.
          </p>

          {params.get('error') && (
            <div style={{ background: '#1a0a08', border: '1px solid #3d1410', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#c84b31' }}>
              Authentication failed. Please try again.
            </div>
          )}

          <a
            href={`${API}/api/auth/google`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#fff', color: '#1a1a1a', borderRadius: 10, padding: '13px 24px', fontSize: 15, fontWeight: 500, textDecoration: 'none', width: '100%', boxSizing: 'border-box' }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </a>

          <p style={{ marginTop: 28, fontSize: 16, color: '#9f5e21', lineHeight: 1.7 }}>
            Only verified Google accounts can access WillIt.<br />
            Letters are encrypted with AES-256.
          </p>
        </div>
      </div>

      <div
  style={{
    borderTop: '1px solid #933c10',
    padding: '20px 40px',
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
  }}
>
  WillIt-Built by{' '}
  <span
    style={{
      color: '#c84b31',
      fontSize: 18,
      fontWeight: 700,
    }}
  >
    BHARAT MEGHWAL
  </span>
   .Data stays encrypted.
</div>
    </div>
  )
}
