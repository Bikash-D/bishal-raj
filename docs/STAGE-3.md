# Stage 3: performance, theatre background, professional presentation

> Historical record. Superseded in part by Stage 3.1 (`docs/STAGE-3.1.md`): the public viewing note for Performance 02 was removed, the age display is now off by default, and the "not verified" install, lint and build steps below have since been run and pass.

## Done
- **Mandala Theatre credential** (`TRAINING` in `src/content/site.ts`): "Theatre Training / Mandala Theatre / Certificate holder".
  Hero line `THEATRE TRAINING · MANDALA THEATRE`; dedicated block in About; copy rewritten. Course title, certificate title and
  year are `null` and appear automatically once filled in. No course, year, award or accreditation is claimed.
- **Two-piece Performance section** (`src/components/Performance.tsx`, data in `src/content/performances.ts`): neutral editable
  labels, duration, real poster frames, native proportions (never stretched), no autoplay, `preload="none"`, native controls
  after play starts, one piece plays at a time, error fallback with a link to the file, keyboard-operable Play button.
  Asymmetric two-column layout on tablet and up; stacked on mobile.
- **Videos:** Performance 01 = original Video 1; Performance 02 = the newly supplied upload (same footage as the archived
  Video 2, shown once). Both served byte-for-byte. See `VIDEO-ANALYSIS.md`, `MEDIA-PROCESSING.md`.
- **Contact:** the placeholder row is gone. With no email, a line points to Instagram and Facebook; a real address in
  `CONTACT_EMAIL` adds a mailto row.
- **SEO/sharing:** title, description, Open Graph, Twitter card, theme colour, favicon (SVG + PNG), Apple touch icon, JSON-LD
  Person, 1200x630 share card from p5. Canonical, `og:url` and absolute image URLs are injected from `VITE_SITE_URL`
  (`.env.example`); nothing is invented.
- **Age 25** was shown in About in this stage. Stage 3.1 replaced that with a switch (`SHOW_AGE`, now `false`).

## Decisions kept / not taken
- p10 is **not** in the gallery: you listed it as pending visual and rights approval; faces are small in that frame.
  p3, p9, photo1 stay out; p13 stays out (identity not confirmed).
- The page black stays `#030303` (a faint edge around some photos was noted in Stage 2).
- No video was trimmed or gain-adjusted on the site; proposals are in `media-derived/proposed/`.

## Quality-assurance report
Verified (Chromium, from an esbuild bundle of this source, not the Vite build):
- 1440, 1366, 768, 390 and 360 px: no horizontal overflow, no console errors, no failed requests.
- Both videos play; keyboard Enter on Play works; starting 02 pauses 01; no video request before Play.
- Mobile menu opens/closes; lightbox opens, Escape closes it and returns focus; social links open in a new tab with `noopener`.
- Production bundle contains no dev-tool code (only a stray `#media-review` hash string); dev build keeps the review page.

**Not verified (do these on your machine):**
- `npm install`, `npm run lint`, `npm run build`: the sandbox had no network, so the real Vite build, lint and a full
  TypeScript check were not run. Run them and tell me anything they report.
- Safari/iOS (including `playsInline` and fullscreen), Firefox, real phones, screen readers.
- Screenshots use fallback fonts (Newsreader and Hanken Grotesk could not be installed here): real text widths will differ slightly.
  The share card uses a stand-in serif (re-run `scripts/make-brand-images.py` to change it).
- Audio was never listened to.

## Owner decisions still needed
1. Exact certificate wording (course title, certificate title, year), if you want them shown.
2. Real domain (`VITE_SITE_URL`) and email (`CONTACT_EMAIL`).
3. Usage rights for p5 (hero and share card), p10, p11, p12.
4. Whether to keep Age on the page.
5. Performance 02: keep as is, use the proposed cleaned file, or replace with better footage; which performer is Bishal in it;
   whether to adopt the Performance 01 trim/gain proposal (this also fixes loudness on iPhone).
6. p10 in the gallery or not.

Screenshots: `docs/screenshots/stage3/` (five viewports: hero, performance, about, contact, full page).
