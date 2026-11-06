# Stage 4: Interactive Cinematic Actor Portfolio
## Bishal Raj — Premium Design, Motion, Contact & UX Upgrade

**Status:** Completed & Verified  
**Date:** 5 November 2026  
**Design Direction:** Concept A, "Single Source" (Cinematic + Editorial + Modern + Interactive + Premium)

---

## 1. Executive Summary

Stage 4 elevates the Bishal Raj actor portfolio into an interactive, cinematic digital experience tailored for casting directors, filmmakers, production houses, theatre directors, and international collaborators.

All original media, aspect ratios, and checksums remain untouched. No artificial statistics, generic templates, or unconfirmed credentials have been introduced. The visual identity remains rooted in theatrical editorial design: near-black stage backdrop (`#030303`), warm ivory typography (`--c-bone: #ece6da`), restrained bronze accents (`--c-bronze: #b08051`), Newsreader editorial display font, and Hanken Grotesk supporting font.

---

## 2. Centralized Contact Configuration

Public contact details have been explicitly confirmed and centralized in [`src/content/site.ts`](file:///c:/Users/Hp/Downloads/bishal-raj-portfolio%20stage%203.5/src/content/site.ts):

| Parameter | Value | Details |
|---|---|---|
| **Professional Email** | `thebishalraj@gmail.com` | Formatted as `mailto:thebishalraj@gmail.com?subject=Professional%20Enquiry%20%E2%80%94%20Bishal%20Raj` |
| **Prefilled Email Subject** | `Professional Enquiry — Bishal Raj` | Included automatically in email clients |
| **Display Phone / WhatsApp** | `+977 986-4838906` | International E.164 format for Nepal |
| **WhatsApp Direct URL** | `https://wa.me/9779864838906` | Configured with prefilled message |
| **Prefilled WhatsApp Message** | `Hello Bishal, I visited your portfolio and would like to discuss a professional opportunity.` | Properly URL-encoded |
| **Instagram** | `https://www.instagram.com/biishal.rajjj/` | Handle: `@biishal.rajjj` |
| **Facebook** | `https://www.facebook.com/bishalrajjj` | Handle: `bishalrajjj` |

### Structured Data (SEO)
`index.html` Person JSON-LD schema has been updated with confirmed contact details:
- `"email": "mailto:thebishalraj@gmail.com"`
- `"telephone": "+977-986-4838906"`
- `"alumniOf": { "@type": "Organization", "name": "Mandala Theatre" }`
- `"knowsLanguage": "ne"`

---

## 3. Implemented Interactive & Motion Features

### A. Hero Section Upgrade
- **Staggered Page Entrance:** Theatrical entrance timing across the portrait frame, actor name, role line, training credential, lead introduction, call-to-action buttons, and scroll cue.
- **Hero Calls to Action:**
  - `VIEW PERFORMANCES`: Direct anchor navigation to `#performance` with restrained bronze fill and ivory text.
  - `GET IN TOUCH`: Direct anchor navigation to `#contact` with subtle editorial border and ash-to-bone hover transition.
- **Interactive Scroll Cue:** Elegant vertical line that draws once and rests, guiding visitors to the biography.
- **Mobile Balance:** Under-name composition preserves dark headroom on small screens without pushing copy off the viewport.

### B. Motion Design System & Reveal Component
- Upgraded `Reveal` component supporting `rise`, `fade`, and `scale` animation variants with custom cubic-bezier timing (`--ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1)`).
- Full compliance with `prefers-reduced-motion: reduce`: all transitions collapse instantly with zero lag.
- IntersectionObserver triggers once per element and cleanly disconnects.

### C. Top Scroll Progress Indicator
- Slim, restrained 2px progress bar pinned at the top of the viewport in `--c-bronze`.
- Uses `scaleX` GPU-accelerated transforms linked to scroll progress via `requestAnimationFrame` for 60fps performance without layout thrashing.

### D. Performance Section Immersion
- Both performance videos (`bishal-video-1.mp4` and `bishal-video-2.mp4`) are preserved unmodified at native resolutions (576x928 and 576x1024).
- Single playback enforcement: playing one video automatically pauses the other.
- Cinematic play overlay: large circular play mark with bronze illumination on hover, duration badge, and spoken duration for screen readers.
- Native browser controls activate seamlessly as soon as playback begins.
- Direct fallback link if browser video streaming fails.

### E. Gallery & Lightbox Interactions
- 12-column asymmetrical editorial spread preserved.
- Subtle plate zoom (`scale(1.025)`) and bronze index label transition on hover.
- Fullscreen Lightbox:
  - Tactile Previous and Next navigation buttons.
  - Keyboard navigation: `ArrowLeft`, `ArrowRight`, `Home`, `End`, and `Escape`.
  - Touch swipe detection for mobile screens.
  - Focus trap inside viewer; automatically restores focus to the triggering plate on close.
  - Automatic prewarming of adjacent image cache for instant navigation.

### F. Redesigned Contact Section
- Transformed from a basic list into a dual-card direct communication suite:
  - **Email Action Card:** Prominent display of `thebishalraj@gmail.com`, direct "Send Email" action, and one-click "Copy" button with visual checkmark feedback.
  - **WhatsApp Action Card:** Prominent display of `+977 986-4838906`, direct "Chat on WhatsApp" action, and one-click "Copy" button.
- Secondary online profiles list for Instagram and Facebook with outward link arrows.
- Semantic footer with copyright, back-to-top shortcut, and development-only media review link.

### G. Discreet Floating Quick Actions
- **Floating WhatsApp Button:** Appears unobtrusively in the bottom-right corner after scrolling past the hero. Features recognizable WhatsApp SVG icon, accessible tooltip on desktop, and safe-area-inset padding on mobile.
- **Back-to-Top Button:** Appears after scrolling deeper into the page; smoothly returns the visitor to the top.
- Positioned so it never obstructs video controls, gallery buttons, or modal dialogs.

### H. Mobile Navigation
- Full-screen modal menu with smooth entrance and exit animations.
- Includes primary navigation links, direct one-tap Email and WhatsApp shortcuts, and social links.
- Focus-trapped and closes on `Escape` or resize to desktop.

---

## 4. Quality Assurance & Verification Results

### Media Integrity Check
```powershell
Get-FileHash '.\public\media\video\bishal-video-1.mp4', '.\public\media\video\bishal-video-2.mp4' -Algorithm SHA256
```
| File | SHA-256 Checksum | Result |
|---|---|---|
| `public/media/video/bishal-video-1.mp4` | `ea269907de616cbbd76d872aa20d79e15715cc51d6a3e3dfdc109fc7ebd7f3a9` | **MATCH (Byte-for-byte original)** |
| `public/media/video/bishal-video-2.mp4` | `f164d38c8ff3e53f81e78fb5f745038ed2aef308881a339242842aff78382d2e` | **MATCH (Byte-for-byte original)** |

### Automated Browser Testing Suites
Automated end-to-end testing was executed via Chrome DevTools Protocol (CDP) on the production build (`http://127.0.0.1:5179`):

| Test Item | Google Chrome 156 | Microsoft Edge 156 | Verdict |
|---|---|---|---|
| `npm run lint` (`oxlint`) | 0 warnings, 0 errors | 0 warnings, 0 errors | **PASSED** |
| `npm run build` (`tsc -b && vite build`) | Built cleanly in ~450ms | Built cleanly in ~450ms | **PASSED** |
| Horizontal Overflow (1440px Desktop) | 0px overflow | 0px overflow | **PASSED** |
| Horizontal Overflow (1024px Laptop) | 0px overflow | 0px overflow | **PASSED** |
| Horizontal Overflow (768px Tablet) | 0px overflow | 0px overflow | **PASSED** |
| Horizontal Overflow (430px Mobile Max) | 0px overflow | 0px overflow | **PASSED** |
| Horizontal Overflow (390px Mobile Standard) | 0px overflow | 0px overflow | **PASSED** |
| Horizontal Overflow (360px Mobile Compact) | 0px overflow | 0px overflow | **PASSED** |
| Console Errors | 0 | 0 | **PASSED** |
| Broken Network Requests (4xx/5xx) | 0 | 0 | **PASSED** |
| Video Playback & Controls Activation | Verified | Verified | **PASSED** |
| Lightbox Open, Next/Prev, Escape Close | Verified | Verified | **PASSED** |
| Mobile Menu Open, Escape Close, Links | Verified | Verified | **PASSED** |
| Mailto & WhatsApp Links with Prefilled Query | Verified | Verified | **PASSED** |

### Screenshots Captured
Screenshots generated from production build are saved in [`docs/screenshots/stage4/`](file:///c:/Users/Hp/Downloads/bishal-raj-portfolio%20stage%203.5/docs/screenshots/stage4/):
- `desktop-hero.jpg` (1440x900 viewport)
- `desktop-full-page.jpg` (Complete desktop scroll)
- `tablet-hero.jpg` (768x1024 tablet viewport)
- `tablet-full-page.jpg` (Complete tablet scroll)
- `mobile-hero.jpg` (390x844 mobile viewport)
- `mobile-full-page.jpg` (Complete mobile scroll)
- `mobile-menu.jpg` (Open mobile menu with contact shortcuts)
- `lightbox-open.jpg` (Active photograph viewer)
- `performance-playing.jpg` (Video player active with native controls)
- `contact-desktop.jpg` (Dual-card contact section on desktop)
- `contact-mobile.jpg` (Dual-card contact section on mobile)

---

## 5. Remaining Decisions for the Owner

1. **Production Domain (`VITE_SITE_URL`):** When the custom domain is acquired, create `.env.production` with `VITE_SITE_URL=https://yourdomain.com` before running `npm run build`.
2. **Photography Credits & Rights:** Confirm whether usage rights and photographer credits should be attributed for photographs `p10`, `p11`, and `p12`.
3. **Optional Additional Footage:** Review `docs/VIDEO-COMPARISON.md` if the owner ever decides to substitute Performance 02 with the proposed cropped/audio-leveled versions in `media-derived/proposed/`.

