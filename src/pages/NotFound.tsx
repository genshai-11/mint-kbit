import { Link, useParams } from 'react-router-dom'

export default function NotFound() {
  const { '*': path } = useParams()
  const locale = window.location.pathname.split('/')[1] || 'en'
  return (
    <div className="container section" style={{ textAlign: 'center', paddingBlock: '120px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--type-d2)', color: 'var(--clr-navy)' }}>404</p>
      <p style={{ marginTop: 'var(--sp-4)', color: 'var(--clr-stone)' }}>Page not found: {path}</p>
      <Link to={`/${locale}`} style={{ display: 'inline-block', marginTop: 'var(--sp-6)', color: 'var(--clr-gold-dark)', textDecoration: 'underline' }}>
        ← Back to home
      </Link>
    </div>
  )
}
