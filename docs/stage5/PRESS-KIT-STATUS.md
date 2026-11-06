# Press kit: status and what is needed from the owner

## What exists now

**`public/Bishal-Raj-Actor-Profile.pdf`: a one-page casting profile sheet** (A4, 1 page, ~150 KB), linked from the Contact section as "Casting profile, Download PDF · 1 page".

Contents (all owner-confirmed; nothing else):
* Name, "Actor"
* Theatre training: Mandala Theatre, certificate holder
* Performs in: Nepali
* Open to: Film, Television, Theatre, Commercials, Digital productions
* Portrait (the same approved photograph used as the mobile hero)
* Contact: email, WhatsApp number, Instagram, Facebook
* Footer: "Confirmed details only · November 2026"

It uses the site's own fonts (Newsreader, Hanken Grotesk), colours and portrait treatment.

**It is not a CV.** No CV, credits, filmography or measurements have been supplied, so none appear and none are implied. The sheet is generated from the same data as the website (`site.ts`, `profile.ts`), so it can only ever contain confirmed facts. Add a verified fact to `profile.ts` and the sheet gains it when regenerated.

**The press kit is deliberately small:** one link, one page. There is no separate "press" section on the website.

## Please review before publishing

The PDF has not been reviewed by the owner. Open it, check every word, and either approve it or tell me what to change. To remove the download everywhere, set `PRESS_KIT.file` to `null` in `src/content/press-kit.ts` (the Contact row disappears; delete the PDF from `public/`).

## Regenerating the PDF (Windows PowerShell)

Needs Node 22.18 or newer (it runs the TypeScript content files directly) and Google Chrome or Microsoft Edge (used invisibly to print the PDF; nothing is downloaded).

```powershell
npm run profile:pdf
# if Chrome/Edge is installed somewhere unusual:
$env:CHROME_PATH = "C:\Path\To\chrome.exe"; npm run profile:pdf
# once a domain exists, print it on the sheet:
$env:SITE_URL = "https://your-domain.example"; npm run profile:pdf
```

> Verified in this delivery: the script ran successfully with a headless Chromium on Linux and produced a 1-page PDF. It has **not** been run on Windows with Chrome or Edge; the script looks in the standard install folders of both, and `CHROME_PATH` overrides.

## Still needed to grow this into a full actor press kit

| Needed from owner | Why |
|---|---|
| Final CV / credit list, verified line by line (or confirmation there are none) | A CV can only be built from real credits |
| Approved professional headshots (front-facing, neutral) | Casting sheets normally carry 1–2 headshots; current photos are stage and spotlight images |
| Playing age range, height, hair, eyes, based-in, other languages, skills | The usual first things a casting director looks for; every one is optional and stays hidden until confirmed |
| Representation (agent/manager) if any | Shown only if it exists |
| Showreel decision | Whether the two clips are the showreel, or a separate cut is coming |
| Photographer credit and usage rights for p10, p11, p12 | See OWNER-DECISIONS.md |
