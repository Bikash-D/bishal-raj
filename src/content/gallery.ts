import { images, type ImageAsset, type ImageId } from './media'

/**
 * The gallery, in reading order, grouped into two rows ("spreads").
 *
 * Wide screens: each row is a justified strip. Every plate in a row has the same height and a width
 * proportional to its own aspect ratio, so nothing is cropped and there are no empty gaps. Row 1 is
 * the large lead spread; row 2 is a quieter three-up.
 * Phones: one column, with portrait plates inset for rhythm.
 *
 * Curated down to five stage photographs on purpose (Stage 5):
 *  - kneelClose (p4) is the phone hero and a near-duplicate of the desktop hero pose, so it no
 *    longer repeats here. It stays available in media.ts.
 *  - kneelWide (p5) and portraitIntense (photo2) are already shown full size in the hero and About.
 *  - stageEnsemble (p10) and kneelFar (p3) remain optional until the owner approves them.
 *  - p9, p13 and photo1 stay excluded.
 */
export interface GalleryEntry {
  readonly id: ImageId
  readonly row: 1 | 2
  /** `sizes` hint for the browser: how wide this plate is at each breakpoint. */
  readonly sizes: string
}

export const GALLERY: readonly GalleryEntry[] = [
  { id: 'stagePonchos', row: 1, sizes: '(min-width: 800px) 62vw, 100vw' },
  { id: 'stagePoint', row: 1, sizes: '(min-width: 800px) 27vw, 78vw' },
  { id: 'stageCotton', row: 2, sizes: '(min-width: 800px) 22vw, 90vw' },
  { id: 'stageStill', row: 2, sizes: '(min-width: 800px) 33vw, 90vw' },
  { id: 'stageShout', row: 2, sizes: '(min-width: 800px) 38vw, 100vw' },
]

export function galleryAsset(entry: GalleryEntry): ImageAsset {
  return images[entry.id]
}
