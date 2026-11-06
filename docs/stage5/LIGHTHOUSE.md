# Lighthouse and performance results

Tool: Lighthouse 13.6.0, headless Chromium 153, default simulated throttling (mobile: slow 4G + 4× CPU slowdown; desktop preset). The site was served locally by `scripts/serve-dist.mjs` (gzip enabled, `_headers` applied). **These are lab results from a loopback server, not field data and not a CDN.** Raw reports: `docs/stage5/measurements/`.

## Scores

| | Stage 4 | Stage 5 |
|---|---|---|
| Mobile: Performance | 99–100 (5 runs, median 100)* | 94–100 (8 runs, median 97) |
| Mobile: Accessibility / Best practices | 100 / 100 | 100 / 100 |
| Mobile: **SEO** | **92** | **100** |
| Desktop: Performance / A11y / BP | 100 / 100 / 100 | 100 / 100 / 100 |
| Desktop: **SEO** | **92** | **100** |

\* My first single baseline run read 92 (TBT 360 ms). Repeating it five times on the original build gave 99–100 (TBT 50–150 ms), so **that first number was noise and I do not claim a performance improvement from it**. Details: `measurements/after/performance-sampling.txt`.

## Core Web Vitals (lab)

| Metric (mobile, simulated) | Stage 4 | Stage 5 |
|---|---|---|
| LCP | 0.8 s (5/5 runs) | 0.8 s (7 of 8 runs; one run read 2.7 s, see below) |
| CLS | 0 | 0 |
| TBT (INP proxy) | median 81 ms (50–150) | median 238 ms (90–290) |
| FCP | 0.8 s | 0.8 s |
| Desktop LCP / FCP | 0.2 s | 0.2 s |

**Honest reading.**
* **No Core Web Vitals improvement is claimed.** LCP and CLS are unchanged and already good.
* **TBT: the simulated estimate got worse** (median 81 → 238 ms), still around the 200 ms "good" boundary. Direct measurement shows far less difference: with real 4× CPU throttling, blocking time was **165 ms (Stage 4) vs 162 ms (Stage 5)**, median of 8 trials; layout time rose ~35 ms (at 4× throttle) and DOM nodes 734 → 784 (more content in the Contact rows, hidden accessibility text, a second gallery structure). Lighthouse's simulated figure is amplifying a small difference. I did not find a cheap, safe fix (e.g. `content-visibility: auto` risks anchor-scroll jumps), and did not ship one.
* **LCP outlier:** the LCP element is the header "Menu" text (observed ≈ 0.3 s), not the photograph; in one of 8 runs the simulator picked a later paint candidate (2.7 s). The hero photograph is preloaded, eager and high-priority, so I regard this as simulator variance, but I cannot prove it was not partly real.

## What measurably improved

| | Stage 4 | Stage 5 |
|---|---|---|
| Bytes transferred at page load (mobile) | 411 KiB | **347 KiB** |
| Requests at load | 10 | **8** |
| Video posters fetched at load | 70 KiB (always) | **0** (when the section is within ~900 px) |
| Video bytes before pressing play | 0 | 0 (verified) |
| Hero LCP image discovery | after JS bundle | preloaded in `<head>` (verified fetched exactly once) |
| Scroll handler | re-rendered React every scroll frame (progress bar in state) | writes the bar directly; no re-render |
| Third-party requests | 0 | 0 |
| JavaScript | 256 KB / 80 KB gzip | 261 KB / 81 KB gzip (+5 KB: gallery rows, contact, dialogs portal, captions hook) |
| Layout shift | 0 | 0 |

## Remaining Lighthouse opportunities (all known trade-offs)

* "Improve image delivery" (~71 KiB mobile / ~133 KiB desktop): the gallery photographs ship as original JPEGs because Stage 3's fidelity test rejected AVIF for them. Faithful photographs were prioritised over bytes.
* "Reduce unused JavaScript" (~39 KiB): React runtime paths; no avoidable libraries (there are none besides React).
* "Render-blocking" (~90–120 ms): one 8 KB-gzip stylesheet; inlining it would not help at this size.
* Fonts: Newsreader latin variable (130 KB) is the largest file; text paints with the fallback until it arrives (`font-display: swap`), CLS stays 0.

## Not measured

Real-network, real-device, field Core Web Vitals (CrUX); INP (needs real interactions on real hardware). Re-run Lighthouse against the deployed URL once it exists.
