# Stage 5: technical report

Casting readiness, accessibility, SEO and launch preparation. Built on the approved Stage 4 project; **not a rebuild**. The design identity (near-black `#030303`, ivory type, bronze `#b08051`, Newsreader / Hanken Grotesk, uncropped cinematic photography, editorial asymmetry) is unchanged. No new dependencies; no custom cursor, parallax, loader or scroll-jacking added.

Index of Stage 5 documents (all in `docs/stage5/`):
`01-AUDIT-STAGE-4.md` · `CASTING-PROFILE.md` · `PRESS-KIT-STATUS.md` · `MEDIA-AUDIT.md` · `SEO-AUDIT.md` · `ACCESSIBILITY-AUDIT.md` · `LIGHTHOUSE.md` · `BROWSER-TESTING.md` · `SUBTITLES.md` · `DEPLOYMENT.md` · `OWNER-DECISIONS.md` · `measurements/` · `screenshots/`

## Honest status summary

| Area | Status |
|---|---|
| Casting-director first screen | **Done and verified** |
| Central casting profile + confirmed-only display | **Done** |
| Press kit foundation | **Done as a 1-page PDF**; owner review pending. No CV (none exists) |
| Performance section | Done (lazy posters, names, error recovery, caption hook). **Subtitles not shipped** (cannot be done accurately) |
| Gallery curation + layout | **Done** |
| Contact / conversion | **Done** (email wrap bug fixed, 44 px targets, copy fallback). Cannot verify that WhatsApp/mail *apps* open: only the link targets |
| SEO / sharing | **Done**; indexing/share previews **unverifiable until a domain exists** |
| Performance / Core Web Vitals | LCP/CLS unchanged and good; load bytes −64 KiB; **simulated TBT slightly worse** (see LIGHTHOUSE.md) |
| Accessibility | axe **0 violations** in 5 states; **captions open**; **no real screen-reader test** |
| Browsers | **Chromium only** (desktop + phone emulation). **Firefox, Safari/WebKit, Edge, real device: NOT tested** |
| Production prep | **Done** (clean `npm ci` → lint → build; headers, 404, robots, sitemap, base path, guide) |

## What changed, by brief section

**§3 Casting-director first screen.** Hero now shows, without scrolling at every width tested (360–1440, including 375×667): name, "Actor", **"Mandala Theatre certificate"**, **"Performs in Nepali"**, and two actions: **View performances** and **Contact Bishal** (secondary action has real contrast). On phones the actions sit directly under the photograph (grid reorder; DOM order unchanged); the sentence follows. Photo/edge seams removed in CSS only.

**§4 Casting information system.** `src/content/profile.ts` is the single source: confirmed facts shown, optional fields (height, playing age, hair, eyes, based-in, languages, accents, skills, representation) and `CREDITS` present but empty and invisible. The unused `CASTING_PROFILE`/`PRESS_KIT_CONFIG` in `site.ts` (which contained unconfirmed "international travel", "Independent", "Nepal") were **deleted**. About renders from the profile.

**§5 Press kit.** `npm run profile:pdf` builds a one-page PDF from the same data using the site's fonts; linked once from Contact.

**§6 Performance.** Posters attach only near the viewport; accessible names shortened with poster text in `aria-describedby`; failure state has "Try again"/"Open file"; `captions` and `performerNote` fields ready. Videos untouched (byte-identical, verified).

**§7 Photography.** Gallery: justified two-row spread, 5 plates (p4 removed from the gallery as a repeat of the hero), no cropping, no upscaling. Files untouched (verified).

**§8 Interaction.** No animations added. Dialogs render in a portal with the page `inert`; focus returns correctly; scrollbar-gutter stops layout shift; contact cards no longer "lift" (they aren't links); floating WhatsApp steps aside in Contact; scroll progress no longer re-renders React per frame.

**§9 Contact.** Two full-width rows (email and WhatsApp), each with a Send/Chat action and a Copy button (clipboard API with select-and-copy fallback, announced via `role=status`); social + PDF rows with labels always present. Details verified unchanged: `thebishalraj@gmail.com`, `+977 986-4838906`, `https://wa.me/9779864838906?text=…`, `@biishal.rajjj`, `bishalrajjj`. No form.

**§10 SEO.** See SEO-AUDIT.md. **§11 Performance.** See LIGHTHOUSE.md. **§12 Accessibility.** See ACCESSIBILITY-AUDIT.md. **§13 Browsers.** See BROWSER-TESTING.md. **§14 Deployment.** See DEPLOYMENT.md.

## Production build results (clean copy of the final tree)

Fresh copy → `npm ci` → `npm run lint` → `npm run build` (log: `measurements/after/build-log.txt`):

```
node v22.23.4 / npm 10.9.9
npm ci        added 33 packages … found 0 vulnerabilities
npm run lint  Found 0 warnings and 0 errors (39 files, 116 rules)
npm run build ✓ built in ~440 ms   (tsc -b passes)
  dist/index.html 4.72 kB (gzip 1.68) · assets/index-*.css 40.99 kB (gzip 8.19) · assets/index-*.js 261.11 kB (gzip 81.14)
  + robots.txt, 404.html, _headers (public/), fonts (self-hosted woff2)
```

Also verified: build with `VITE_SITE_URL` set (canonical, `og:url`, absolute images, `sitemap.xml`, `Sitemap:` line, JSON-LD `url`/`image`; **no `localhost` anywhere**); build with `VITE_BASE_PATH=/portfolio/` (all asset, preload and 404 links prefixed). The default build (no env) emits **no canonical and no sitemap**: nothing invented. The built `dist` was copied to an unrelated folder and served by the dependency-free `scripts/serve-dist.mjs`; all automated checks passed there.

Build-configuration changes: `base` from `VITE_BASE_PATH`; `assetsInlineLimit: 0` (found by testing: Vite inlined one 1.7 KB font as a `data:` URI, which the strict CSP blocks).

## Verification performed (final clean build, Chromium 153)

| Check | Result |
|---|---|
| Hero actions inside first screen, ≥ 44 px, no overflow, email one line, no console errors: 1440, 1366, 768, 430, 390, 360, 375×667 | 0 failures |
| Functional suite (HTTP types, 404, CSP header, lazy video/poster loading, hero preloaded once, link targets, clipboard, floating action, lightbox keyboard/focus/inert, both videos play, touch menu, reduced motion, 404 content) | 0 failures |
| axe-core, 5 states | 0 violations |
| Lighthouse mobile / desktop | see LIGHTHOUSE.md |
| Media integrity (SHA-256 vs untouched upload) | 0 changed, 0 removed; both videos identical |
| `scripts/cross-browser.mjs` on Chromium (desktop + iPhone 14 profile) | 15/15 |

**Bugs found by my own testing during Stage 5 and fixed:** strict CSP blocking an inlined font; focus not returning to the Menu button after the `inert` change; a 24 px touch target on the contact address; a vignette-box effect from my first seam fix; button indent from `justify-self` in block layout; and an apples-to-oranges byte comparison (test server without gzip) that I caught before reporting it. I also caught that my first Lighthouse baseline was noise (see LIGHTHOUSE.md).

## Not done / limitations

* Firefox, Safari/WebKit, Edge, a real device, real screen readers: **not tested** (see BROWSER-TESTING.md for the script and checklist).
* Subtitles: not produced (SUBTITLES.md).
* No deployment, no domain, no live-host verification of headers, indexing or share previews.
* PDF not reviewed by the owner; `profile:pdf` not run on Windows.
* Lab Lighthouse only; no field data. INP not measurable here.
* Stage 4's own documentation claims (e.g. its Chrome/Edge results) were not re-verified.
* `scripts/optimize-media.mjs` and the media pipeline were not re-run: image files are exactly Stage 4's.

## Files added or changed

Added: `src/content/profile.ts`, `src/content/press-kit.ts`, `src/static/404.html`, `src/hooks/useModalBackdrop.ts`, `public/_headers`, `public/Bishal-Raj-Actor-Profile.pdf`, `scripts/serve-dist.mjs`, `scripts/build-profile-pdf.mjs`, `scripts/build-og-image.mjs`, `scripts/cross-browser.mjs`, `media-derived/previous/og-image-stage4.jpg`, `docs/stage5/**`.
Changed: `vite.config.ts` (site HTML plugin, base path), `index.html`, `.env.example`, `package.json` (scripts only), `src/content/site.ts`, `src/content/gallery.ts`, `src/content/performances.ts`, `src/components/{Hero,About,Performance,Gallery,Lightbox,MobileMenu,Contact,Header,FloatingActions}.tsx` and their CSS, `src/styles/global.css`, `public/og-image.jpg` (regenerated derived asset), `README.md`, `scripts/create-delivery-zip.py`, `scripts/make-brand-images.py` (header note).
Not touched: every file in `media-src/`, `public/media/`, `media-derived/proposed/`, and all Stage 1–4 docs.
