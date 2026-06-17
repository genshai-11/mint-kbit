import { assetSrc, assetSrcSet } from '@/lib/assets'

interface ImgProps {
  src: string
  alt: string
  sizes?: string
  srcSet?: string
  loading?: 'lazy' | 'eager'
  className?: string
  width?: number
  height?: number
  style?: React.CSSProperties
}

export default function Img({ src, alt, sizes, srcSet, loading = 'lazy', className, width, height, style }: ImgProps) {
  const isExternal = src.startsWith('http')
  if (isExternal) {
    return <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading={loading} className={className} width={width} height={height} style={style} decoding="async" />
  }

  const webpSrc = assetSrc(src, '800w') || assetSrc(src)
  const localSrcSet = assetSrcSet(src)

  return (
    <img
      src={webpSrc || src}
      srcSet={srcSet || localSrcSet || undefined}
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
