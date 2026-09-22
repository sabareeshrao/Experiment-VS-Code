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
