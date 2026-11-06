# Stage 5 · Part 1 — Audit of the Stage 4 project (before any change)

Method: read every source file, config and doc; built Stage 4 unmodified; measured it (Lighthouse 13.6, axe-core 4.14, Playwright/Chromium 153); looked at screenshots at 1440, 1366, 768, 430, 390 and 360 px. Baseline measurements: `docs/stage5/measurements/baseline/`.

## What is already excellent (left untouched)

- The visual identity: near-black stage, ivory type, restrained bronze, Newsreader/Hanken, uncropped cinematic photographs.
- Media discipline: originals and both videos are byte-identical to the recorded checksums; AVIF is shipped only where it passed a fidelity test, otherwise the original JPEG is served.
- Hero entrance, scroll reveals, reduced-motion safety net, skip link, focus-visible ring, lightbox keyboard model, `preload="none"` on both videos, CLS 0.
- Contact data is centralised and correct (`mailto:`, `wa.me/9779864838906` with encoded message, both social URLs).
- Build hygiene: `npm ci`, lint (0 issues) and build all pass; bundle 256 KB JS (80 KB gzip), no extra runtime dependencies.

## Measured baseline (Stage 4 build, served locally, Lighthouse default throttling)

| | Mobile | Desktop |
|---|---|---|
| Performance | 92 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 92 | 92 |
| LCP / TBT / CLS | 0.8 s / 360 ms / 0 | 0.2 s / 0 ms / 0 |

axe-core (WCAG 2.2 AA + best practice), page + lightbox + mobile menu states: **`label-content-name-mismatch` ×10–11, `region` ×1, `color-contrast` ×1 (lightbox hint), 2 videos without a caption track, `aria-label` on a role-less `div`**. Lighthouse reports 100 because it does not run most of these.

## Problems found

### Would affect casting directors
1. **On phones the hero's two key actions are below the fold** (390×844, 430×932, 360×740, and 768×1024): the first screen shows name, photo and half a sentence, but no "View performances" / "Contact". This contradicts the brief's most important goal.
2. **The email address breaks mid-word** in the main contact card at 1440 px (`thebishalraj@gmail.c` / `om`). It is the single most important string on the site.
3. **The hero's training line is 11 px caps in dimmed grey**, and the performing language ("Nepali") is not on the first screen except inside a sentence.
4. **Unverified claims in code.** `src/content/site.ts` contains `CASTING_PROFILE` and `PRESS_KIT_CONFIG` (unused by the UI, but present) with values nobody confirmed: *"Available for domestic & international production travel"*, *"Independent / Direct Contact"* representation, *base location Nepal*. These must not ship in the data layer.
5. **Performance 02's poster is a wide stage shot where Bishal cannot be identified** (Stage 3 analysis: "which performer is Bishal in Video 2 cannot be determined"). Nothing on the page says who he is in that clip.
6. The gallery has **large dead areas** on desktop (plate 03 sits in a void), and its last plate repeats the hero pose (p4 is the mobile hero; p5/p4 are the same session and pose).

### Would affect mobile users
7. Hero seams: photo edges are visibly lighter than the page at 768 px and in the top strip on phones.
8. Copy buttons are ~28 px tall (below the 44 px touch target used elsewhere).
9. Floating WhatsApp button sits on top of the WhatsApp contact card in the Contact section (duplicate action, covers content).
10. `html { overflow: hidden }` while the lightbox is open removes the scrollbar and shifts the desktop layout.

### Would affect accessibility
11. 10–11 controls whose accessible name does not contain their visible text (WCAG 2.5.3): hero "Explore", both "Play footage" buttons, social links, menu contact links.
12. Floating-actions wrapper: `aria-label` on a `div` with no role (prohibited ARIA), and not inside a landmark.
13. Lightbox keyboard hint fails contrast (opacity 0.7 on ash).
14. Videos have no caption track and the video `aria-label` is a long sentence including the poster description.
15. Dialogs trap focus in JS but the page behind them is not `inert`, so touch screen readers can still reach it.

### Would affect search visibility / sharing
16. **No `robots.txt`** (the SPA answers `/robots.txt` with HTML: Lighthouse "63 errors"), **no sitemap, no custom 404** (a wrong URL shows a blank page).
17. Client-rendered page with an empty `<noscript>`; crawlers and link scrapers that do not run JavaScript see only the `<title>`.
18. Metadata says "Nepali actor" (nationality-ambiguous). Only language was confirmed.
19. Share card is good, but is typeset in a stand-in serif, not Newsreader.

### Would affect performance
20. `Header` re-renders React on every scroll frame (progress bar stored in state). TBT 360 ms on throttled mobile is mostly React boot, but this adds avoidable work during scroll.
21. Both video posters are fetched eagerly at load (Lighthouse image-delivery insight lists them), competing with the LCP image.
22. The LCP image is only discovered after the JS bundle runs; there is no preload.
23. Render-blocking CSS ~158 ms (inherent to a single small stylesheet; acceptable).

### Remaining before deployment
24. No `_headers`/security headers, no 404, no robots/sitemap, `base` path not configurable, the ZIP carried a 100 MB Windows `node_modules` and a leftover Edge profile folder (`.tmp-browser-9223`).
25. Owner inputs still missing: domain, rights/credit for p10–p12, confirmed CV/credits, which performer is Bishal in Performance 02, any dialogue transcript for subtitles.

---

## Resolution status (added at the end of Stage 5)

| # | Problem | Status |
|---|---|---|
| 1 | Hero actions below the fold on phones | **Fixed**, verified at 7 viewports |
| 2 | Email broke mid-word | **Fixed**, verified one line at 7 viewports |
| 3 | Training/language not prominent on first screen | **Fixed** (confirmed facts under the name, sentence case, ≥ 14:1 contrast) |
| 4 | Unverified claims in `site.ts` | **Removed**; central `profile.ts` shows only confirmed facts |
| 5 | Performance 02 poster / identity | **Open: owner input** (OWNER-DECISIONS.md); optional caption field built |
| 6 | Gallery voids, repeated pose | **Fixed** (justified rows, 5 curated plates) |
| 7 | Hero edge seams | **Fixed in CSS** (files untouched) |
| 8 | Copy buttons < 44 px | **Fixed** |
| 9 | Floating WhatsApp over contact card | **Fixed** (steps aside) |
| 10 | Scrollbar shift with lightbox | **Fixed** |
| 11 | Label-in-name mismatches | **Fixed** (axe: 0) |
| 12 | `aria-label` on role-less div; no landmark | **Fixed** (`aside`) |
| 13 | Lightbox hint contrast | **Fixed** |
| 14 | Video names; no caption track | Names **fixed**; captions **open** (SUBTITLES.md) |
| 15 | Page behind dialogs not inert | **Fixed** |
| 16 | robots.txt / sitemap / 404 | **Fixed** (sitemap only when a domain is set) |
| 17 | Empty `<noscript>` | **Fixed** (contact + facts) |
| 18 | "Nepali actor" in metadata | **Fixed in metadata**; visible copy is an owner decision |
| 19 | Share image font | **Fixed** (real Newsreader) |
| 20 | Header re-render per scroll frame | **Fixed** |
| 21 | Posters fetched eagerly | **Fixed** (lazy; −70 KiB at load) |
| 22 | LCP image not preloaded | **Fixed** (media-conditioned preload, fetched once) |
| 23 | Render-blocking CSS | Unchanged (inherent, ~100 ms) |
| 24 | Headers / 404 / base path / ZIP hygiene | **Fixed** (`_headers`, `VITE_BASE_PATH`, ZIP excludes `node_modules`, `.tmp-*`) |
| 25 | Missing owner inputs | **Open**: see OWNER-DECISIONS.md |
