# Stage 1: foundation and media preparation

> Historical record. Video 2 was held back at this stage; it is now published as Performance 02 (both videos are included as of Stage 3). Current status: `docs/STAGE-3.1.md`.

## What this stage delivers

- Design tokens for Concept A (colour, type scale, spacing, motion) and global base styles.
- Self-hosted fonts: Newsreader (variable, optical-size axis, roman only) and Hanken Grotesk (variable).
- A typed media manifest (`src/content/media.ts`) with alt text and section assignments, and the `Picture` component that renders photographs uncropped and never wider than native size.
- Processed images in `public/media/`, your 15 untouched originals in `media-src/originals/`, checksums, and `docs/MEDIA-PROCESSING.md`.
- A development-only **media review page** at `#media-review`.
- A placeholder public page (name and role only). The real header and hero are Stage 2.

## Files

**New:** `src/styles/tokens.css`, `src/styles/global.css`, `src/content/site.ts`, `src/content/media.ts`, `src/content/media.generated.ts` (generated), `src/components/Picture.tsx`, `src/lib/contrast.ts`, `src/dev/MediaReview.tsx`, `src/dev/MediaReview.module.css`, `src/App.module.css`, `scripts/optimize-media.mjs`, `public/media/*` (22 files), `media-src/originals/*` (15 files), `docs/*`.

**Changed:** `package.json` (two dependencies added), `package-lock.json`, `index.html` (title, description, theme colour), `src/main.tsx`, `src/App.tsx`, `public/favicon.svg` (placeholder ring; final favicon in Stage 5), `README.md`.

**Removed (starter files):** `src/App.css`, `src/index.css`, `src/assets/*`, `public/icons.svg`.

**Unchanged from the Vite starter:** `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `.oxlintrc.json`, `.gitignore`, and the npm scripts.

## New dependencies (runtime only)

| Package | Why it is needed |
|---|---|
| `@fontsource-variable/newsreader` | Self-hosts the display serif, so there are no requests to Google and no layout shift from a late font |
| `@fontsource-variable/hanken-grotesk` | Self-hosts the interface sans-serif |

`sharp` is **not** a dependency. It is only needed to re-run the optional image script, with `npm install --no-save sharp`.

## What I verified (in my sandbox: Linux, Node 22.22.2)

- `npm run lint`: 0 warnings, 0 errors. `npm run build` (TypeScript 7.0.2 then Vite 8.3.5): passes.
- The development review page is absent from the production bundle.
- The review page and the `Picture` component render without errors (server-side render test), the manifest references only files that exist, and all JPEGs in `public/media/` are byte-identical to the originals.
- A clean extraction of this ZIP installs and builds.
- Colour contrast figures on the review page were checked against an independent calculation.

## What I could NOT verify

- **Anything in a real browser.** I have no browser here, so layout, image edges, fonts actually rendering, and touch behaviour are unseen by me. That is what your review is for.
- **Windows.** The lockfile includes the Windows binaries, but I have not run it on Windows.
- I cannot hear audio, so nothing in this stage involves a listening judgement.

## Your test checklist

1. **Install and run** with the commands in `README.md`. Lint reports 0 warnings and 0 errors, the build succeeds, the dev server starts.
2. **`http://localhost:5173/`** shows BISHAL RAJ in a light, uppercase serif, ACTOR in small tracked sans-serif, a short bronze line, and the dev link.
3. **Fonts really loaded:** DevTools, Network tab, filter "Font": you should see `newsreader-latin-opsz-normal` and `hanken-grotesk-latin-wght-normal` as `.woff2`, and the headline should not look like a default Times or Georgia.
4. **`#media-review`, photographs:**
   - All 10 appear, none stretched or cropped, and "Shown at" never says UPSCALED.
   - Switch **Render images as** between AVIF and Original JPEG. Look at the dark floor gradients (kneelWide, kneelClose), skin tones (portraitIntense) and the warm colours (stageEnsemble). Tell me if anything looks different, and which image.
   - Only four images have an AVIF (kneelWide, kneelClose, portraitIntense, stageEnsemble). The other six always show the original JPEG.
   - Look at the right edge of kneelFar and kneelClose for a thin green line.
5. **Page black:** step through the four options and watch the top and side edges of stagePoint, stageStill, stageShout and portraitIntense. Choose the one where those edges disappear without the page feeling dead. Turn the hairline on and off.
6. **Colour:** judge the bronze `#b08051` against the bone text, and the cobalt `#4a6fa5`. Contrast ratios are shown live.
7. **Type:** the specimen shows the name at its largest size (72 px) and three weights.
8. **Small screens:** narrow the window to about 390 px, and open it on your phone. There should be no sideways scrolling and every control should be easy to tap.
9. **Keyboard:** Tab through the controls. A cobalt focus ring should always be visible, and the radio groups should work with the arrow keys.
10. **Checksum:** run the `Get-FileHash` command in `README.md` and compare.

## Decisions I need from you

1. **Page black** (`#000000`, `#030303`, `#050505`, `#0a0908`). Current token: `#030303`.
2. **Bronze accent** `#b08051`: keep, warm it, or mute it further.
3. **Hairline around photographs:** keep photographs frameless, or add a hairline?
4. **p10 (ensemble) and p3 (contact backdrop)** stay optional. They remain in the manifest, and you judge them in Stages 4 and 5.

## Known limitations

- The public page is a placeholder by design.
- The contact email is `null`; nothing is faked.
- The favicon is a temporary placeholder ring.
- No Devanagari. The spelling is unconfirmed, so only the English name is used.
- Newsreader's Latin file is about 132 KB. That is the cost of its optical-size axis, which gives the display type its finer drawing at large sizes.
- Edge colours on the review page are sampled in your browser, so they reflect your browser's colour handling.

## Corrections made along the way

- photo2's highlight is not clipped (brightest face luminance 228 of 255), so there is no retouch.
- My first AVIF fidelity check measured luminance only and was too lenient on colour; it was replaced with per-channel RGB scoring plus an independent ffmpeg cross-check. As a result p11 and p12 ship as your untouched JPEGs.
- Video 1 audio figures I gave earlier (+7.2 dBFS peak, 5,482 samples over full scale, loud passage near 65 s) were wrong because of a mono downmix. See `docs/MEDIA-PROCESSING.md` for the corrected per-channel numbers.
