# Experiment VS Code

A small proof-of-concept for a **software-development playback simulator** hosted as static HTML/CSS/JavaScript.

## Trial project

The simulator walks through five cumulative lessons that build a tiny Java Task API from scratch:

1. Create the application entry point
2. Add the Task model
3. Add the service layer
4. Add the controller layer
5. Wire the application together

Selecting Lesson N shows the repository exactly as it exists after Lessons 1..N.

## Simulator features

- VS Code-inspired interface
- Cumulative project state
- Lesson sidebar
- Previous / Next navigation
- Replay current lesson with typing animation
- Floating explanation card
- Simulated terminal output
- Focus mode
- Browser fullscreen mode
- Direct lesson links using `?lesson=3`

## GitHub Pages

The site is intentionally placed at the repository root. To publish it:

1. Open **Settings → Pages**
2. Under **Build and deployment**, choose **Deploy from a branch**
3. Select **main** and **/(root)**
4. Save

Then the experiment can be opened from the repository's GitHub Pages URL.

The `project/` folder contains the final Java source for comparison. The simulator itself never executes Java; it reconstructs the development experience in the browser.
