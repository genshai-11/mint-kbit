import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FileText, GraduationCap, SignOut, UserCircle } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Portal.module.css'

const TIER_BADGE: Record<string, string> = {
  standard: 'Standard', professional: 'Professional', strategic: 'Strategic Partner',
}

export default function PortalProfile() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const segments     = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'
  const { profile, loading } = useAuth()
  const [phone, setPhone]   = useState('')
  const [org, setOrg]       = useState('')
  const [saved, setSaved]   = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate(`/${locale}/portal/login`)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({
      phone: phone || profile.phone,
      organization: org || profile.organization,
    }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className={s.portalLoading}>Loading…</div>
  if (!profile) { navigate(`/${locale}/portal/login`); return null }

  return (
    <div className={s.portalShell}>
      <aside className={s.sidebar}>
        <div className={s.sidebarBrand}><span>KBIT</span><small>Member Portal</small></div>
        <nav className={s.sidebarNav}>
          <Link to={`/${locale}/portal/dashboard`} className={s.navItem}><GraduationCap size={18} /> Dashboard</Link>
          <Link to={`/${locale}/portal/courses`} className={s.navItem}><GraduationCap size={18} /> Courses</Link>
          <Link to={`/${locale}/portal/resources`} className={s.navItem}><FileText size={18} /> Resources</Link>
          <Link to={`/${locale}/portal/profile`} className={`${s.navItem} ${s.navActive}`}><UserCircle size={18} /> Profile</Link>
        </nav>
        <button className={s.signOutBtn} onClick={handleSignOut}><SignOut size={16} /> Sign Out</button>
      </aside>

      <main className={s.portalMain}>
        <h1 className={s.pageTitle}>My Profile</h1>

        <div className={s.profileCard}>
          <div className={s.profileHeader}>
            <div className={s.profileAvatar}>{profile.full_name.charAt(0).toUpperCase()}</div>
            <div>
              <h2 className={s.profileName}>{profile.full_name}</h2>
              <span className={s.tierBadge} data-tier={profile.membership_tier}>
                {TIER_BADGE[profile.membership_tier]}
              </span>
            </div>
          </div>

          <dl className={s.detailGrid}>
            <div><dt>Email</dt><dd>{profile.email}</dd></div>
            <div><dt>Status</dt><dd className={s[`status_${profile.status}`]}>{profile.status}</dd></div>
            <div><dt>Member since</dt><dd>{new Date(profile.activated_at).toLocaleDateString()}</dd></div>
            {profile.expires_at && <div><dt>Expires</dt><dd>{new Date(profile.expires_at).toLocaleDateString()}</dd></div>}
          </dl>

          <form className={s.profileForm} onSubmit={handleSave}>
            <h3 className={s.formSectionTitle}>Update Information</h3>
            <div className={s.row}>
              <div className={s.field}>
                <label className={s.label} htmlFor="prof-phone">Phone</label>
                <input id="prof-phone" className={s.input} type="tel"
                  defaultValue={profile.phone ?? ''} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className={s.field}>
                <label className={s.label} htmlFor="prof-org">Organization</label>
                <input id="prof-org" className={s.input} type="text"
                  defaultValue={profile.organization ?? ''} onChange={e => setOrg(e.target.value)} />
              </div>
            </div>
            <button className={s.submitBtn} type="submit" disabled={saving}>
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
