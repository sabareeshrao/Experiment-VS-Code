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

Use:
- `window.SIM_FOCUS.follow(element, { block: "center" })` while typing
- or mark the active element with `data-sim-focus="true"`

The shared runtime also follows common focus classes such as `.sim-emphasis`, `.terminalCommandFocus`, `.focusLine`, `.codeLine.focus`, `.codeLine.changed`, and `.sim-code-change`.

### Explanation box
Do not implement simulator-specific explanation dragging. The shared explanation controller owns dragging, persistence, clamping, sizing, and position.

For future simulators, prefer:
- `data-sim-explanation` on the box
- `data-sim-explanation-drag` on the drag header
- `data-sim-explanation-body` on the body
- `data-sim-explanation-text` on the explanation text

This keeps explanation behavior identical across IntelliJ, VS Code, pgAdmin, Postman, CMD, Linux, SSMS, Jira, Jenkins, and future software.
