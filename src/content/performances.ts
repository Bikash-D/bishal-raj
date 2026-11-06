/**
 * The performance pieces, in display order. Labels are neutral and editable: no title, character,
 * production or date has been supplied, so none is shown.
 *
 * Both pieces are published, unmodified:
 *   Performance 01 -> public/media/video/bishal-video-1.mp4 = media-src/originals/bishal video 1.mp4
 *   Performance 02 -> public/media/video/bishal-video-2.mp4 = media-src/originals/bishal video 2 - resubmitted upload.mp4
 * Both are byte-for-byte copies (checksums in docs/MEDIA-CHECKSUMS.txt). The archived
 * "bishal video 2.mp4" is the same footage (identical decoded frames and audio, 2 bytes differ) and is
 * kept only as an original; it is not served and is not shown a second time.
 *
 * Posters are single frames taken from the footage itself. Derived or trimmed versions live in
 * media-derived/ and are NOT used until the owner approves one (see docs/VIDEO-COMPARISON.md).
 *
 * Technical observations about the footage belong in docs/VIDEO-ANALYSIS.md, never in public copy.
 */
const BASE = import.meta.env.BASE_URL

export interface PerformancePiece {
  readonly id: string
  readonly number: string
  /** Editable label. */
  readonly label: string
  /** One factual line about what is on screen. Set to null to hide. */
  readonly note: string | null
  readonly src: string
  readonly poster: string
  /** Alt text for the poster; describes the frame, does not name anyone. */
  readonly posterAlt: string
  /** Native pixel size: the frame is never shown larger or stretched. */
  readonly width: number
  readonly height: number
  readonly durationSeconds: number
  /**
   * Optional caption/subtitle track (WebVTT). null = none. Captions are NOT published until an
   * accurate, owner-verified transcript exists (see docs/stage5/SUBTITLES.md). Example, once a verified
   * file is placed at public/media/captions/performance-01.ne.vtt:
   *   captions: { src: `${BASE}media/captions/performance-01.ne.vtt`, srclang: 'ne', label: 'नेपाली' }
   */
  readonly captions: { readonly src: string; readonly srclang: string; readonly label: string } | null
  /**
   * Optional line that tells viewers where Bishal is in the frame, e.g. "Bishal Raj: performer in the
   * dark top". null = hidden. Needed for Performance 02, where he cannot be identified from the footage.
   */
  readonly performerNote: string | null
  /** Playback level only (the file is untouched). 1 = full. Mobile Safari ignores it. */
  readonly startVolume: number
}

export const PERFORMANCES: readonly PerformancePiece[] = [
  {
    id: 'performance-01',
    number: '01',
    label: 'Performance 01',
    note: 'Solo, on a dark stage.',
    src: `${BASE}media/video/bishal-video-1.mp4`,
    poster: `${BASE}media/posters/performance-01.jpg`,
    posterAlt: 'Still from Performance 01: Bishal Raj in close-up under stage light, looking upward mid-line.',
    width: 576,
    height: 928,
    durationSeconds: 72,
    // Measured peaks above full scale (see docs/VIDEO-ANALYSIS.md): start at half level where supported.
    captions: null,
    performerNote: null,
    startVolume: 0.5,
  },
  {
    id: 'performance-02',
    number: '02',
    label: 'Performance 02',
    note: 'Wide view of a stage scene.',
    src: `${BASE}media/video/bishal-video-2.mp4`,
    poster: `${BASE}media/posters/performance-02.jpg`,
    posterAlt: 'Still from Performance 02: a wide view of a stage with two performers, one kneeling over the other, before a blue curtain.',
    width: 576,
    height: 1024,
    durationSeconds: 55,
    captions: null,
    performerNote: null,
    startVolume: 1,
  },
]

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.round(totalSeconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Spoken form for screen readers, e.g. "1 minute 12 seconds". */
export function spokenDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.round(totalSeconds % 60)
  const parts: string[] = []
  if (m) parts.push(`${m} minute${m === 1 ? '' : 's'}`)
  if (s) parts.push(`${s} second${s === 1 ? '' : 's'}`)
  return parts.join(' ')
}
