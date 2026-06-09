import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Component, Suspense, lazy, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useSiteMotion } from '@/lib/useSiteMotion'
import { LOCALES, type Locale, isLocale } from '@/lib/locale'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const Home = lazy(() => import('./pages/Home'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const News = lazy(() => import('./pages/News'))
const NewsDetail = lazy(() => import('./pages/NewsDetail'))
const Membership = lazy(() => import('./pages/Membership'))
const About = lazy(() => import('./pages/About'))
const Partners = lazy(() => import('./pages/Partners'))
const Contact = lazy(() => import('./pages/Contact'))
const Experts       = lazy(() => import('./pages/Experts'))
const Centers       = lazy(() => import('./pages/Centers'))
const NotFound      = lazy(() => import('./pages/NotFound'))
const PortalLogin   = lazy(() => import('./pages/portal/Login'))
const Dashboard     = lazy(() => import('./pages/portal/Dashboard'))
const Courses       = lazy(() => import('./pages/portal/Courses'))
const CourseDetail  = lazy(() => import('./pages/portal/CourseDetail'))
const Resources     = lazy(() => import('./pages/portal/Resources'))
const PortalProfile = lazy(() => import('./pages/portal/Profile'))

function LocaleRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="events" element={<Events />} />
      <Route path="events/:slug" element={<EventDetail />} />
      <Route path="news" element={<News />} />
      <Route path="news/:slug" element={<NewsDetail />} />
      <Route path="membership" element={<Membership />} />
      <Route path="about" element={<About />} />
      <Route path="partners" element={<Partners />} />
      <Route path="contact" element={<Contact />} />
      <Route path="experts" element={<Experts />} />
      <Route path="centers" element={<Centers />} />
      {/* ── Member portal ── */}
      <Route path="portal/login"    element={<PortalLogin />} />
      <Route path="portal/dashboard" element={<Dashboard />} />
      <Route path="portal/courses"  element={<Courses />} />
      <Route path="portal/courses/:slug" element={<CourseDetail />} />
      <Route path="portal/resources" element={<Resources />} />
      <Route path="portal/profile"  element={<PortalProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteErrorBoundary>
        <AnimatedRoutes />
      </RouteErrorBoundary>
    </BrowserRouter>
  )
}

class RouteErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    const { error } = this.state
    if (error) {
      const message = error instanceof Error ? error.message : 'Unknown route error'
      return (
        <div className="page-loading" style={{ padding: '32px' }}>
          <div className="container">
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-navy)', marginBottom: '16px' }}>Route error</h1>
            <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--clr-charcoal)' }}>{message}</pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function MotionTrigger({ routeKey }: { routeKey: string }) {
  useSiteMotion(routeKey)
  return null
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<div className="page-loading" />}>
      <MotionTrigger routeKey={location.pathname} />
      <ScrollToTop />
      <div key={location.pathname} className="page-transition">
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/en" replace />} />
          {LOCALES.map((locale) => (
            <Route key={locale} path={`/${locale}/*`} element={<LocaleRoutes />} />
          ))}
          <Route path="/:maybeLocale/*" element={<LocaleRedirect />} />
        </Routes>
      </div>
    </Suspense>
  )
}

function LocaleRedirect() {
  const { pathname } = useLocation()
  const segment = pathname.split('/')[1]
  const target = isLocale(segment) ? pathname : `/en${pathname}`
  return <Navigate to={target} replace />
}
