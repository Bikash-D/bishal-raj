# Browser and device testing report (Stage 5)

## What was and was not tested: stated plainly

| Environment | Tested in Stage 5? | How |
|---|---|---|
| **Chromium 153 (Chrome for Testing), desktop** | **Yes, automated** | Playwright: layout assertions, 60+ functional checks, axe, Lighthouse, screenshots |
| **Chromium, phone emulation** (390×844, touch, mobile viewport; iPhone 14 profile in the script) | **Yes, automated** | Playwright touch events (`tap`), mobile menu, lightbox, contact controls |
| Google Chrome (retail), Microsoft Edge | **No** | Not available to me. (Stage 4 documents its own Chrome/Edge testing; I did not re-verify it.) |
| **Firefox** | **No** | The browser download is blocked in my environment. |
| **Safari / WebKit** | **No** | Same: WebKit could not be installed. |
| **A real phone or tablet** | **No** | I have no device. |

**Nothing about Firefox, Safari, Edge or any physical device is claimed.** Chromium-based testing says little about Safari's video, scroll and viewport-unit behaviour: especially `100svh` on iOS, which the hero relies on.

## What the Chromium tests cover (all passing on the final clean build)

* Layout at 1440, 1366, 768, 430, 390, 360 and 375×667: hero "View performances" and "Contact Bishal" fully on the first screen, ≥ 44 px tall; no horizontal overflow; email on one line; no console errors with the strict CSP enforced.
* Links: `mailto:thebishalraj@gmail.com?subject=…`; `https://wa.me/9779864838906?text=…` (encoded professional message); Instagram `…/biishal.rajjj/`; Facebook `…/bishalrajjj`; all four `target=_blank` links have `rel=noopener`. **This verifies the link addresses; it does not open WhatsApp or a mail app** (impossible headless).
* Copy buttons: the exact email and phone string reach the clipboard; confirmation is announced.
* Both videos: no file requested before Play; each plays (`currentTime` advances), only one at a time; native controls appear. Audio cannot be verified by me.
* Lightbox, mobile menu, floating action, reduced motion, 404 page, HTTP types and headers.
* **Built output served independently:** the clean build was copied to an unrelated folder and served by `scripts/serve-dist.mjs` (no Vite, no project files) and passed all the above.

## Run Firefox and WebKit yourself (Windows PowerShell)

I wrote the script and verified it runs under Chromium (15/15 checks across desktop and an iPhone 14 profile). It has **not** been run on Firefox or WebKit.

```powershell
npm run build
npm install --no-save playwright          # does not change package.json / package-lock.json
npx playwright install chromium firefox webkit
npm run test:browsers                      # all three engines; or: node scripts/cross-browser.mjs firefox
```

Notes: WebKit here is Safari's *engine*, not Safari. Playwright's Firefox may lack the H.264 codec on some systems; a video failure in Firefox is reported as a **warning** to check by hand, not as a site bug.

## Real-device checklist (10 minutes, please do before launch)

On an iPhone (Safari) and an Android phone (Chrome), open the live URL, then:
1. First screen: name, "Actor", training line, Nepali line, **both buttons visible without scrolling**.
2. Tap "Contact Bishal", then the email address: the mail app opens with a subject. Tap "Chat on WhatsApp": WhatsApp opens a chat with **+977 986-4838906** and the prepared message.
3. Tap Play on **both** videos; confirm picture and **sound**; rotate the phone; go full screen.
4. Open the gallery, swipe left/right, close with the button and by tapping outside.
5. Open the Menu, tap each item.
6. Download the casting-profile PDF.
7. With VoiceOver (iPhone) or TalkBack (Android) on, swipe through the first screen and the Contact section; check that every control is announced sensibly.
