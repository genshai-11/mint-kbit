import type { ReactNode } from 'react'
import { assetSrc, assetSrcSet } from '@/lib/assets'
import s from './PageHero.module.css'

interface Props {
  watermark: string
  overline: string
  title: ReactNode
  desc?: string
  variant?: 'dark' | 'light'
  /** Manifest asset key, e.g. 'home/banner4-b978e3ea.jpg' - renders a photographic banner */
  image?: string
  imageAlt?: string
  children?: ReactNode
}

export default function PageHero({
  watermark,
  overline,
  title,
  desc,
  variant = 'dark',
  image,
  imageAlt = '',
  children,
}: Props) {
  const isDark = variant === 'dark'
  const hasImage = Boolean(image && assetSrc(image, '1200w'))
  return (
    <section
      className={`${s.hero} ${isDark ? s.heroDark : s.heroLight} ${hasImage ? s.heroWithImage : ''}`}
      aria-label={watermark}
    >
      {hasImage && (
        <div className={s.media} aria-hidden={imageAlt === ''}>
          <img
            src={assetSrc(image!, '1600w')}
            srcSet={assetSrcSet(image!)}
            sizes="100vw"
            alt={imageAlt}
            className={s.mediaImg}
            loading="eager"
            width={1600}
            height={520}
          />
          <div className={s.mediaScrim} />
        </div>
      )}
      <div className={`${s.watermark} ${isDark ? s.watermarkDark : s.watermarkLight} ${hasImage ? s.watermarkOnImage : ''}`} aria-hidden="true">
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
