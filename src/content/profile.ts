/**
 * THE CASTING PROFILE: one place to edit everything a casting director might want to know.
 *
 * Rules (so the site never says anything the owner has not confirmed):
 *  - A fact is shown ONLY when `confirmed` is true AND `value` is filled in.
 *  - Everything not yet supplied is `null` / `confirmed: false` and is invisible on the site and in
 *    the PDF. Nothing is guessed, estimated or "typical for the role".
 *  - To publish a fact: set its `value`, then set `confirmed: true`. That is all.
 *
 * Imported directly by scripts/build-profile-pdf.mjs (Node), so keep this file free of
 * bundler-only imports and `import.meta.env`.
 */

export type FactValue = string | readonly string[] | null

export interface ProfileFact {
  readonly id: string
  readonly label: string
  readonly value: FactValue
  /** Owner has seen this exact wording and approved it. */
  readonly confirmed: boolean
  /** Owner-facing note: what is needed, in plain language. Never displayed. */
  readonly note: string
}

export const PROFILE_FACTS: readonly ProfileFact[] = [
  // ── Confirmed by the owner ───────────────────────────────────────────────
  {
    id: 'language',
    label: 'Performs in',
    value: 'Nepali',
    confirmed: true,
    note: 'Primary performance language, confirmed.',
  },
  {
    id: 'openTo',
    label: 'Open to',
    value: ['Film', 'Television', 'Theatre', 'Commercials', 'Digital productions'],
    confirmed: true,
    note: 'Mediums the owner is interested in, confirmed.',
  },

  // ── Supplied but deliberately hidden ─────────────────────────────────────
  {
    id: 'age',
    label: 'Age',
    value: '25',
    confirmed: false,
    note: 'Owner gave an exact age in an earlier stage. Hidden because casting profiles normally use a playing-age range. Set confirmed to true to show it (and keep it current), or replace with a range.',
  },

  // ── Not yet supplied (nothing is shown until filled in AND confirmed) ────
  { id: 'playingAge', label: 'Playing age', value: null, confirmed: false, note: 'A range such as "22–30" — owner decides.' },
  { id: 'height', label: 'Height', value: null, confirmed: false, note: 'Exact measurement from the owner.' },
  { id: 'eyeColour', label: 'Eyes', value: null, confirmed: false, note: 'Owner to state.' },
  { id: 'hairColour', label: 'Hair', value: null, confirmed: false, note: 'Owner to state.' },
  { id: 'basedIn', label: 'Based in', value: null, confirmed: false, note: 'City / country, only if the owner wants it public.' },
  { id: 'otherLanguages', label: 'Other languages', value: null, confirmed: false, note: 'Languages beyond Nepali, with level if known.' },
  { id: 'accents', label: 'Accents & dialects', value: null, confirmed: false, note: 'Only ones the owner can actually perform.' },
  { id: 'skills', label: 'Skills', value: null, confirmed: false, note: 'e.g. singing, dance, stage combat — only verified skills.' },
  { id: 'representation', label: 'Representation', value: null, confirmed: false, note: 'Agent or manager, only if one exists.' },
]

export interface Credit {
  readonly title: string
  readonly role: string
  readonly kind: 'Film' | 'Television' | 'Theatre' | 'Commercial' | 'Digital'
  /** Production company / theatre / director, if the owner wants it shown. */
  readonly company: string | null
  readonly year: string | null
  /** Owner has checked every detail of this entry. Unverified entries never render. */
  readonly verified: boolean
}

/**
 * Credits. Intentionally EMPTY: no acting credits, filmography or productions have been supplied.
 * Add entries here (with `verified: true`) once the owner provides them; a "Credits" block then
 * appears in About and in the PDF automatically.
 */
export const CREDITS: readonly Credit[] = []

function hasValue(v: FactValue): boolean {
  return Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.trim().length > 0
}

/** The facts that may be shown publicly. */
export function visibleFacts(): readonly ProfileFact[] {
  return PROFILE_FACTS.filter((f) => f.confirmed && hasValue(f.value))
}

export function visibleCredits(): readonly Credit[] {
  return CREDITS.filter((c) => c.verified)
}

export function factText(f: ProfileFact): string {
  return Array.isArray(f.value) ? f.value.join(', ') : String(f.value)
}
