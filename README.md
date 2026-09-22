# Experiment VS Code / IntelliJ Developer Playback

This repository is a proof-of-concept for an **interactive software-development playback simulator**.

The outer UI shows project **stages/progress**. Inside each stage are developer **micro-steps**. A step can create a file, type a line or block, open an IDE tool window, run a command, or explain why that exact action is being taken.

## Trial structure

- 5 project stages
- line-by-line / action-by-action steps
- cumulative repository state: step N includes everything built through step N
- dark IntelliJ IDEA simulator
- ChatGPT-style explanation card
- Previous / Next / Replay step controls
- direct links with `?step=N`
- IDE fullscreen mode
- IDE features such as Maven, Run, Terminal, Git, Debug, Tests, and Problems are revealed only when the workflow reaches the stage that needs them

The `project/` directory contains the final Java project for comparison. The browser simulation does not execute Java; it reconstructs the developer workflow using HTML/CSS/JavaScript.

## GitHub Pages

Publish the repository root from the `main` branch in **Settings → Pages**.
