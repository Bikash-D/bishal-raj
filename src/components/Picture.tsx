import type { CSSProperties } from 'react'
import type { ImageAsset } from '../content/media'

interface PictureProps {
  asset: ImageAsset
  /** The `sizes` attribute: how wide the image is displayed at each breakpoint. */
  sizes: string
  /** Above-the-fold images load eagerly and at high priority. */
  priority?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Renders an original photograph without cropping or filters.
 *  - AVIF where it was verified as faithful, with the untouched original JPEG as fallback.
 *  - Width and height attributes reserve the right space before the image loads.
 *  - The image is never displayed wider than its native pixel width (no upscaling).
 */
export function Picture({ asset, sizes, priority = false, className, style }: PictureProps) {
  return (
    <picture>
      {asset.avifSrcSet ? <source type="image/avif" srcSet={asset.avifSrcSet} sizes={sizes} /> : null}
      <img
        className={className}
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt={asset.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ maxWidth: `min(100%, ${asset.width}px)`, height: 'auto', ...style }}
      />
    </picture>
  )
}
