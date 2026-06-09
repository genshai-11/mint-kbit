import { useNavigate, useLocation, Link } from 'react-router-dom'
import { GraduationCap, FileText, UserCircle, SignOut, SealCheck } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Portal.module.css'

const TIER_BADGE: Record<string, string> = {
  standard:     'Standard',
  professional: 'Professional',
  strategic:    'Strategic Partner',
}

export default function Dashboard() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const segments     = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'
  const { profile, loading } = useAuth()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate(`/${locale}/portal/login`)
  }

  if (loading) return <div className={s.portalLoading}>Loading…</div>
  if (!profile) {
    navigate(`/${locale}/portal/login`)
    return null
  }

  const expiresAt = profile.expires_at ? new Date(profile.expires_at) : null
  const daysLeft  = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / 86_400_000) : null

  return (
    <div className={s.portalShell}>
      <aside className={s.sidebar}>
        <div className={s.sidebarBrand}>
          <span>KBIT</span>
          <small>Member Portal</small>
        </div>
        <nav className={s.sidebarNav}>
          <Link to={`/${locale}/portal/dashboard`} className={`${s.navItem} ${s.navActive}`}>
            <SealCheck size={18} /> Dashboard
          </Link>
          <Link to={`/${locale}/portal/courses`} className={s.navItem}>
            <GraduationCap size={18} /> Courses
          </Link>
          <Link to={`/${locale}/portal/resources`} className={s.navItem}>
            <FileText size={18} /> Resources
          </Link>
          <Link to={`/${locale}/portal/profile`} className={s.navItem}>
            <UserCircle size={18} /> Profile
          </Link>
        </nav>
        <button className={s.signOutBtn} onClick={handleSignOut}>
          <SignOut size={16} /> Sign Out
        </button>
      </aside>

      <main className={s.portalMain}>
        <header className={s.portalHeader}>
          <div>
            <h1 className={s.welcomeTitle}>Welcome back, {profile.full_name.split(' ')[0]}!</h1>
            <p className={s.welcomeSub}>Here's what's available for you today.</p>
          </div>
          <span className={s.tierBadge} data-tier={profile.membership_tier}>
            {TIER_BADGE[profile.membership_tier]}
          </span>
        </header>

        <div className={s.dashGrid}>
          <Link to={`/${locale}/portal/courses`} className={s.dashCard}>
            <GraduationCap size={32} weight="bold" className={s.dashIcon} />
            <h3>Courses</h3>
            <p>Access your training courses and lessons</p>
          </Link>
          <Link to={`/${locale}/portal/resources`} className={s.dashCard}>
            <FileText size={32} weight="bold" className={s.dashIcon} />
            <h3>Resources</h3>
            <p>Download clinical protocols, templates, and materials</p>
          </Link>
          <Link to={`/${locale}/portal/profile`} className={s.dashCard}>
            <UserCircle size={32} weight="bold" className={s.dashIcon} />
            <h3>My Profile</h3>
            <p>View and update your membership information</p>
          </Link>
        </div>

        {daysLeft !== null && daysLeft <= 30 && (
          <div className={s.expiryWarning}>
            Your membership expires in <strong>{daysLeft} days</strong>. Contact us to renew.
          </div>
        )}

        <div className={s.memberInfo}>
          <h2 className={s.sectionTitle}>Membership Details</h2>
          <dl className={s.detailGrid}>
            <div><dt>Name</dt><dd>{profile.full_name}</dd></div>
            <div><dt>Email</dt><dd>{profile.email}</dd></div>
            <div><dt>Tier</dt><dd>{TIER_BADGE[profile.membership_tier]}</dd></div>
            <div><dt>Status</dt><dd className={s[`status_${profile.status}`]}>{profile.status}</dd></div>
            {profile.organization && <div><dt>Organization</dt><dd>{profile.organization}</dd></div>}
            {expiresAt && <div><dt>Expires</dt><dd>{expiresAt.toLocaleDateString()}</dd></div>}
          </dl>
        </div>
      </main>
    </div>
  )
}
