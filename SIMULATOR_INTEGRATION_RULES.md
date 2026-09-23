# Simulator Integration Rules — READ BEFORE ADDING SOFTWARE

These rules are mandatory for every AI or developer adding a new simulator or extending an existing simulator in this repository.

The goal is not only to make an individual software screen look good. The simulator must integrate reliably with the cumulative lesson player, survive normal reloads without hard refreshes, preserve prior lesson state, show explanations consistently, and remain easy to extend when future transcripts require new UI.

## 1. Preserve software identity

- Every software owns its own UI, DOM, CSS, icons, menus, dialogs, panes, grids, trees, designers and interaction behavior.
- Do **not** create a shared visual component library that makes SSMS, Power BI, MySQL Workbench, IntelliJ, Jira, Jenkins, etc. look alike.
- Shared code may handle only player-level infrastructure such as package delivery, navigation, explanation behavior, persistence, focus-follow, boot recovery and highlighting.
- A new feature for one product belongs inside `simulator/<software>/`.

## 2. Required simulator folder

A substantial simulator should normally contain:

```
simulator/<software>/
  index.html
  engine.js
  capabilities.js
  icons.js          # when the software has its own icon system
  README.md         # software-specific notes when useful
```

Small/legacy simulators may differ, but new major software should follow this pattern.

## 3. Stable software IDs are contracts

A simulator has two IDs:

- player routing ID, used by lesson `software`
- package app ID, used under `window.COURSE.package.apps`

Do not rename an existing ID after lessons exist.

When adding software, update all required parent mappings:

- `frames`
- `appIds`
- `appLabels`
- `engineReady`
- `normalizeSoftware()`
- badge styling if needed
- player iframe
- capability manifest
- lesson package
- chapter/book metadata

A lesson is not integrated merely because its iframe renders.

## 4. Player iframe loading rule — never bypass this

All simulator iframes in `player.html` must remain **lazy**:

```html
<iframe
  class="sim-frame"
  data-app="example"
  data-src="simulator/example/index.html?...">
</iframe>
```

Do **not** restore eager `src=` loading for simulator iframes.

The parent player must boot first and call `ensureFrameLoaded()` for the active software. This prevents the historical race where a child posts `ENGINE_READY` before the parent is listening.

Do not load every simulator at page startup.

## 5. Boot/readiness protocol is mandatory

Every new simulator must work even if its first readiness message is missed.

It must either load or be compatible with:

`simulator/shared/boot-protocol.js`

Required behavior:

- send `ENGINE_READY` after initialization
- answer `SIM_PING` / `SIM_BOOTSTRAP` with another `ENGINE_READY`
- accept repeated readiness probing without resetting visible state
- never depend on a one-shot startup message

The parent may also recover a fully loaded same-origin iframe. Do not break that fallback.

## 6. Package before replay

The simulator must accept:

`SIM_PACKAGE`

before lesson reconstruction.

Package state is the baseline project/application state. It should contain enough realistic data so a user who jumps directly into a middle lesson sees meaningful UI.

Never make the user traverse earlier lessons merely to populate a screen if the chapter is intended to begin from an already-developed project.

## 7. Cumulative deterministic replay

`SIM_SEEK` represents the cumulative lesson actions for that software through the requested global step.

Required behavior:

1. reset from the package baseline
2. replay historical actions deterministically
3. do historical actions silently
4. animate only the final action when requested
5. end in the same state every time for the same package + step list

Do not use random values, current time, network calls, or nondeterministic IDs for lesson-visible state unless the lesson explicitly needs them and the result is controlled.

## 8. Historical replay must be visually silent

During reconstruction:

- no toast spam
- no modal flicker
- no scroll jumping through old actions
- no highlight flashing
- no focus stealing
- no repeated explanation changes
- no visible typing for historical actions

Only the final current lesson may animate.

For engines with async rendering, send:

`SIM_SEEK_DONE`

after the final rendered state exists. The parent can then apply final guidance/explanation.

## 9. Explanation box is mandatory for every software

Every simulator must support `SIM_EXPLAIN`.

Preferred markup:

```html
<aside data-sim-explanation class="hidden">
  <div data-sim-explanation-drag>
    <strong data-sim-explanation-title>Lesson explanation</strong>
    <button data-sim-explanation-min>−</button>
    <button data-sim-explanation-close>×</button>
  </div>
  <div data-sim-explanation-body>
    <p data-sim-explanation-text></p>
  </div>
</aside>
```

The shared controller owns:

- drag behavior
- saved position
- viewport clamping
- minimize/close behavior
- common explanation styling

But a simulator should also have a small native `SIM_EXPLAIN` fallback when practical so explanation text still appears if shared-runtime injection is delayed.

A new simulator is **not complete** if lessons work but explanations do not appear.

## 10. Never use giant lesson highlight rectangles

The shared highlighter is the only normal lesson guidance system.

Rules:

- highlight the exact button, tab, row, field, menu item or typed line
- never outline the whole application
- never outline an entire editor, canvas, dialog or pane
- no pulsing/blinking highlight loops
- avoid yellow full-pane borders
- software-internal highlight systems must not compete with the parent highlighter

If an action opens a large surface, target the surface title/tab/specific control instead of the entire surface.

## 11. Auto typing and focus-follow

Auto typing must remain visible without shaking.

- editors: follow the active line near center
- terminals/consoles: keep current command/output near bottom
- use `window.SIM_FOCUS.follow(...)` or an explicit equivalent
- do not attach scroll behavior to generic mutation/highlight classes
- never recenter a terminal after every typed character
- clicking history/output must not steal selection/copy behavior

## 12. User-controlled layout persistence

Lesson replay must not erase the user's chosen geometry.

Preserve when applicable:

- splitter positions
- pane widths/heights
- movable explanation position
- window/panel sizes
- collapsed/expanded persistent UI

Use the shared persistence runtime where appropriate.

Lesson state and user layout state are different concerns.

## 13. Cache resilience

Do not rely on users performing Ctrl+F5.

The player/library use per-page boot tokens for fresh runtime/data loads. New simulator loading must remain compatible with that system.

Do not solve updates by endlessly adding manual `?v=41`, `?v=42` values as the primary strategy.

A normal reload must load the current deployed lesson/runtime/simulator state.

## 14. Capability registry for future transcript expansion

Major simulators should have `capabilities.js`.

The registry should describe what the simulator can visibly do, not only what action strings exist.

Future transcript workflow:

1. extract required visible interactions
2. compare them against that software's capability registry
3. reuse existing capabilities
4. add missing capability inside that software only
5. add an engine action if needed
6. add lessons only after the UI/action is implemented
7. revalidate all old lesson actions

Do not claim "future compatible" merely because an action switch can accept arbitrary strings.

## 15. Actions must produce visible UI

A supported lesson action is not valid if it only mutates hidden JavaScript state.

Examples:

- `openClientConnections` must visibly open Client Connections
- `openTmdlView` must visibly display TMDL View
- `openModelView` must visibly show model tables/relationships
- `openTableEditor` must visibly show the table editor

If the lesson title says something happened, the user must be able to see it.

## 16. Populate realistic mid-project baselines

For feature-tour chapters, prefer a realistic project already in progress.

Include realistic:

- files/tables/items
- rows/data
- open tabs
- relationships
- results/logs
- saved connections
- project metadata
- application-specific objects

Avoid an empty white canvas for dozens of lessons unless the lesson specifically teaches starting from blank.

## 17. UI fidelity and icons

Do not measure fidelity from action count alone.

Evaluate separately:

- shell/layout
- menus
- toolbars
- icons
- editors
- dialogs
- trees/grids
- specialized designers
- administration surfaces
- interaction behavior

Use product-appropriate SVG icons or equivalent visuals. Avoid emoji/Unicode placeholders when the product has recognizable professional toolbar/object icons.

Never report 92% merely because 92% of actions exist.

## 18. Lesson integration rules

Before committing a new chapter:

- verify global step start/end
- verify chapter number
- verify book number and chapter range
- never overwrite another book's metadata
- verify every lesson action is advertised by the engine
- verify every action has a visible implementation
- verify direct jump to the middle of the chapter reconstructs correctly
- verify Next / Prev / Replay
- verify switching from another software chapter
- verify explanation appears
- verify no hard refresh is required

## 19. Regression checklist before push

At minimum test or source-validate:

- JavaScript syntax
- iframe/player wiring
- package ID
- all unique chapter action names
- direct jump to first chapter step
- direct jump to a middle step
- direct jump to last step
- normal reload
- software transition from previous chapter
- software transition to next chapter
- explanation show/minimize/close
- no broad highlight rectangles
- no replay blinking
- no stale auto-typing focus
- no missing content after normal reload
- capability registry present/current
- GitHub Pages build for the exact final commit

Do not say "deployed" until the Pages run for the exact final SHA succeeds.

## 20. Do not paper over bugs with hard refresh instructions

If normal reload shows "Waiting for package", a blank/default app, missing explanation, stale data, or old UI, treat that as a product bug.

Fix:

- boot ordering
- readiness recovery
- package delivery
- lazy iframe loading
- cache strategy
- replay sequencing

Do not make Ctrl+F5 part of the expected user workflow.

## 21. Completion definition

A new software integration is complete only when all of these are true:

- correct software-specific UI exists
- realistic baseline exists
- lessons visibly change UI
- cumulative replay is deterministic
- direct middle-step navigation works
- normal reload works
- explanation box works
- final guidance is precise and non-blinking
- capability registry supports future additions
- no other simulator UI is altered
- exact final commit is pushed
- exact final Pages deployment succeeds
