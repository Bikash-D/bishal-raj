# Video and image audit (Stage 5)

## Integrity (verified this stage)

SHA-256 of every file in `media-src/`, `public/media/` and `media-derived/` was compared with the untouched upload: **0 files changed, 0 removed.** The only addition is `media-derived/previous/og-image-stage4.jpg`, a backup of the old share card (the share card itself, `public/og-image.jpg`, is a regenerated *derived* asset, not a photograph of Bishal's).
Both published videos are **byte-identical** to the originals:

| Published file | Original | SHA-256 (first 16) |
|---|---|---|
| `public/media/video/bishal-video-1.mp4` | `media-src/originals/bishal video 1.mp4` | `ea269907de616cbb` |
| `public/media/video/bishal-video-2.mp4` | `media-src/originals/bishal video 2 - resubmitted upload.mp4` | `f164d38c8ff3e53f` |

## Videos

| | Performance 01 | Performance 02 |
|---|---|---|
| Duration (measured in-browser) | 1:12 | 0:55 |
| Frame (displayed) | portrait, 576×928 | portrait, 576×1024 |
| Poster | Close frame, Bishal clearly visible | Wide stage frame, two performers small in frame |
| Loads before play? | No: `preload="none"`; verified no `.mp4` request until Play is pressed | same |
| Poster loads | Only when the section is within ~900 px of the viewport (was: always, 70 KiB at page load) | same |
| Plays (Chromium, desktop and phone profile) | Yes | Yes (one plays at a time) |
| Audio | Not testable by me: I cannot listen | same |
| Failure handling | Message + "Try again" + "Open the video file" | same |
| Accessible name | "Performance 01, 1 minute 12 seconds" (poster description moved to `aria-describedby`) | same |
| Captions | None published, see SUBTITLES.md | none |

**Poster decisions.** Performance 01's poster is kept: it shows Bishal clearly. **Performance 02's poster is kept unchanged on purpose.** Stage 3's analysis states that which performer is Bishal in that clip cannot be determined from the footage, so I will not choose a "clear frame of Bishal" there: any pick could mislabel another performer. *Owner input needed:* the timestamp and position of Bishal in Performance 02. A configurable line (`performerNote` in `performances.ts`, currently `null`) will then print it under the video, and a poster frame can be chosen from the candidates in `media-derived/proposed/`.

Videos are not cropped, re-encoded or edited. No derived video is published.

## Images

| Image (id) | Source | Native size | Served as | Used in |
|---|---|---|---|---|
| kneelWide | p5 | 1572×1600 | AVIF q85 (+ JPEG fallback) | Hero ≥ 900 px |
| kneelClose | p4 | 900×1600 | AVIF q85 | Hero < 900 px; PDF; unchanged |
| portraitIntense | photo2 | 1293×1325 | AVIF q85 | About |
| stagePonchos | p11 | 1170×881 | JPEG original | Gallery 01 (lead row) |
| stagePoint | p6 | 848×1507 | JPEG original | Gallery 02 (lead row) |
| stageCotton | p12 | 1200×1600 | JPEG original | Gallery 03 |
| stageStill | p7 | 894×782 | JPEG original | Gallery 04 |
| stageShout | p8 | 1600×1200 | JPEG original | Gallery 05 |
| stageEnsemble | p10 | 1169×791 | AVIF q80 | **Not shown** (optional, awaiting approval) |
| kneelFar | p3 | 900×1600 | JPEG original | **Not shown** (optional) |
| p9, p13, photo1 | | | not in `public/` | **Excluded** |

**What Stage 5 changed in curation (documented in `src/content/gallery.ts`):**
* The gallery went from 6 plates to **5**. `kneelClose` (p4) was plate 06 on desktop; it is the phone hero and the same pose as the desktop hero, so showing it again repeated the opening image.
* **Layout:** a justified two-row spread (large lead row of 2, then 3). Each row's plates share a height and take widths proportional to their own aspect ratios, so **nothing is cropped** and the large empty gaps of Stage 4 are gone.
* **Lightbox:** unchanged behaviour (arrow keys, Escape, focus trap, swipe); now rendered outside the page root so the page behind is `inert`.
* **Alt text:** unchanged; every `<img>` has descriptive alt (0 missing, verified in the rendered page). Decorative "01 / View" plate text no longer duplicates into the accessible name.
* **Sharpness:** images are never rendered wider than native pixels (`Picture` caps width), so none are upscaled. AVIF is shipped only where Stage 3's fidelity test passed; JPEG originals otherwise. I did not change that decision. (Lighthouse's "improve image delivery, ~71–133 KiB" insight is the known price of this choice.)
* **Hero edges:** the photograph's slightly lifted edge pixels showed as visible seams against the page black. Fixed in CSS only (a dissolve over the dark upper areas on phones, a left-edge fade on desktop). **The image files are untouched.**
* Hero image is `priority` (eager, high fetch priority) and is now also `<link rel="preload">`ed with media conditions matching the two art-directed frames; verified it is requested exactly once.

## Image rights and credits (owner decision, still open)

The project's own notes say usage rights and whether photographer credit is required are **unconfirmed for p10, p11 and p12**. **p11 (Gallery 01) and p12 (Gallery 03) are published in the gallery.** Until confirmed, treat these two as a pre-launch risk. Options: confirm rights and add credit lines, or swap them out (p7, p6, p8 are not affected by that note). Attribution lines, once known, belong in the plate `alt`/caption and in the lightbox; there is currently no attribution UI because none has been required yet.
