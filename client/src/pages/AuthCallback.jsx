import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function AuthCallback() {
  const [params] = useSearchParams()
  const { login } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (!token) { nav('/login?error=1', { replace: true }); return }

    localStorage.setItem('token', token)
    api.get('/auth/me')
      .then(res => { login(token, res.data.user); nav('/dashboard', { replace: true }) })
      .catch(() => { localStorage.removeItem('token'); nav('/login?error=1', { replace: true }) })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
      Signing you in...
    </div>
  )
}
