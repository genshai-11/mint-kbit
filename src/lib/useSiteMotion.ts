import { useLayoutEffect } from 'react'

const MOTION_SELECTOR = [
  'section',
  'main article',
  'main aside',
  'main form',
  'main [class*="Card"]',
  'main [class*="card"]',
  'main [class*="Panel"]',
  'main [class*="panel"]',
  'main [class*="Feature"]',
  'main [class*="feature"]',
  'footer [class*="footerHeader"]',
  'footer [class*="grid"]',
  'footer [class*="brand"]',
  'footer [class*="col"]',
].join(',')

const SKIP_CLASS_PARTS = ['heroSlide', 'partnersTrack', 'partnerLogo']

function shouldAnimate(el: HTMLElement): boolean {
  if (el.dataset.motionSkip === 'true' || el.dataset.motion === 'visible') return false
  const className = typeof el.className === 'string' ? el.className : ''
  return !SKIP_CLASS_PARTS.some((part) => className.includes(part))
}

function motionKind(el: HTMLElement): string {
  const className = typeof el.className === 'string' ? el.className : ''
  if (/Card|card|Panel|panel|Item|item/.test(className)) return 'surface'
  if (/Hero|hero|Feature|feature|Visual|visual/.test(className)) return 'feature'
  return 'section'
}

export function useSiteMotion(routeKey: string) {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.querySelector<HTMLElement>('.page-transition')
    if (!root || reduceMotion) return

    document.documentElement.classList.add('motion-enhanced')
    const candidates = Array.from(root.querySelectorAll<HTMLElement>(MOTION_SELECTOR)).filter(shouldAnimate)
    candidates.forEach((el, index) => {
      el.dataset.motion = 'pending'
      el.dataset.motionKind = motionKind(el)
      el.style.setProperty('--motion-index', String(Math.min(index % 7, 6)))
    })

    if (!('IntersectionObserver' in window)) {
      candidates.forEach((el) => {
        el.dataset.motion = 'visible'
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.dataset.motion = 'visible'
          observer.unobserve(el)
        })
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12,
      },
    )

    candidates.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('motion-enhanced')
      candidates.forEach((el) => {
        el.removeAttribute('data-motion')
        el.removeAttribute('data-motion-kind')
        el.style.removeProperty('--motion-index')
      })
    }
  }, [routeKey])
}
