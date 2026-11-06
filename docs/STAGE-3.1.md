# Stage 3.1: refinement, video presentation and consistency

No redesign. Same identity, hero, section order and fonts. Only the items below changed.

## Changed
- **Public technical note removed.** The Performance 02 line about a sideways clip and dark stretch is gone from the page and from the data model (`viewingNote` no longer exists). Both pieces carry neutral labels ("Performance 01", "Performance 02") and one factual line each. The technical notes remain in `VIDEO-ANALYSIS.md` and `VIDEO-COMPARISON.md`.
- **Performance layout.** Both videos now start on the same line and come out the same height at their own native shapes (columns are sized from each video's aspect ratio in `Performance.tsx`). The earlier deliberate offset that pushed Performance 02 lower was removed so it no longer looks like an afterthought. Footage is never stretched or cropped (measured ratios: 0.6207 and 0.5625, exactly native).
- **Performance 02 alt text** stays neutral (no name, no production, no claim about who is who).
- **Age.** `SHOW_AGE` in `src/content/site.ts` is `false`, so the exact age is hidden. The number is kept as `AGE` and appears in About if `SHOW_AGE` is set to `true`. No playing-age range was invented.
- **Mandala Theatre wording unchanged:** "Theatre Training / Mandala Theatre / Certificate holder". No course, certificate title, year or level added.
- **Metadata.** Added `og:locale`, `og:image:type` and profile first/last name. When `VITE_SITE_URL` is set, the build adds canonical, `og:url`, absolute `og:image`/`twitter:image` and `url`/`image` in the JSON-LD (tested with a dummy domain; nothing is defaulted without it). Title, description, Open Graph, Twitter card, favicons and the 1200x630 share image were reviewed and left as they were.
- **Documentation corrected** (README, `MEDIA-PROCESSING.md`, `STAGE-1/2/3.md`, `VIDEO-ANALYSIS.md`, comments in `media.ts`, `performances.ts`, the dev review page): both videos are included; the new Video 2 is shown once; the archived duplicate is an original only; the two public files map to the correct sources; proposals are never published automatically. Older stage docs are kept as history with a note pointing here.
- **New comparison material:** version C (sideways clip and dark gap removed), two poster candidates, a timeline graphic, contact sheets, and `VIDEO-COMPARISON.md` with a recommendation.

## Not changed
Originals, served videos, posters, images. SHA-256 re-verified after all edits (see below).

## QA actually run (5 November 2026, Linux sandbox)
| Check | Result |
|---|---|
| `npm ci` | succeeded, 0 vulnerabilities |
| `npm run lint` | 0 warnings, 0 errors |
| `npm run build` (`tsc -b && vite build`) | succeeded |
| Production preview, Google Chrome 153 (Linux) | 1440, 1366, 768, 390, 360 px: no horizontal overflow, no console errors, no failed requests |
| Both videos | each plays to a moving `currentTime`; starting 02 pauses 01; no `.mp4` is requested before Play; both also play on a mobile-emulated viewport |
| Public text | no mention of "sideways" or "dark" in the page text; no Age row |
| Navigation, gallery, lightbox | all five nav links; 6 gallery plates; lightbox opens, arrow key works, Escape closes and focus returns to the plate |
| Mobile menu | opens, Escape closes, link navigates to `#performance` and closes |
| External links | Instagram and Facebook have `target="_blank"` and `rel="noopener noreferrer"` |
| Domain injection | with a dummy `VITE_SITE_URL`: canonical, `og:url`, absolute images and JSON-LD `url`/`image` all appear; without it none are written |

Screenshots: `docs/screenshots/stage3-1/` (Performance at all five widths, full pages at 1440 and 390, the open mobile menu). Fonts in these are the real Newsreader and Hanken Grotesk from the build.

## NOT tested (be honest)
- Safari and iOS (including `playsInline`, fullscreen, and the fact that iPhone ignores the 50% start volume for Performance 01), Firefox, Windows, any physical device.
- Whether the Instagram and Facebook pages actually open (only the link attributes were checked; no outbound browsing).
- Screen readers. Audio was never listened to.
- The real social-share preview (needs a public domain).

## Remaining decisions for the owner
1. Performance 02: which performer is Bishal; whether to publish A, B or C; whether the 0:33-0:47 audio is needed; whether the third-party banner may be shown; poster frame (`VIDEO-COMPARISON.md`).
2. Performance 01 trim and gain proposal (`proposed-performance-01-trim-gain.mp4`), still undecided; it also fixes loud peaks on iPhone.
3. Show or hide the exact age (`SHOW_AGE`).
4. Exact certificate wording, if any should be shown.
5. Real domain (`VITE_SITE_URL`) and contact email (`CONTACT_EMAIL`).
6. Usage rights and photographer credit for p5, p10, p11, p12.
7. p10 in the gallery or not.
