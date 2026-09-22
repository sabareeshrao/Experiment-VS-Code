# Simulator Library

Each simulated desktop application lives in its own folder so the lesson player can switch software without mixing implementation files.

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
  cmd/

The outer player keeps stable iframe IDs and routes lesson steps by each step's software value.
Moving files inside these folders must not change application IDs or the SIM_PACKAGE / SIM_SEEK / SIM_EXPLAIN message protocol.
