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
