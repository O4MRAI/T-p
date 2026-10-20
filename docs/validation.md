# Prototype verification — 20 October 2026

Verified in headless Chromium with the application's Three.js 0.160.0 imports served from a local copy during browser tests. This isolates the application checks from CDN availability; live Google Fonts and YouTube playback were not part of these checks.

## Functional checks

- Opening gate rejects an incorrect password and supports explicit demo entry.
- All twelve protected section gates accept their configured passwords; the journal opens directly.
- Search and category filters narrow the thirteen section cards.
- Writing can be created, edited, revisited, and deleted. User text renders literally, including HTML-looking input.
- Library accepts a local cover image, reading status, rating, and quotation; reading-status filtering works.
- Habit counter reaches eight steps and disables further increments, updating the companion message.
- Journal supports adding text, dragging and resizing a scrap, creating a second page, and switching back without losing the first page's contents.
- Reloading removes newly added content, as intended for this prototype.
- Mobile viewport at 390 × 844 has no document horizontal overflow.
- No JavaScript page errors in these flows.

## Three-dimensional integration

- Desktop and touch/mobile variants load the Mercedes and thirteen section markers without JavaScript errors.
- Both car variants retain their validated bounds and floor clearance.
- Clicking the Mercedes section marker in the rendered room opens its gate and then its section.
- Section overlays disable room controls. Returning to the room enables them again.
- Inspected rendered desktop room and desktop/mobile interface screenshots.

## Static checks

`node --check` for the room module, `node --input-type=module --check` for the new UI and section configuration, and `git diff --check` pass.

## Quick manual walkthrough

1. Serve the repository with `python3 -m http.server 8000` and open localhost:8000.
2. Click the autumn leaf, then choose demo entry or enter the main password.
3. Filter the corners, open one, and add sample content; return through the index.
4. Open يُسر and add a habit; try eight increments.
5. Open الجورنال, add and drag a scrap, then change its size and page.
6. Return to the room and click a labeled corner marker.
7. Reload and confirm the newly added corner content is empty again.

## Arabic typography update

Bundled Alexandria (400/500/600/700) and Aref Ruqaa (400/700) as local WOFF2 files with their OFL licenses. Verified font loading, inspected desktop and mobile renders, checked mobile horizontal overflow, and exercised the writing form with the updated typography. Google Fonts is no longer requested by the page. The final choice follows the owner's feedback on the preview: stronger geometric lettering, clearer weights and contrast, and a Ruqaa signature.
