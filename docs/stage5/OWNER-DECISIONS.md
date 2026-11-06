# Remaining owner decisions and inputs

Ordered by how much they matter for launch.

## Before the site goes public

1. **Photo rights and credit for gallery plates 01 (p11) and 03 (p12)**, also p10 (not shown). The project's notes say rights and photographer credit are unconfirmed. Confirm and tell me the credit wording, or choose replacements. *(Pre-launch risk.)*
2. **Review the casting-profile PDF** (`public/Bishal-Raj-Actor-Profile.pdf`) word for word, or tell me to remove it. See PRESS-KIT-STATUS.md.
3. **"Nepali actor"**: the hero sentence ("An emerging Nepali actor…") and About copy are owner-supplied wording. Only the *language* is confirmed. Does "Nepali" mean nationality, language, or both? Metadata already avoids nationality.
4. **"Emerging" / "early in his career"**: subjective claims in the hero and About text. Keep, soften, or remove? I changed one inference ("completed his training" → "trained in theatre… holds a certificate") because only training and a certificate were confirmed.
5. **Performance 02: which performer is Bishal, and at what time?** Until known, the clip is labelled neutrally and I did not choose a "clear Bishal" poster. A one-line caption is ready to switch on (`performerNote`).
6. **Do the clips contain spoken dialogue?** If yes: a Nepali-speaker's verified transcript is needed for captions (SUBTITLES.md). If no: a short text description satisfies accessibility.
7. **Domain.** Needed for canonical URL, share previews, sitemap, structured-data `url`. Set `VITE_SITE_URL` (DEPLOYMENT.md).
8. **Real-device and Safari/Firefox check** (BROWSER-TESTING.md): I could not do it.

## To make the profile more casting-ready (all optional, nothing shows until supplied and confirmed)

* Playing age range, height, hair, eyes, based-in city, other languages, accents, skills, representation: `src/content/profile.ts` (CASTING-PROFILE.md).
* Verified credits/CV, or confirmation there are none yet.
* 1–2 approved neutral headshots for the profile sheet.
* Whether the two clips are "the showreel" or a separate showreel is coming (then the section heading/lead can say so).
* Exact certificate wording from Mandala Theatre (e.g. certificate title/year), if wanted: `TRAINING` in `site.ts`.

## Decided by me; change if you disagree

* Gallery trimmed from 6 to 5 plates (p4 repeated the hero pose). MEDIA-AUDIT.md.
* The visible hero line now reads "Mandala Theatre certificate · Performs in Nepali", and the secondary action is "Contact Bishal".
* Email and WhatsApp are presented as full-width rows with Send/Chat buttons, plus copy buttons.
* Exact age (25) stays hidden.
* No contact form (per brief). No analytics (none was requested; adding any would need a cookie/privacy decision).
