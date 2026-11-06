# SEO and discoverability audit (Stage 5)

Lighthouse SEO: **92 → 100** (the miss was an invalid `robots.txt`: the single-page app answered `/robots.txt` with HTML).

| Item | Stage 4 | Stage 5 |
|---|---|---|
| Title | "Bishal Raj — Actor \| Portfolio" | "Bishal Raj — Actor \| Performances, Photographs & Contact" |
| Meta description | "Nepali actor…" (reads as nationality) | "Actor trained in theatre at Mandala Theatre, performing in Nepali. Watch performance footage, view stage photographs and contact Bishal Raj directly for casting." |
| Canonical | generated if `VITE_SITE_URL` set | same; verified: absent when unset, correct when set |
| Open Graph / X card | present | present; `og:image` absolute when `VITE_SITE_URL` is set |
| Share image | 1200×630, stand-in serif | 1200×630 rebuilt with the real Newsreader; old one kept in `media-derived/previous/` |
| Favicon / Apple touch icon | present | unchanged (an ellipse "spotlight" mark; a monogram would read better at 16 px, optional) |
| robots.txt | **missing (HTML returned)** | generated; allows all; `Sitemap:` line only when a domain is set |
| sitemap.xml | missing | generated **only when `VITE_SITE_URL` is set** (single URL; no fake pages) |
| 404 page | none (blank page, status 200) | branded `404.html`, `noindex`, real 404 status on hosts that honour it |
| Semantic HTML | good | verified: one `h1`, `h2` per section, `h3` for sub-blocks, landmarks `header/nav/main/footer` + `aside` for quick actions |
| Image alt | complete | complete (0 missing of 7 `<img>`) |
| JSON-LD | static in `index.html` | **generated from `site.ts`** so it cannot drift; `Person` with name, jobTitle, `knowsLanguage: ne`, email, telephone, `alumniOf` Mandala Theatre, `sameAs` (Instagram, Facebook); `url`/`image` only when a domain is set. Validated as JSON. |
| No-JavaScript content | one-line `<noscript>` | `<noscript>` carries name, role, training, language, email, WhatsApp, both profiles (also generated from `site.ts`) |
| `lang` | `en` | `en` |

**Confirmed-only structured data.** No awards, filmography, employer, agency or credentials beyond the confirmed certificate are present. No nationality is stated anywhere in metadata or structured data (only the performing language).

## What I could not verify

* **Indexing, rich-result eligibility, real share previews.** These need a live public URL. No domain exists, so nothing was submitted or checked against Google/Facebook/X debuggers. After launch: test the URL in Facebook's Sharing Debugger, X's card preview or LinkedIn Post Inspector, and Google Search Console (URL Inspection) and submit `sitemap.xml`.
* **The site is a client-rendered React app.** Google renders JavaScript, but some crawlers and link-preview bots do not; that is why the head metadata and `<noscript>` content are complete without JavaScript. Full pre-rendering was not added: for one page it would add build complexity for little benefit.

## Remaining owner decision
"Nepali actor" still appears in the **hero sentence** and About copy (owner-supplied wording). Metadata deliberately uses "performing in Nepali" instead. Decide whether "Nepali" in the visible copy means nationality, language, or both.
