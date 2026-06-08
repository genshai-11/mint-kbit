import { assetSrc, assetSrcSet } from '@/lib/assets'

interface ImgProps {
  src: string
  alt: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  className?: string
  width?: number
  height?: number
  style?: React.CSSProperties
}

export default function Img({ src, alt, sizes, loading = 'lazy', className, width, height, style }: ImgProps) {
  const isExternal = src.startsWith('http')
  if (isExternal) {
    return <img src={src} alt={alt} loading={loading} className={className} width={width} height={height} style={style} />
  }

  const webpSrc = assetSrc(src, '800w') || assetSrc(src)
  const srcSet = assetSrcSet(src)

  return (
    <img
      src={webpSrc || src}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={alt}
      loading={loading}
      className={className}
      width={width}
      height={height}
      style={style}
      decoding="async"
    />
  )
}
