
import { generatedImages } from './media.generated'

/**
 * Media manifest.
 *
 *  - media.generated.ts (written by scripts/optimize-media.mjs) holds FACTS about
 *    the files: native pixel size, byte sizes, which AVIF widths exist.
 *  - This file holds EDITORIAL decisions: alt text, which section an image is
 *    assigned to, and notes.
 *
 * Images not in public/ (kept untouched in media-src/originals/): p9, p13, photo1.
 * Videos are not handled here: see performances.ts (both performance videos are published).
 */

export type ImageId = keyof typeof generatedImages

interface Editorial {
  /** Original filename in media-src/originals/. */
  readonly sourceFile: string
  /** Where the image is used. */
  readonly assignment: string
  /** Alt text. Never claims credits or productions that are not supplied. */
  readonly alt: string
  /** Optional images are judged in the browser before they are kept. */
  readonly optional?: boolean
  readonly note?: string
}

const editorial: Record<ImageId, Editorial> = {
  kneelWide: {
    sourceFile: 'p5.jpeg',
    assignment: 'Hero, 900px and wider',
    alt: 'Bishal Raj kneeling in a pool of stage light, face lifted, mid-line.',
    note: 'Near-square composition. Never cropped to 16:9.',
  },
  kneelClose: {
    sourceFile: 'p4.jpeg',
    assignment: 'Hero, under 900px',
    alt: 'Bishal Raj kneeling in a spotlight, looking upward, hands on his knees.',
    note: 'The top third is empty black: the name sits there on mobile.',
  },
  portraitIntense: {
    sourceFile: 'photo2.jpeg',
    assignment: 'About / introduction portrait',
    alt: 'Close portrait of Bishal Raj in spotlight, one hand at his throat, mid-line.',
    note: 'No retouching: measured highlights are not clipped.',
  },
  stagePonchos: {
    sourceFile: 'p11.jpeg',
    assignment: 'Stage gallery, plate 01',
    alt: 'Two performers in striped ponchos on a dark stage, one holding a rolled paper. Bishal Raj is the prominent performer.',
    note: 'Usage rights and photographer credit to be confirmed before publishing.',
  },
  stageCotton: {
    sourceFile: 'p12.jpeg',
    assignment: 'Stage gallery, plate 02',
    alt: 'Bishal Raj in a bandana and white cotton-wool costume, hand raised, under blue stage light.',
    note: 'Usage rights and photographer credit to be confirmed before publishing.',
  },
  stagePoint: {
    sourceFile: 'p6.jpeg',
    assignment: 'Stage gallery, plate 03',
    alt: 'Bishal Raj pointing off-frame mid-line, lit from above against black.',
    note: 'May be shown at about 3:4 with CSS (anchored to the top). The file itself is never cropped.',
  },
  stageShout: {
    sourceFile: 'p8.jpeg',
    assignment: 'Stage gallery, plate 04',
    alt: 'Bishal Raj with one arm raised, calling out on a dark stage.',
  },
  stageStill: {
    sourceFile: 'p7.jpeg',
    assignment: 'Stage gallery, plate 05',
    alt: 'Bishal Raj standing still in a pool of light, chin lifted, hands behind his back.',
  },
  stageEnsemble: {
    sourceFile: 'p10.jpeg',
    assignment: 'Stage gallery, plate 06 (optional)',
    optional: true,
    alt: 'An ensemble crouched together behind a rolling frame in warm light. Bishal Raj is at the front centre.',
    note: 'His face is small at native size. Keep only if the caption makes it work in the real gallery. Usage rights to be confirmed.',
  },
  kneelFar: {
    sourceFile: 'p3.jpeg',
    assignment: 'Contact section (optional)',
    optional: true,
    alt: 'Bishal Raj kneeling in a spotlit circle on an otherwise dark stage.',
    note: 'Used only if it contributes to the final contact design.',
  },
  nachgharCertificate: {
    sourceFile: 'nachghar-certificate.jpg',
    assignment: 'Stage gallery, Nachghar theatre training certificate',
    alt: 'Bishal Raj receiving a certificate at a Nachghar theatre training event.',
    note: 'Certificate photograph supplied by the owner.',
  },
}

export interface ImageAsset extends Editorial {
  readonly id: ImageId
  /** Native pixel size. Images are never rendered wider than this. */
  readonly width: number
  readonly height: number
  /** Original JPEG, byte-for-byte. Always present; the fallback. */
  readonly src: string
  readonly jpgBytes: number
  /** Responsive AVIF candidates, or null when the original JPEG is served alone. */
  readonly avifSrcSet: string | null
  /** The native-width AVIF, or null. */
  readonly avifSrc: string | null
  readonly avifNativeBytes: number | null
  readonly avifQuality: number | null
  /** Chroma subsampling of the shipped AVIF (4:4:4 keeps full colour resolution). */
  readonly avifChroma: '4:2:0' | '4:4:4' | null
}

const BASE = import.meta.env.BASE_URL

function buildAsset(id: ImageId): ImageAsset {
  const g = generatedImages[id]
  const avifList = g.avif
  const largest = avifList.length > 0 ? avifList[avifList.length - 1] : null
  return {
    ...editorial[id],
    id,
    width: g.width,
    height: g.height,
    src: `${BASE}media/${g.file}.jpg`,
    jpgBytes: g.jpgBytes,
    avifSrcSet:
      avifList.length > 0
        ? avifList.map((v) => `${BASE}media/${g.file}-${v.width}.avif ${v.width}w`).join(', ')
        : null,
    avifSrc: largest ? `${BASE}media/${g.file}-${largest.width}.avif` : null,
    avifNativeBytes: largest ? largest.bytes : null,
    avifQuality: g.avifQuality,
    avifChroma: g.avifChroma,
  }
}

const ids = Object.keys(generatedImages) as ImageId[]

export const images = Object.fromEntries(ids.map((id) => [id, buildAsset(id)])) as Record<ImageId, ImageAsset>

export const imageList: readonly ImageAsset[] = ids.map((id) => images[id])
