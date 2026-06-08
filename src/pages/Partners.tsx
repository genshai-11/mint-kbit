import { Navigate, useLocation } from 'react-router-dom'
import { isLocale, type Locale } from '@/lib/locale'

export default function Partners() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale: Locale = isLocale(segments[1]) ? segments[1] : 'en'
  return <Navigate to={`/${locale}/experts`} replace />
}
