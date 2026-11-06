# Bishal Raj: actor portfolio

A cinematic, art-directed portfolio website for the actor Bishal Raj. React 19, TypeScript, Vite. Design direction: **Concept A, "Single Source"** (one spotlight, near-black stage, photographs first).

**Current status: Stage 5 (casting readiness, accessibility, SEO and launch preparation).** Same approved design, same two unmodified performance videos. Stage 5 made the first screen casting-director friendly (name, "Actor", training, Nepali, and both key actions visible without scrolling on phones), added a central confirmed-only casting profile, a one-page PDF casting profile, a curated gallery, accessibility fixes (axe: 0 violations), SEO plumbing (robots, sitemap, 404, generated structured data) and production configuration.

**Start here:** `docs/stage5/STAGE-5.md` (report), `docs/stage5/OWNER-DECISIONS.md` (what is still needed from the owner) and `docs/stage5/DEPLOYMENT.md` (Windows PowerShell guide). What was **not** tested (Firefox, Safari, Edge, real devices, screen readers) is stated in `docs/stage5/BROWSER-TESTING.md`.

## Windows PowerShell: extract, install, run, build

**The project root is the folder `bishal-raj-portfolio` inside the ZIP** (the one containing `package.json`). Adjust the ZIP path if you saved it somewhere other than Downloads.

### 1. Extract

```powershell
cd $HOME
Expand-Archive -Path "$HOME\Downloads\bishal-raj-portfolio-stage5.zip" -DestinationPath "$HOME\bishal-stage5"
cd "$HOME\bishal-stage5\bishal-raj-portfolio"
dir package.json   # must exist here; this is the project root
```

Earlier stage folders are not touched; keep them as backups.

### 2. Install, check, build, run

```powershell
npm ci
npm run lint
npm run build
npm run dev
```

- `npm run lint` should report 0 warnings and 0 errors.
- `npm run build` should finish with a "built in" line and no errors.
- `npm run dev` prints a local address, normally `http://localhost:5173/`. The website appears immediately. **`http://localhost:5173/#media-review`** opens the development-only media review page (also linked in the footer while developing). It is not part of the production build.

To test on your phone (same Wi-Fi): `npm run dev -- --host`, then open the "Network" address it prints. Windows may ask you to allow access on private networks.

To preview the production build: `npm run build` then `npm run serve:dist` (a dependency-free server that behaves like a plain static host: gzip, video ranges, 404 page, `_headers` applied) and open `http://127.0.0.1:4173/`.

Other commands: `npm run profile:pdf` (rebuild the one-page casting profile), `npm run test:browsers` (Chromium/Firefox/WebKit smoke test; see `docs/stage5/BROWSER-TESTING.md`).

If PowerShell says running scripts is disabled, use `npm.cmd` instead of `npm` (for example `npm.cmd install`), or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once.

### 3. Set the real domain when you have one (canonical link, share previews, sitemap)

Copy `.env.example` to `.env.production` and set `VITE_SITE_URL=https://your-domain` before `npm run build`. Until it is set, the build contains **no canonical URL and no sitemap** (nothing is invented; localhost is never published). `VITE_BASE_PATH` is only for hosts that serve from a sub-folder. Full guide: `docs/stage5/DEPLOYMENT.md`.

### 4. Optional: verify the original video is untouched

```powershell
Get-FileHash ".\media-src\originals\bishal video 1.mp4" -Algorithm SHA256
```

The result must be `ea269907de616cbbd76d872aa20d79e15715cc51d6a3e3dfdc109fc7ebd7f3a9`. Compare it with the same file on your own machine as well.

## Where things are

```
media-src/originals/       All original files, untouched (never served directly; the two video copies in public/ are byte-identical)
media-derived/proposed/    Proposed videos and poster candidates, NOT used by the site (awaiting your approval; see docs/VIDEO-COMPARISON.md)
public/media/              Processed images the site serves (untouched JPEGs + some AVIFs)
public/media/video/        Both performance videos, byte-for-byte copies of originals:
                           bishal-video-1.mp4 = "bishal video 1.mp4" (Performance 01)
                           bishal-video-2.mp4 = "bishal video 2 - resubmitted upload.mp4" (Performance 02)
public/media/posters/      Poster frames taken from the videos
src/components/            Header, MobileMenu, Hero, About, Performance, Gallery, Lightbox, Contact, Reveal
src/content/gallery.ts     Which photographs appear in the gallery, in order, and their row (justified two-row layout)
src/content/profile.ts     THE CASTING PROFILE: confirmed facts, optional fields (empty), credits (empty). Shown only when confirmed
src/content/press-kit.ts   The downloadable casting-profile PDF link (set file to null to hide)
src/static/404.html        Branded 404 page (copied into the build by vite.config.ts)
public/_headers            Security + caching headers for Netlify / Cloudflare Pages
public/Bishal-Raj-Actor-Profile.pdf   One-page casting profile (built by npm run profile:pdf)
src/hooks/                 useMediaQuery, useActiveSection
src/content/site.ts        All copy, centralized CONTACT_CONFIG (email, WhatsApp, phone, socials), TRAINING, hero facts
src/content/performances.ts  The two performance pieces: neutral labels, factual notes, files, posters, durations
src/content/media.ts       Image manifest: alt text, section assignment, notes
src/content/media.generated.ts   Written by scripts/optimize-media.mjs (do not edit)
src/styles/tokens.css      Colours, type scale, spacing, motion (change the look here)
src/styles/global.css      Base styles, focus rings, reduced-motion safety net
src/components/Picture.tsx Renders photos uncropped, never wider than native size
src/dev/                   Development-only media review page (not in production build)
scripts/optimize-media.mjs Optional image optimiser (needs `npm install --no-save sharp`)
docs/                      Stage 1-4 notes, MEDIA-CHECKSUMS.txt, and docs/stage5/ (report, audits, measurements, screenshots)
```

## Content rules

Nothing on this site is invented. There are no credits, awards, representation or testimonials. The only training shown is what the owner confirmed: Mandala Theatre, certificate holder. Age is hidden by default (the `age` entry in `src/content/profile.ts` has `confirmed: false`). All contact details (email, WhatsApp, Instagram, Facebook) are confirmed and live in `CONTACT_CONFIG` in `src/content/site.ts`.

- **Both performance videos are published**, each exactly as supplied. The archived duplicate `bishal video 2.mp4` is kept only as an original and is not shown a second time.
- Proposed edited versions live in `media-derived/proposed/` and are **never published automatically**.
- Images excluded: p9, p13 and photo1. Optional and not shown: p10 and p3. The gallery shows five stage photographs (p4 stays the phone hero and is no longer repeated in the gallery).
- **Casting facts** (height, playing age, hair, eyes, location, skills, representation, credits) exist as empty optional fields in `src/content/profile.ts`. A fact appears only when its value is filled in **and** `confirmed` is true. See `docs/stage5/CASTING-PROFILE.md`.
- **Subtitles are not published**: accurate Nepali captions need a verified transcript (`docs/stage5/SUBTITLES.md`).
- Technical notes about the footage (sideways clip, dark stretch, loudness) are internal: they are in `docs/`, not on the public page.

## Before publishing publicly

Full list with reasons: `docs/stage5/OWNER-DECISIONS.md`. The essentials:

1. Confirm usage rights and photographer credit for p11 and p12 (both shown in the gallery) and p10.
2. Review the casting-profile PDF word for word (or remove it).
3. Decide what "Nepali actor", "emerging" and "early in his career" should say (only the *language* is confirmed).
4. Tell us which performer is Bishal in Performance 02, and whether either clip has dialogue (captions).
5. Choose and set the domain (`VITE_SITE_URL`), deploy, then run the real-device checklist in `docs/stage5/BROWSER-TESTING.md`.
