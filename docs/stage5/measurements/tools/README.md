# Reference test scripts (as run for Stage 5)

These are the exact scripts used to produce the numbers in `docs/stage5/`. They are kept so the
method is auditable. **They contain paths specific to the machine they were run on**
(`/home/claude/tools/...`, a Chromium path) and are not meant to be run unchanged.

For checks you can run yourself on Windows, use the project scripts instead:
`npm run test:browsers` (see docs/stage5/BROWSER-TESTING.md) and `npm run serve:dist`.

| Script | What it checks |
|---|---|
| assert.mjs | Hero actions inside the first screen, no horizontal overflow, email on one line, no console errors (7 viewports) |
| functional.mjs | HTTP/404/headers, link targets, clipboard, lightbox + menu keyboard/focus/inert, video lazy-loading and playback, reduced motion |
| axe-run.mjs | axe-core WCAG 2.2 AA + best-practice on page, lightbox and mobile menu |
| shoot.mjs / dialogs.mjs | Screenshots at 1440, 1366, 768, 430, 390, 360 and the two dialogs |
| lh-summary.mjs | Prints a Lighthouse JSON summary |
