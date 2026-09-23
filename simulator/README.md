# READ THIS FIRST — Simulator Integration Contract

**Before adding or upgrading any software, read the mandatory root-level `SIMULATOR_INTEGRATION_RULES.md`. Do not create a simulator or lesson chapter until those rules are satisfied.**

# Simulator Library

Each simulated desktop application lives in its own folder so the lesson player can switch software without mixing implementation files.

```text
simulator/
  intellij/
    index.html
    engine.js
    ide-polish.css
  vscode/
    index.html
    engine.js
    vscode.css
  pgadmin/
    index.html
  postman/
    index.html
    engine.js
  cmd/
    index.html
    engine.js
  linux/
    index.html
    engine.js
  ssms/
    index.html
    engine.js
```

The outer player keeps stable iframe IDs and routes lesson steps by each step's `software` value.

Moving files inside these folders must not change application IDs or the `SIM_PACKAGE` / `SIM_SEEK` / `SIM_EXPLAIN` message protocol. Simulators that capture keyboard focus may also send `SIM_NAVIGATE` to the outer player for lesson navigation.


## Universal interaction rules

Every simulator iframe receives the shared runtime automatically from the outer player.

### UI persistence
User-controlled layout must survive lesson reconstruction, Next/Previous, Replay, and software switching. Do not reset panel heights, split widths, window size/position, or other user-chosen geometry from lesson state.

Use:
- `window.SIM_UI_STATE.get(key, fallback)`
- `window.SIM_UI_STATE.set(key, value)`
- or `data-sim-persist="unique-key"` for generic movable/resizable elements.

### Focus-follow during auto typing
Anything being auto-typed or actively demonstrated must stay visible inside its scrollable editor/terminal/panel.

Rules for every current and future simulator:
- Call `window.SIM_FOCUS.follow(...)` from the actual auto-typing/render path. Do not rely on generic highlight-class mutations to move scroll positions.
- Editors/code: follow the current typed/changed line with `{ block: "center" }`.
- Terminals/consoles: follow the current command/output with `{ block: "end", margin: 6 }`. Never re-center the command line after every character.
- A future simulator may opt in declaratively with `data-sim-focus="true"`; the shared observer only watches that explicit marker.
- Highlight only the exact typed code line, terminal command, field, row, or control. Never highlight or scroll an entire editor/window just because one line changed.
- Terminal typing may use a narrow yellow command focus box like IntelliJ/CMD/Linux; it must not outline the full terminal window.

### Explanation box
Do not implement simulator-specific explanation dragging. The shared explanation controller owns dragging, persistence, clamping, sizing, and position.

For future simulators, prefer:
- `data-sim-explanation` on the box
- `data-sim-explanation-drag` on the drag header
- `data-sim-explanation-body` on the body
- `data-sim-explanation-text` on the explanation text

This keeps explanation behavior identical across IntelliJ, VS Code, pgAdmin, Postman, CMD, Linux, SSMS, Jira, Jenkins, and future software.


### Software-owned UI adaptability

Each simulator owns its UI implementation. Do not add a shared visual component system for menus, dialogs, trees, grids, designers, drag/drop or tool windows.

The outer player may standardize only the message/navigation contract. New visual behavior for one product must be implemented inside that product folder and must not modify another simulator's DOM, CSS or interaction model.

A simulator may maintain its own capability registry for transcript-driven expansion. SSMS uses `simulator/ssms/capabilities.js`; future SSMS transcripts should be checked against that registry before lessons are generated. Missing capabilities are added to SSMS only.


## Git / GitHub / GitHub Actions

The Git, GitHub and GitHub Actions simulators are independent software modules.

- Git owns local-repository state: working tree, staging, commits, branches, remotes, merge/rebase, reflog, bisect, blame, LFS, submodules and worktrees.
- GitHub owns hosted collaboration state: repositories, files, commits, branches/tags/releases, issues, pull requests/reviews/checks, projects, discussions, security, insights and repository settings.
- GitHub Actions owns workflow automation state: YAML workflows, dispatch inputs, runs/jobs/steps/logs, artifacts, annotations, caches, environments/approvals, secrets/variables and runners.

Future lesson UI additions must stay inside the corresponding software folder.

## Global resize and layout rule

Every simulator must load `simulator/shared/layout-resize.js`.

For every current and future software simulator:

- visible left/right side panes must be draggable whenever viewport space allows
- resize hit areas must be easy to grab; do not require one-pixel pointer accuracy
- pane sizes must have sane minimum and maximum bounds so the main workspace cannot disappear
- user-adjusted sizes persist independently for that software
- saved pane sizes restore after page reload, `SIM_PACKAGE`, `SIM_SEEK`, and responsive resize
- product-specific DOM/CSS stays inside the simulator; only resize/persistence mechanics are shared
- software with no side pane still loads the runtime for common layout/focus behavior

When a new simulator uses a unique layout, extend `layout-resize.js` with a product-specific setup function instead of putting resizing logic in `app.js`.
