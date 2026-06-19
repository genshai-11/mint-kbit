import { Link, useParams } from 'react-router-dom'
import { isLocale, type Locale } from '@/lib/locale'
import { tr } from '@/lib/ui'

export default function NotFound() {
  const { '*': path } = useParams()
  const seg = window.location.pathname.split('/')[1]
  const locale: Locale = isLocale(seg) ? seg : 'en'
  return (
    <div className="container section" style={{ textAlign: 'center', paddingBlock: '120px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-d2)', color: 'var(--clr-navy)' }}>404</p>
      <p style={{ marginTop: 'var(--sp-4)', color: 'var(--clr-stone)' }}>{tr('Page not found', locale)}: {path}</p>
      <Link to={`/${locale}`} style={{ display: 'inline-block', marginTop: 'var(--sp-6)', color: 'var(--clr-gold-dark)', textDecoration: 'underline' }}>
        {tr('← Back to home', locale)}
      </Link>
    </div>
  )
}
