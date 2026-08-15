# Aham Aatm Deepah Carousel QA

## Changes
- Added high-contrast lime Previous and Next pill controls with labels and arrow icons.
- Added an explicit `PHOTO 01 / 03` style counter with live updates.
- Replaced subtle line dots with numbered 01/02/03 pagination buttons.
- Added `FIELD NOTE` caption label and `SWIPE OR SELECT` guidance.
- Added touch/pointer swipe handling to the image frame with a 42px threshold.
- Added keyboard focus outlines and ARIA labels/tabs for accessible navigation.

## Local verification
- `npm run build` passed: 361 modules transformed.
- Aham Aatm Deepah project selected in the Work carousel.
- Photo 02 selected successfully through numbered pagination; image, caption, counter, and active state updated.
- Controls are visible over the image at the local preview viewport and no longer rely on low-contrast dark circular arrows.
- Mobile layout rules keep labeled controls, counter, caption guidance, and pagination readable.

## Production verification

The cache-busted GitHub Pages deployment exposes the updated Previous and Next buttons plus numbered photo controls with the expected ARIA labels. The live Work navigation was triggered successfully and Aham Aatm Deepah selection was queued in the production DOM for the final settled-state check.

## Final production verification

The production HTML now references the JavaScript and CSS assets with a fresh build-time query version, preventing the old same-filename bundle from being reused by browser caches. A fresh live session exposes `PREV`, `NEXT`, `PHOTO 01 / 03`, and numbered 01/02/03 controls in the deployed DOM.

The production session exposed the new carousel controls and versioned assets. A direct browser click from the current Work session remained on the first project card, so final visual capture will use a direct DOM selection of the Aham project button before judging the settled card.
