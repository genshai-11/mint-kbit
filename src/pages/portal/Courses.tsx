import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, FileText, PlayCircle, SignOut } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { fetchCourses, sanityImageSrc } from '@/lib/sanity'
import { t } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Portal.module.css'

export default function Courses() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const segments     = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'
  const { profile, loading } = useAuth()
  const [courses, setCourses]   = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!profile) return
    fetchCourses(profile.membership_tier)
      .then(data => setCourses(data ?? []))
      .finally(() => setFetching(false))
  }, [profile])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate(`/${locale}/portal/login`)
  }

  if (loading) return <div className={s.portalLoading}>Loading…</div>
  if (!profile) { navigate(`/${locale}/portal/login`); return null }

  return (
    <div className={s.portalShell}>
      <aside className={s.sidebar}>
        <div className={s.sidebarBrand}><span>KBIT</span><small>Member Portal</small></div>
        <nav className={s.sidebarNav}>
          <Link to={`/${locale}/portal/dashboard`} className={s.navItem}><GraduationCap size={18} /> Dashboard</Link>
          <Link to={`/${locale}/portal/courses`} className={`${s.navItem} ${s.navActive}`}><GraduationCap size={18} /> Courses</Link>
          <Link to={`/${locale}/portal/resources`} className={s.navItem}><FileText size={18} /> Resources</Link>
          <Link to={`/${locale}/portal/profile`} className={s.navItem}><GraduationCap size={18} /> Profile</Link>
        </nav>
        <button className={s.signOutBtn} onClick={handleSignOut}><SignOut size={16} /> Sign Out</button>
      </aside>

      <main className={s.portalMain}>
        <header className={s.portalHeader}>
          <div>
            <h1 className={s.pageTitle}>Courses</h1>
            <p className={s.pageSub}>Training courses available for your membership tier</p>
          </div>
        </header>

        {fetching ? (
          <p className={s.loadingText}>Loading courses…</p>
        ) : courses.length === 0 ? (
          <div className={s.emptyState}>
            <GraduationCap size={48} weight="thin" />
            <h3>No courses yet</h3>
            <p>New courses will be added soon. Check back later.</p>
          </div>
        ) : (
          <div className={s.courseGrid}>
            {courses.map((course: any) => (
              <Link
                key={course._id}
                to={`/${locale}/portal/courses/${course.slug?.current}`}
                className={s.courseCard}
              >
                {course.coverImage ? (
                  <img src={sanityImageSrc(course.coverImage, 640)} alt="" className={s.courseThumb} />
                ) : (
                  <div className={s.courseThumbPlaceholder}><GraduationCap size={40} weight="thin" /></div>
                )}
                <div className={s.courseBody}>
                  <h3 className={s.courseTitle}>{t(course.title, locale)}</h3>
                  <p className={s.courseDesc}>{t(course.description, locale)}</p>
                  <div className={s.courseMeta}>
                    <PlayCircle size={14} />
                    <span>{course.lessonCount ?? 0} lessons</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
