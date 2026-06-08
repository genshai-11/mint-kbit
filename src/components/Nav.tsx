import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LOCALES, type Locale, isLocale } from '@/lib/locale'
import { assetSrc } from '@/lib/assets'
import s from './Nav.module.css'

const NAV_LINKS = [
  { label: 'About', path: 'about' },
  { label: 'Events', path: 'events' },
  { label: 'News', path: 'news' },
  { label: 'Membership', path: 'membership' },
  { label: 'Experts', path: 'experts' },
  { label: 'Contact', path: 'contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const segments = location.pathname.split('/')
  const currentLocale: Locale = isLocale(segments[1]) ? segments[1] : 'en'

  function switchLocale(locale: Locale) {
    const rest = segments.slice(2).join('/')
    navigate(`/${locale}${rest ? '/' + rest : ''}`, { replace: true })
  }

  const logoSrc = assetSrc('brand/kbit-logo-44082c6c.png', '400w')

  return (
    <nav className={s.nav}>
      <div className={`container ${s.inner}`}>
        <NavLink to={`/${currentLocale}`} className={s.logo} aria-label="KBIT home">
          <img src={logoSrc} alt="KBIT" className={s.logoImg} width={120} height={36} />
        </NavLink>

        <div className={s.links}>
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={`/${currentLocale}/${path}`}
              className={({ isActive }) => `${s.link} ${isActive ? s.linkActive : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className={s.right}>
          <div className={s.localeSwitcher} role="group" aria-label="Select language">
            {LOCALES.map(locale => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className={`${s.localeBtn} ${locale === currentLocale ? s.localeBtnActive : ''}`}
                aria-pressed={locale === currentLocale}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
          <NavLink to={`/${currentLocale}/membership`} className={s.ctaBtn}>
            Join KBIT
          </NavLink>
          <button className={s.hamburger} onClick={() => setOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && (
        <div className={s.drawer} aria-modal="true" role="dialog">
          <div className={s.drawerBackdrop} onClick={() => setOpen(false)} />
          <div className={s.drawerPanel}>
            <button className={s.drawerClose} onClick={() => setOpen(false)} aria-label="Close menu">×</button>
            <div className={s.drawerLinks}>
              {NAV_LINKS.map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={`/${currentLocale}/${path}`}
                  className={s.drawerLink}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <div className={s.localeSwitcher}>
              {LOCALES.map(locale => (
                <button
                  key={locale}
                  onClick={() => { switchLocale(locale); setOpen(false) }}
                  className={`${s.localeBtn} ${locale === currentLocale ? s.localeBtnActive : ''}`}
                >
                  {locale.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
