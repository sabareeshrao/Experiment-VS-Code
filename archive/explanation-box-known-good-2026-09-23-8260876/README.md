# Known-good explanation box snapshot

This folder preserves the explanation-box implementation that was visually approved as working on 2026-09-23.

Source repository: `sabareeshrao/Experiment-VS-Code`
Source branch: `main`
Source commit: `8260876e78a5ee4b4f0ea332efc088dc4ee2e09d`

## Preserved files

- `explanation-controls.js` — canonical/global explanation box runtime and UI
- `app.js` — player integration that sends current question/explanation/answer state
- `player.html` — player boot/integration structure
- `styles.css` — player layout styles that can affect explanation positioning/viewport behavior

## Restore rule

Treat this directory as an immutable known-good reference. Do not wire these archived files into production directly. If a future explanation-box change regresses the UI, compare or restore from this snapshot intentionally.

The approved behavior to preserve includes the current visual design, question/explanation rendering, Answer block below the question, drag/minimize/resize controls, global persistence, dynamic content height, and viewport-safe overflow behavior.
