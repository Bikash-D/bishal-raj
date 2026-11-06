# Stage 2: the complete portfolio site

> Historical record. Later stages changed some of this: Performance now has two videos (Stage 3), and the age display is a switch (`SHOW_AGE`, Stage 3.1). Current status: `docs/STAGE-3.1.md`.

## Implemented
- **Header:** transparent over the hero, solid with a hairline after scrolling; name appears once the hero is passed; active-section underline. Under 800px: a full-screen menu (focus trap, Escape, scroll lock, focus returns to the button).
- **Hero:** 900px and wider uses p5 (`kneelWide`) flush right at its native proportions, name lower-left. Under 900px uses p4 (`kneelClose`, as planned in Stage 1) with the name set in its empty black head-room. Never cropped, stretched or upscaled. Scroll cue is a line that draws once.
- **About:** photo2 with honest copy; Language, Background and Open to are the only facts shown.
- **Performance:** Video 1 at `public/media/video/bishal-video-1.mp4`, SHA-256 identical to the original. Native controls plus a Play button; nothing autoplays; error fallback.
- **Gallery:** six plates (p11, p6, p12, p7, p8, p4) in an asymmetric 12-column spread at their own proportions, no filters. Lightbox: open, previous/next (wraps), Close, Escape, arrows, Home/End, counter, swipe, focus trap, focus returns to the plate, scroll lock, never enlarged past native pixels.
- **Contact:** Instagram and Facebook links; email shown as a marked placeholder (`CONTACT_EMAIL` is `null`).
- **Motion:** gentle one-time reveals and hero entrance; honours prefers-reduced-motion.
- Media review page kept for development, absent from the production bundle (verified).

## Tested (Chromium via Playwright, Linux)
Desktop 1440x900, laptop 1280x720, tablet 768x1024, mobile 390x844: no horizontal overflow, no console errors. Lightbox, keyboard, swipe, mobile menu, video playback, reduced motion and font loading were exercised. Screenshots are in `docs/screenshots/`. Not tested: Windows, Safari, Firefox, a physical phone, screen readers.

## Decisions I made that you can reverse
1. **Playback volume 50%.** Stage 1 measured Video 1 peaking above full scale. The file is untouched; only the player starts at 50% (`START_VOLUME` in `Performance.tsx`; set to 1 to disable). Mobile Safari ignores it.
2. **p5 and photo2 are not repeated in the gallery** (already shown full size in hero and About). p4 is hidden from the gallery on small screens, where it is the hero. To add them back, see the note in `src/content/gallery.ts`.
3. **Age is not displayed**, and no location is claimed.
4. **Hero line** is your sentence unchanged.

## Not done / needs you
- **Email address** (placeholder only).
- **p10, p3, p13:** held back as instructed.
- **Photographer credit / usage rights** for p10, p11, p12 are unconfirmed.
- **No captions or transcript** for Video 1; no poster image (the first frame shows).
- **Video 1's last ~4 seconds** (per Stage 1 analysis) is a silent montage of stills, including a frame matching excluded p13. Untouched as instructed; trimming is a Stage 3 decision.
- **Page black vs photo black:** photographs have pure-black edges while the page is #030303, so a faint darker rectangle is visible around several photos (p11, p6, p7). I did not blend or correct anything. Option: switch the token to #000000 (`--c-stage` in tokens.css), or tell me which you prefer.
- Favicon, social-share image and final metadata are still placeholders.
