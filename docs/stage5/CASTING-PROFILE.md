# Casting profile: how to edit it

Everything a casting director might want to know lives in **`src/content/profile.ts`**. One rule governs it:

> A fact is shown **only when `confirmed` is `true` AND `value` is filled in.**
> Nothing is guessed, estimated or "typical". An empty field is invisible on the site and in the PDF.

## What is confirmed and shown today

| Field | Value | Where it appears |
|---|---|---|
| Profession | Actor | Hero, About, PDF, structured data |
| Primary performance language | Nepali | Hero line "Performs in Nepali", About "Performs in", PDF, structured data (`knowsLanguage: ne`) |
| Theatre training | Mandala Theatre, certificate holder | Hero line "Mandala Theatre certificate", About training block, PDF, structured data (`alumniOf`) |
| Open to | Film, Television, Theatre, Commercials, Digital productions | About, PDF |

Training and profession live in `src/content/site.ts` (`TRAINING`, `SITE`); the rest of the facts live in `profile.ts`.

## Fields that exist but are empty (invisible until you supply and confirm them)

`playingAge`, `height`, `eyeColour`, `hairColour`, `basedIn`, `otherLanguages`, `accents`, `skills`, `representation`, and `CREDITS` (a list). Each field has a `note` saying exactly what is needed from the owner.

`age` is a special case: an exact age (25) was supplied in an earlier stage but is **hidden** (`confirmed: false`), because casting profiles normally use a playing-age *range* and an exact age goes stale. Replace it with a range, or confirm it.

## How to publish a fact

1. Open `src/content/profile.ts`.
2. Find the field, e.g. `{ id: 'height', label: 'Height', value: null, confirmed: false, ... }`.
3. Set the value and confirm it: `value: '178 cm', confirmed: true`.
4. `npm run build`. It now appears in **About** automatically (as a row in the profile list).
5. `npm run profile:pdf` to refresh the downloadable profile sheet (see PRESS-KIT-STATUS.md).

## How to add a credit

Credits are intentionally empty: none were supplied. When the owner provides verified credits:

```ts
export const CREDITS: readonly Credit[] = [
  { title: 'Title of production', role: 'Role', kind: 'Theatre', company: 'Company or theatre', year: '2025', verified: true },
]
```

A "Credits" block then appears in About and in the PDF. An entry with `verified: false` never renders.

## What this protects against

* Nothing is displayed because it is "likely" (no playing age inferred from the photographs, no location inferred from the phone number).
* The earlier unused config that contained unconfirmed values ("available for international travel", "Independent / Direct Contact", base location) was **removed** from `site.ts` in Stage 5.
* Optional fields are plain strings: you control the exact wording.
