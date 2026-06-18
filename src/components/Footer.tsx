import { NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, EnvelopeSimple, MapPinLine } from '@phosphor-icons/react'
import { isLocale } from '@/lib/locale'
import { useSiteSettings } from '@/lib/content/site'
import { assetSrc } from '@/lib/assets'
import s from './Footer.module.css'

export default function Footer() {
  const location = useLocation()
  const segments = location.pathname.split('/')
  const locale = isLocale(segments[1]) ? segments[1] : 'en'
  const settings = useSiteSettings()

  const logoSrc = assetSrc('brand/kbit-logo-44082c6c.png', '400w')
  const copyright = typeof settings.org.copyright === 'object'
    ? settings.org.copyright[locale as 'en' | 'vi' | 'ko'] || settings.org.copyright.en
    : settings.org.copyright

  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.footerHeader}>
          <span className={s.footerWatermark} aria-hidden="true">KBIT</span>
          <div>
            <p className={s.footerOverline}>Korean Beauty International Technology</p>
            <h2 className={s.footerHeading}>Clinical education, partnerships, and global exchange.</h2>
          </div>
          <div className={s.footerActions}>
            <NavLink to={`/${locale}/contact`} className={s.footerAction}>
              <EnvelopeSimple size={18} weight="regular" aria-hidden="true" />
              Contact KBIT
            </NavLink>
            <NavLink to={`/${locale}/contact`} className={s.footerGhost}>
              <MapPinLine size={18} weight="regular" aria-hidden="true" />
              Offices
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </NavLink>
          </div>
        </div>

        <div className={s.grid}>
          <div className={s.brand}>
            <img src={logoSrc} alt="KBIT" className={s.logoImg} width={120} height={32} />
            <p className={s.tagline}>
              Korean Beauty International Technology Association — advancing clinical excellence across Korea, Vietnam, and beyond.
            </p>
            <div className={s.social}>
              <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className={s.socialLink} aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={settings.social.zalo} target="_blank" rel="noopener noreferrer" className={s.socialLink} aria-label="Zalo">
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '-0.5px' }}>Zalo</span>
              </a>
            </div>
          </div>

          <div className={s.col}>
            <p className={s.colTitle}>Explore</p>
            <div className={s.colLinks}>
              {['about', 'events', 'news', 'experts'].map(p => (
                <NavLink key={p} to={`/${locale}/${p}`} className={s.colLink}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </NavLink>
              ))}
            </div>
          </div>

          <div className={s.col}>
            <p className={s.colTitle}>Association</p>
            <div className={s.colLinks}>
              {['membership', 'partners', 'centers'].map(p => (
                <NavLink key={p} to={`/${locale}/${p}`} className={s.colLink}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </NavLink>
              ))}
            </div>
          </div>

          <div className={s.col}>
            <p className={s.colTitle}>Contact</p>
            <div className={s.colLinks}>
              <span className={s.colLink}>{settings.contact.email}</span>
              <a href={`tel:${settings.contact.phoneKr}`} className={s.colLink}>KR: {settings.contact.phoneKr}</a>
              <a href={`tel:${settings.contact.phoneVn}`} className={s.colLink}>VN: {settings.contact.phoneVn}</a>
              <NavLink to={`/${locale}/contact`} className={s.colLink}>Office locations →</NavLink>
            </div>
          </div>
        </div>

        <div className={s.bottom}>
          <p className={s.copyright}>{copyright}</p>
          <p className={s.contact}>Business Reg. {settings.org.businessReg}</p>
        </div>
      </div>
    </footer>
  )
}
