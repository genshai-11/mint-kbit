import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth/AuthProvider'
import { isLocale, type Locale } from '@/lib/locale'
import { requireSupabase, supabaseConfigured } from '@/lib/supabase'
import { tr } from '@/lib/ui'
import s from './MemberPortal.module.css'

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const locale: Locale = isLocale(location.pathname.split('/')[1]) ? location.pathname.split('/')[1] as Locale : 'en'
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) navigate(`/${locale}/account`, { replace: true })

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const supabase = requireSupabase()
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/${locale}/account` },
        })
        if (error) throw error
        setMessage(tr('Check your email for the login link.', locale))
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate(`/${locale}/account`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : tr('Unable to sign in.', locale))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <main className={s.shell}>
        <section className={s.card}>
          <p className="overline">{tr('Member portal', locale)}</p>
          <h1>{tr('Member login', locale)}</h1>
          <p>{tr('Sign in to view your membership status and member documents.', locale)}</p>
          {!supabaseConfigured && <div className={s.notice}>{tr('Member login is not configured yet.', locale)}</div>}
          <form onSubmit={submit} className={s.form}>
            <label>
              <span>{tr('Email', locale)}</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="member@example.com" />
            </label>
            {mode === 'password' && (
              <label>
                <span>{tr('Password', locale)}</span>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="••••••••" />
              </label>
            )}
            <div className={s.switcher}>
              <button type="button" className={mode === 'password' ? s.active : ''} onClick={() => setMode('password')}>{tr('Password', locale)}</button>
              <button type="button" className={mode === 'magic' ? s.active : ''} onClick={() => setMode('magic')}>{tr('Magic link', locale)}</button>
            </div>
            {error && <div className={s.error}>{error}</div>}
            {message && <div className={s.success}>{message}</div>}
            <button className={s.primary} disabled={loading || !supabaseConfigured}>{loading ? tr('Loading...', locale) : tr('Sign in', locale)}</button>
          </form>
          <Link to={`/${locale}/membership/apply`} className={s.secondary}>{tr('Apply for membership', locale)}</Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
