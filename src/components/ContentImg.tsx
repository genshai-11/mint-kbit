import type { CSSProperties } from 'react'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import Img from '@/components/Img'
import { sanityImageSrc, sanityImageSrcSet } from '@/lib/sanity'

interface ContentImgProps {
  localSrc?: string
  sanityImage?: SanityImageSource | null
  alt: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  className?: string
  width?: number
  height?: number
  style?: CSSProperties
}

export default function ContentImg({
  localSrc = '',
  sanityImage,
  alt,
  sizes,
  loading = 'lazy',
  className,
  width,
  height,
  style,
}: ContentImgProps) {
  if (sanityImage) {
    return (
      <Img
        src={sanityImageSrc(sanityImage, width && width > 0 ? Math.min(width, 1600) : 800)}
        srcSet={sanityImageSrcSet(sanityImage)}
        sizes={sizes}
        alt={alt}
        loading={loading}
        className={className}
        width={width}
        height={height}
        style={style}
      />
    )
  }

  return (
    <Img
      src={localSrc}
      sizes={sizes}
      alt={alt}
      loading={loading}
      className={className}
      width={width}
      height={height}
      style={style}
    />
  )
}
