# Video analysis (Stage 3)

Method and limits: metadata and loudness were measured with ffprobe/ffmpeg. Footage was inspected as extracted still frames
(about one every 3 seconds, plus automatic cut/black/freeze detection), **not** watched or listened to continuously.
Judgements about expression and delivery come from stills only. Nobody has listened to the audio: software
measurements are not a substitute for a human listen. Which performer is Bishal in Video 2 cannot be determined from
the footage and was not guessed.

## Inventory and duplicate check

| File | SHA-256 | Bytes | Status |
|---|---|---|---|
| `bishal video 1.mp4` | ea269907... | 7,342,780 | Performance 01 (served unchanged) |
| `bishal video 2.mp4` (archived) | cbef3a1b... | 6,519,410 | Original, kept, not served |
| `bishal video 2 - resubmitted upload.mp4` (new) | f164d38c... | 6,519,410 | Served as Performance 02 (unchanged) |

The archived Video 2 and the new upload differ in exactly 2 bytes (positions 19,173 and 19,174, inside the media data).
All decoded video frame hashes and all decoded audio hashes are identical, so this is the same footage: shown once.

## Technical metadata

| | Video 1 | Video 2 / new upload |
|---|---|---|
| Container, video | MP4, H.264 Baseline L3.1, yuv420p | same |
| Resolution | 576x928 (about 0.62) | 576x1024 (9:16) |
| Frame rate | 30 fps, constant | 30 fps, constant |
| Duration | 1:11.93 | 0:54.87 |
| Total bitrate | 817 kb/s | 951 kb/s |
| Audio | AAC-LC, 44.1 kHz, stereo | AAC-LC, 44.1 kHz, stereo (left and right identical: mono) |
| Rotation metadata | none | none |

## Audio

| | Video 1 | Video 2 |
|---|---|---|
| Integrated loudness | -12.5 LUFS | -20.4 LUFS |
| Loudness range | 15.3 LU | 16.9 LU |
| True peak | +5.7 dBTP | -3.0 dBTP |
| Samples above full scale (decoded) | 1,307 of 6.3M (0.02%) | 0 |

Video 1 decodes to peaks above full scale, mostly at 0:31-0:40, 1:00 and 1:05; many players will hard-clip these.
Gain reduction avoids playback clipping but cannot restore anything already lost if the source was clipped; whether the
source was clipped, or this is encoder overshoot, cannot be told from software. The site plays Video 1 at 50% volume
(about -6 dB) where the browser allows it; **iPhone Safari ignores volume, so Video 1 plays at full level there.**
Video 2 is quiet and mono; whether speech is audible over the room has not been judged (needs a human listen).

## Performance 01 (Video 1): timecoded breakdown (approximate)

| Time | Content |
|---|---|
| 0:00-0:08.6 | Close-up, face lit, looking up, pointing at about 0:06 |
| 0:08.6-0:14.7 | Wide, kneeling in a pool of light |
| 0:14.7-0:18.0 | Close-up |
| 0:18.0-0:28.8 | Wide, kneeling: hands to ears, reaching up, raised fist |
| 0:28.8-0:42.1 | Close-up, pointing, open-mouthed delivery (loudest stretch) |
| 0:42.1-0:50.9 | Wide, kneeling |
| 0:50.9-0:59.3 | Standing behind a wooden stool |
| 0:59.3-1:07.5 | Close-up, pointing, climactic |
| 1:07.57-1:11.93 | **Silent** four-second montage: costume close-up, three quick stills, final kneeling frame |

Bishal is clearly identifiable and lit throughout; black background is clean; no black frames or freezes.

## Performance 02 (Video 2): timecoded breakdown (CORRECTED)

The Checkpoint A report wrongly said the first 12 seconds were sideways. Only the clip at about 0:08-0:13 is sideways.

| Time | Content |
|---|---|
| 0:00-0:07.6 | Upright wide stage view: one performer crouched, another lying on a mat |
| 0:07.6-0:12.6 | **Sideways** clip (pixels rotated 90 degrees, no rotation flag): seated group, performers at right |
| 0:12.6-0:23.8 | Portrait shot of a seated man in a white shirt; a **third party's concert banner** is visible behind him |
| 0:23.8-0:32.8 | Wide stage view: performer in dark shirt leaning over a person lying on a mat |
| 0:32.8-0:47.7 | **Near-black, almost frozen** (about 14 s) |
| 0:47.7-0:54.9 | Same wide view as 0:23.8; some handheld shake |

Figures are small and faces are not readable. The poster frame (28.0 s) is a wide frame without the banner.

## Editorial note

The owner asked for both videos. Performance 01 shows his face, voice and range; Performance 02 is a weaker piece for
judging presence (distance, a sideways clip, a dark stretch, a third-party banner). Both are published unmodified.
**Stage 3.1:** the public page no longer mentions the sideways clip or dark stretch; these notes stay internal. Cleaned alternatives are in `media-derived/proposed/` and await an owner decision (see `VIDEO-COMPARISON.md`).
