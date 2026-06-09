import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, FileText, GraduationCap, PlayCircle, SignOut } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { fetchCourse } from '@/lib/sanity'
import { t } from '@/lib/data'
import { isLocale, type Locale } from '@/lib/locale'
import s from './Portal.module.css'

function embedUrl(url: string): string {
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return url
}

export default function CourseDetail() {
  const { slug }     = useParams<{ slug: string }>()
  const navigate     = useNavigate()
  const location     = useLocation()
  const segments     = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'
  const { profile, loading } = useAuth()
  const [course, setCourse]         = useState<any>(null)
  const [activeLesson, setActive]   = useState(0)
  const [completed, setCompleted]   = useState<Set<string>>(new Set())
  const [fetching, setFetching]     = useState(true)

  useEffect(() => {
    if (!slug || !profile) return
    Promise.all([
      fetchCourse(slug),
      supabase.from('course_progress').select('lesson_slug').eq('member_id', profile.id).eq('course_slug', slug),
    ]).then(([courseData, { data: progress }]) => {
      setCourse(courseData)
      setCompleted(new Set((progress ?? []).map((r: any) => r.lesson_slug)))
    }).finally(() => setFetching(false))
  }, [slug, profile])

  async function markComplete(lessonSlug: string) {
    if (!profile || !slug || completed.has(lessonSlug)) return
    await supabase.from('course_progress').upsert({
      member_id: profile.id, course_slug: slug, lesson_slug: lessonSlug,
    })
    setCompleted(prev => new Set([...prev, lessonSlug]))
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate(`/${locale}/portal/login`)
  }

  if (loading || fetching) return <div className={s.portalLoading}>Loading…</div>
  if (!profile) { navigate(`/${locale}/portal/login`); return null }
  if (!course)  return <div className={s.portalLoading}>Course not found.</div>

  const lessons: any[] = course.lessons ?? []
  const lesson = lessons[activeLesson]

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
        <Link to={`/${locale}/portal/courses`} className={s.backLink}>
          <ArrowLeft size={14} /> Back to Courses
        </Link>
        <h1 className={s.pageTitle}>{t(course.title, locale)}</h1>

        <div className={s.courseDetailLayout}>
          {/* Lesson list */}
          <nav className={s.lessonList}>
            <h3 className={s.lessonListTitle}>Lessons ({lessons.length})</h3>
            {lessons.map((l: any, i: number) => (
              <button key={i} className={`${s.lessonItem} ${i === activeLesson ? s.lessonActive : ''}`}
                onClick={() => setActive(i)}>
                {completed.has(l.slug?.current) ? (
                  <CheckCircle size={16} weight="fill" className={s.completedIcon} />
                ) : l.type === 'video' ? (
                  <PlayCircle size={16} />
                ) : (
                  <FileText size={16} />
                )}
                <span>{t(l.title, locale)}</span>
                {l.duration && <small>{l.duration}m</small>}
              </button>
            ))}
          </nav>

          {/* Lesson content */}
          <div className={s.lessonContent}>
            {lesson ? (
              <>
                <h2 className={s.lessonTitle}>{t(lesson.title, locale)}</h2>
                {lesson.type === 'video' && lesson.videoUrl && (
                  <div className={s.videoWrap}>
                    <iframe src={embedUrl(lesson.videoUrl)} allow="autoplay; fullscreen" allowFullScreen title={t(lesson.title, locale)} />
                  </div>
                )}
                {lesson.type === 'document' && lesson.fileUrl && (
                  <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer" className={s.downloadBtn}>
                    <FileText size={18} /> Download File
                  </a>
                )}
                {lesson.content?.en && (
                  <div className={s.lessonBody} dangerouslySetInnerHTML={{ __html: t(lesson.content, locale) }} />
                )}
                {!completed.has(lesson.slug?.current) && (
                  <button className={s.completeBtn} onClick={() => markComplete(lesson.slug?.current)}>
                    <CheckCircle size={16} /> Mark as Complete
                  </button>
                )}
              </>
            ) : (
              <p>Select a lesson to begin.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
