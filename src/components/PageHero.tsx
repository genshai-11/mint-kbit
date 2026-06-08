import type { ReactNode } from 'react'
import s from './PageHero.module.css'

interface Props {
  watermark: string
  overline: string
  title: ReactNode
  desc?: string
  variant?: 'dark' | 'light'
  children?: ReactNode
}

export default function PageHero({
  watermark,
  overline,
  title,
  desc,
  variant = 'dark',
  children,
}: Props) {
  const isDark = variant === 'dark'
  return (
    <section
      className={`${s.hero} ${isDark ? s.heroDark : s.heroLight}`}
      aria-label={watermark}
    >
      <div className={`${s.watermark} ${isDark ? s.watermarkDark : s.watermarkLight}`} aria-hidden="true">
        {watermark}
      </div>
      <div className={`container ${s.inner}`}>
        <span className={`${s.overline} ${isDark ? s.overlineDark : s.overlineLight}`}>
          {overline}
        </span>
        <h1 className={`${s.title} ${isDark ? s.titleDark : s.titleLight}`}>{title}</h1>
        {desc && (
          <p className={`${s.desc} ${isDark ? s.descDark : s.descLight}`}>{desc}</p>
        )}
        {children}
      </div>
    </section>
  )
}
