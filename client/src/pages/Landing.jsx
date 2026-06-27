import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 40px', borderBottom: '1px solid #1e1e1e' }}>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 50 }}>
          Will<span style={{ color: '#c84b31' }}>It</span>
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" style={{ color: '#e4d2d2', borderColor: '#333' }} onClick={() => nav('/login')}>Sign in</button>
          <button className="btn btn-primary" onClick={() => nav('/login')}>get started</button>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: ' 40px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 20, background: '#1e1e1e', color: '#888', fontSize: 12, marginBottom: 32, letterSpacing: '0.05em' }}>
         Dead Poet's legacy
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.15, fontWeight: 500, marginBottom: 20 }}>
          THE LAST LETTER<br />
          {/* <em style={{ color: '#c84b31', fontStyle: 'italic' }}>कुछ ख़त समय नहीं, नियति पढ़ती है...</em> */}
        </h1>
        <p style={{ color: '#c84b31',fontSize: 25, fontStyle: 'italic' }}>
                 कुछ ख़त समय नहीं, नियति पढ़ती है...
        </p>

        <p style={{ fontSize: 17, color: '#888', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px' }}>
Store encrypted letters, choose a trusted recipient, and automatically deliver them if you stop checking in for a predefined period.
     </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{color: ' #e1700dc7;', fontSize: 25, padding: '12px 28px' }} onClick={() => nav('/login')}>
            Write your letter...
          </button>
          {/* <button className="btn btn-ghost" style={{ fontSize: 25, padding: '12px 28px', color: '#666', borderColor: '#333' }} onClick={() => nav('/login')}>
            I have an account
          </button> */}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1px  40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: '✍️', title: 'Write', body: 'Compose your letter,with passwords, wishes,or anything ' },
            { icon: '🔒', title: 'Lock', body: ' As long as you check in, the letter stays locked forever.' },
            { icon: '📬', title: 'Deliver', body: 'set time window,miss your check-in ,automatically sends email .' },
          ].map(f => (
            <div key={f.title} style={{ background: '#161616', border: '1px solid #1e1e1e', borderRadius: 14, padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: '#e0e0e0' }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{f.body}</div>
            </div>
          ))}
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
  ______WillIt-Built by{' '}
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
