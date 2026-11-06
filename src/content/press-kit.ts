/**
 * Press kit: the downloadable one-page casting profile (PDF).
 *
 * The PDF is generated from the same confirmed data as the website (see scripts/build-profile-pdf.mjs
 * and docs/stage5/PRESS-KIT-STATUS.md) and contains only owner-confirmed facts. It is NOT a CV:
 * no CV or filmography has been supplied, so none is implied.
 *
 * To hide the download everywhere, set `PRESS_KIT.file` to null.
 */
const BASE = import.meta.env.BASE_URL

export const PRESS_KIT = {
  label: 'Casting profile',
  description: 'One page: portrait, training, language and contact.',
  file: {
    href: `${BASE}Bishal-Raj-Actor-Profile.pdf`,
    downloadName: 'Bishal-Raj-Actor-Profile.pdf',
    format: 'PDF',
    pages: 1,
  },
} as const
