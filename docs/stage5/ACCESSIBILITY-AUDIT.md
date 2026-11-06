# Accessibility audit (Stage 5)

Method: axe-core 4.14 (WCAG 2.0/2.1/2.2 A+AA and best-practice rules) on **five states** (desktop page, desktop lightbox, mobile page, mobile lightbox, mobile menu); scripted keyboard, focus and touch tests in Chromium; pixel-measured contrast where axe cannot compute it; Lighthouse accessibility. Not performed: testing with an actual screen reader (NVDA, VoiceOver, TalkBack): see "Not tested".

## Results

| | Stage 4 | Stage 5 |
|---|---|---|
| axe violations (5 states) | `label-content-name-mismatch` ×10–11, `region` ×1, `color-contrast` ×1, `aria-prohibited-attr` ×1 | **0 in all 5 states** |
| axe "needs review" | contrast ×6–11, `video-caption` ×2 | contrast ×6–13 (measured by hand below), `video-caption` ×2 (open, see below) |
| Lighthouse accessibility | 100 | 100 |

Nothing was suppressed or disabled to get these numbers.

## Fixed in Stage 5

| Problem | Fix |
|---|---|
| Controls whose accessible name omitted their visible text (hero "Explore", both "Play footage" buttons, email/WhatsApp/social links, gallery plates, menu contact links, floating WhatsApp) | Removed overriding `aria-label`s; names now come from visible text plus visually-hidden suffixes ("… (opens in a new tab)", "Performance 01, 1 minute 12 seconds"). Decorative "01 / View" plate text is drawn by CSS. |
| Social links had labels hidden on phones (`display:none` also removed "Instagram"/"Facebook" from the accessible name) | Label is stacked above the handle on phones and always in the name |
| `aria-label` on a role-less `div` and content outside landmarks (floating actions) | Now an `<aside aria-label="Quick actions">` |
| Lightbox keyboard hint failed contrast | Opacity reduction removed |
| Page behind dialogs reachable by touch screen readers | Lightbox and mobile menu render in a portal; `#root` is `inert` while open; scroll locked |
| Focus did not return to the Menu button after Escape | Fixed (restored after the dialog unmounts); test added |
| Desktop layout shifted when the lightbox hid the scrollbar | `scrollbar-gutter: stable` |
| Video `aria-label` was a long sentence including the poster description | Short name; description via `aria-describedby` |
| Video load failure was a dead end | Message with "Try again" and "Open the video file" (`role=status`) |
| Copy buttons ~28 px; address links 24 px | All contact controls ≥ 44 px (measured); copy confirmation announced via `role=status` |
| Floating WhatsApp covered the WhatsApp card in Contact | It steps aside while the Contact section is in view |
| Contact card hover "lift" implied the non-link card was clickable | Removed; only the buttons react |

## Verified behaviour (automated, Chromium)

* Skip link, visible focus ring (cobalt, ≥ 4:1 on near-black), `Tab` order follows reading order.
* Lightbox: `Enter` opens, focus moves in, `Tab` cycles inside, `←/→` navigate and announce "02 / 05 photographs", `Escape` closes, focus returns to the plate that opened it, page behind is `inert` meanwhile.
* Mobile menu (touch, 390 px): opens, focus moves in, links ≥ 44 px, `Escape` closes and focus returns to the Menu button, tapping a link closes and scrolls.
* Reduced motion (`prefers-reduced-motion: reduce`): hero and About content visible immediately; transitions collapsed by the global safety net.
* Headings: one `h1`; `h2` per section; `h3` for sub-blocks. No skipped levels.

## Contrast: "needs review" items measured from rendered pixels

axe cannot compute contrast over gradients or images, so I measured the brightest pixels behind each text element and computed WCAG ratios (threshold 4.5:1 for small text, 3:1 large):

| Text | Worst case measured |
|---|---|
| Hero name, role, facts, brand, menu button (390–1440 px; text sits over near-black headroom) | ≥ 6.5:1 (menu button over lifted photo pixels); name 16.3:1; facts ≈ 14.6:1 |
| Performance "Play footage" label and time over posters | ≥ 8.2:1 |
| About training block (label, name over gradient) | 5.7:1 (label, small text), 16:1 (name) |

Lowest anywhere: **5.7:1** (bronze 12 px label on the training panel).

## Open items (not hidden)

1. **Captions (WCAG 1.2.2, Level A).** axe still lists the two videos under "needs review". If either contains spoken dialogue, captions are required and none exist yet (see SUBTITLES.md). If both are non-verbal, a short text alternative satisfies the criterion. *Owner to confirm which.*
2. **Not tested with real assistive technology.** Names, roles and live regions are verified programmatically; the actual spoken experience in NVDA/JAWS, VoiceOver (macOS/iOS) and TalkBack has not been heard by me. Recommended before launch: 10 minutes with VoiceOver on an iPhone and NVDA on Windows (checklist in BROWSER-TESTING.md).
3. **Motion.** Entrance animations are short and collapse under `prefers-reduced-motion`. There is no in-page "pause animations" control; WCAG 2.2.2 does not require one for non-looping, sub-5-second effects.
