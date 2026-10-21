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

## Antique reference redesign

Restyled the opening, index, cards, dialogs, forms, reading entries, tasks and journal in parchment and sepia, following the owner's antique reference. Added a compressed, purpose-generated hero artwork and a lightweight local paper-grain SVG. Confirmed bundled font loading, desktop/mobile rendering, no horizontal overflow at 390 px, and writing form behavior; reran the section and content interaction checks after replacing the CSS.

## Reference layout and working dashboard

Matched the reference's narrow composition and sequence: cloud collage, four featured paper cards, quill writing desk, room/description pair, hourglass ledger, interest strip and footer. Added a disclosure for the other nine corners; filtering and search still cover all thirteen. Re-ran protected gates and content interaction checks with the disclosure. Verified a quick note opens the correct gated corner, appears in its collection, updates the home ledger, and is escaped as text; checked interest links and the room preview action. Inspected full-layout and mobile screenshots.

## Material and journal update
- Verified exact owner-provided opening text and removal of the previous dedication.
- Verified two-page journal, page tabs, switching and retaining scraps on both pages, drag/resize and new pages.
- Verified leather book cover, image upload, reading filters, writing CRUD, all gates, habit counter, mobile fit and refresh reset.
- Opening fox pointer/keyboard interaction and reduced-motion checks pass.
- Desktop and mobile screenshots inspected; generated paper and walnut desk are local WebP assets.

## Scrapbook studio and MP3
Browser checks passed for paper selection, decorative items, pointer drawing and undo, exporting JSON and importing strokes/background selection, audio playback with a generated WAV, switching player skins and playlists, mobile width and absence of JS errors. No physical pen device was available; testing used browser pointer events. Added front/back ordering controls for scraps.

## Automatic corner audio
Verified opening and all 12 supplied corner IDs produce autoplay embed requests without a play-button click, with a single iframe at a time, cleanup when leaving, and manual stop. YouTube responses were stubbed in this browser check, so this does not establish remote video availability or guaranteed audible autoplay. Browser policies can require a user gesture; opening retries once on an eligible real gesture and provides a manual fallback.

## October 21 input and audio fixes
Validated in Chromium with touch enabled at tablet dimensions: delete and undo/redo; synthetic pen input in selection mode with multiple points; whole-stroke eraser and undo; local FontFace upload; per-track artwork retained when re-entering music; actual local WAV playback and pause on navigation; mobile horizontal fit; no iframe or JS errors. Synthetic pen capture was stubbed for synthetic PointerEvents; physical Apple Pencil/Safari remains untested. Audio now uses local files only, with per-place session assignments and an explicit play fallback for browser autoplay rejection. Requested MP3 files have not been provided.

Song uploader: verified all 16 destinations, uploading from the opening to another corner, retaining assignment when entering that corner, empty destination controls, deleting an assignment, mobile width and absence of JavaScript errors. Uploads remain session-only, explicitly labeled in the panel.
