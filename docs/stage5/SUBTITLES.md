# Subtitles and captions: status

**Decision: not shipped. Left out and documented, as the brief requires when accurate transcription cannot be achieved.**

## Why

* The dialogue in both clips would need to be transcribed in **Nepali**. I cannot listen to audio, and no automatic speech tool available to me can produce a reliable Nepali transcript; machine transcription and translation of Nepali are error-prone, and the brief forbids inaccurate automatic output and invented dialogue.
* I do not know whether the clips contain spoken dialogue at all (Stage 3's analysis measured loudness, not speech content). Performance 02, in particular, may be largely physical.
* Captions are only correct if a person who understands the language verified the text and timing.

## What is already built (so adding captions later is a five-minute job)

* `src/content/performances.ts` has a `captions` field per performance (currently `null`).
* `src/components/Performance.tsx` renders a `<track kind="captions">` only when that field is set. Browsers then show their **native captions (CC) control** in the video player; there is no extra UI to build.
* Place WebVTT files in `public/media/captions/` (create the folder).

## To add captions (owner or any Nepali speaker)

1. Write the transcript of exactly what is spoken, in Devanagari. Do not translate unless you want an English track as well.
2. Make a `.vtt` file with timings (start --> end per line). Example:
   ```
   WEBVTT

   00:00:03.200 --> 00:00:06.000
   (the exact words spoken)
   ```
3. Save as `public/media/captions/performance-01.ne.vtt` and set in `performances.ts`:
   ```ts
   captions: { src: `${import.meta.env.BASE_URL}media/captions/performance-01.ne.vtt`, srclang: 'ne', label: 'नेपाली' },
   ```
4. `npm run build`, play the video, switch captions on in the player, check sync.

## Accessibility note

If either clip contains spoken dialogue, WCAG 2.2 success criterion 1.2.2 (Captions, prerecorded, Level A) applies and captions are needed for full conformance. axe-core flags the two videos as "needs review" (`video-caption`) for this reason; I have **not** suppressed that. If both clips are non-verbal, a short transcript or description would satisfy the criterion instead.
