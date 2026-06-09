import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowDown, FileText, GraduationCap, SignOut } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { fetchResources } from '@/lib/sanity'
import { t } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Portal.module.css'

const CATEGORY_LABEL: Record<string, string> = {
  course_material:   'Course Material',
  clinical_protocol: 'Clinical Protocol',
  certificate:       'Certificate',
  template:          'Template / Form',
  other:             'Other',
}

export default function Resources() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const segments     = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'
  const { profile, loading } = useAuth()
  const [resources, setResources] = useState<any[]>([])
  const [fetching, setFetching]   = useState(true)
  const [filter, setFilter]       = useState('all')

  useEffect(() => {
    if (!profile) return
    fetchResources(profile.membership_tier)
      .then(data => setResources(data ?? []))
      .finally(() => setFetching(false))
  }, [profile])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate(`/${locale}/portal/login`)
  }

  if (loading) return <div className={s.portalLoading}>Loading…</div>
  if (!profile) { navigate(`/${locale}/portal/login`); return null }

  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category).filter(Boolean)))]
  const filtered   = filter === 'all' ? resources : resources.filter(r => r.category === filter)

  return (
    <div className={s.portalShell}>
      <aside className={s.sidebar}>
        <div className={s.sidebarBrand}><span>KBIT</span><small>Member Portal</small></div>
        <nav className={s.sidebarNav}>
          <Link to={`/${locale}/portal/dashboard`} className={s.navItem}><GraduationCap size={18} /> Dashboard</Link>
          <Link to={`/${locale}/portal/courses`} className={s.navItem}><GraduationCap size={18} /> Courses</Link>
          <Link to={`/${locale}/portal/resources`} className={`${s.navItem} ${s.navActive}`}><FileText size={18} /> Resources</Link>
          <Link to={`/${locale}/portal/profile`} className={s.navItem}><GraduationCap size={18} /> Profile</Link>
        </nav>
        <button className={s.signOutBtn} onClick={handleSignOut}><SignOut size={16} /> Sign Out</button>
      </aside>

      <main className={s.portalMain}>
        <header className={s.portalHeader}>
          <div>
            <h1 className={s.pageTitle}>Resources</h1>
            <p className={s.pageSub}>Documents and materials available for your membership tier</p>
          </div>
        </header>

        {categories.length > 2 && (
          <div className={s.filterBar}>
            {categories.map(cat => (
              <button key={cat} className={`${s.filterBtn} ${filter === cat ? s.filterActive : ''}`}
                onClick={() => setFilter(cat)}>
                {cat === 'all' ? 'All' : CATEGORY_LABEL[cat] ?? cat}
              </button>
            ))}
          </div>
        )}

        {fetching ? (
          <p className={s.loadingText}>Loading resources…</p>
        ) : filtered.length === 0 ? (
          <div className={s.emptyState}>
            <FileText size={48} weight="thin" />
            <h3>No resources yet</h3>
            <p>Materials will be added soon. Check back later.</p>
          </div>
        ) : (
          <div className={s.resourceGrid}>
            {filtered.map((r: any) => (
              <a key={r._id} href={r.fileUrl} target="_blank" rel="noopener noreferrer" className={s.resourceCard}>
                <div className={s.resourceIcon}><FileText size={28} weight="bold" /></div>
                <div className={s.resourceBody}>
                  <span className={s.resourceCat}>{CATEGORY_LABEL[r.category] ?? r.category}</span>
                  <h3 className={s.resourceTitle}>{t(r.title, locale)}</h3>
                  {r.description && <p className={s.resourceDesc}>{t(r.description, locale)}</p>}
                </div>
                <div className={s.resourceDownload}><ArrowDown size={18} /></div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
