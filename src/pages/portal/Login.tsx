import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Portal.module.css'

export default function PortalLogin() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const segments   = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode]       = useState<'login' | 'forgot'>('login')
  const [sent, setSent]       = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    navigate(`/${locale}/portal/dashboard`)
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/portal/reset-password`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  return (
    <div className={s.loginPage}>
      <div className={s.loginCard}>
        <div className={s.loginBrand}>
          <span className={s.loginLogo}>KBIT</span>
          <h1 className={s.loginTitle}>Member Portal</h1>
          <p className={s.loginSub}>Access your courses and resources</p>
        </div>

        {mode === 'login' ? (
          <form className={s.loginForm} onSubmit={handleLogin}>
            <div className={s.field}>
              <label className={s.label} htmlFor="login-email">Email</label>
              <input id="login-email" className={s.input} type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="login-password">Password</label>
              <input id="login-password" className={s.input} type="password" required autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p className={s.errorMsg}>{error}</p>}
            <button className={s.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <button type="button" className={s.linkBtn} onClick={() => setMode('forgot')}>
              Forgot password?
            </button>
          </form>
        ) : sent ? (
          <div className={s.sentBox}>
            <p>Check your email — we sent a password reset link to <strong>{email}</strong>.</p>
            <button type="button" className={s.linkBtn} onClick={() => { setMode('login'); setSent(false) }}>
              Back to login
            </button>
          </div>
        ) : (
          <form className={s.loginForm} onSubmit={handleForgot}>
            <p className={s.forgotDesc}>Enter your email and we'll send a reset link.</p>
            <div className={s.field}>
              <label className={s.label} htmlFor="forgot-email">Email</label>
              <input id="forgot-email" className={s.input} type="email" required
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {error && <p className={s.errorMsg}>{error}</p>}
            <button className={s.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
            <button type="button" className={s.linkBtn} onClick={() => setMode('login')}>
              Back to login
            </button>
          </form>
        )}

        <p className={s.loginFooter}>
          Not a member yet?{' '}
          <Link to={`/${locale}/membership`}>Apply for membership →</Link>
        </p>
      </div>
    </div>
  )
}
