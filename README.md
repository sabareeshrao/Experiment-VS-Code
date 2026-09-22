# Experiment VS Code / IntelliJ Developer Playback

This repository is an experimental **software-development playback simulator**.

## Current phase: UI first

The project is intentionally **not starting any learning stages yet**.

The left progress area currently contains:

- Search
- **View Full Code**

Selecting **View Full Code** opens the complete uploaded **Java Practice** project inside the IntelliJ-style simulator. This gives us a stable finished-project reference so the IDE UI can keep being improved before we author the development timeline.

## Java Practice baseline

The uploaded baseline contains a broad Java practice project covering threads, collections, generics, files, Java 8/21 features, RMI, reflection, inheritance, polymorphism, exceptions, inner classes, interfaces, garbage collection, and more.

- Editable source copy: `/project/`
- Browser-ready complete project snapshot: `/project-data/`
- Software simulators: `/simulator/<software>/`
  - IntelliJ IDEA: `/simulator/intellij/`
  - VS Code: `/simulator/vscode/`
  - pgAdmin: `/simulator/pgadmin/`
  - Postman: `/simulator/postman/`
  - Command Prompt: `/simulator/cmd/`
- Default preview file: `src/Threads/TwoThreads/MyThread.java`

The original archive also contained compiled `.class` files. Those entries are represented in the simulator tree for visual fidelity; the editable `project/` folder focuses on Java source.

## Playback architecture

Later, stages will be added gradually. Each stage will contain developer micro-steps such as creating a file, typing a line, running a command, seeing an error, fixing it, and explaining why that exact action was taken.

When stages are eventually added:

- Step N will reconstruct the repository exactly through Step N.
- Previous/Next will move through developer micro-steps.
- View Full Code will remain available as the finished-project reference.
- IDE features will continue to appear only when the workflow reaches the stage that needs them.

## IntelliJ UI

The simulator uses a dark IntelliJ IDEA New UI-style shell and is being improved iteratively. Current goals include realistic Project structure, editor/gutter behavior, syntax colors, terminal/tool windows, responsive sizing, and a non-blocking explanation assistant.

## GitHub Pages

Publish `main / (root)` from **Settings → Pages**.


## Multi-software experiment

Lesson 2 is a seven-step proof that one development timeline can move across applications:

```text
IntelliJ IDEA
  → pgAdmin 4
  → PostgreSQL Query Tool
  → IntelliJ IDEA
```

Each step declares its active software. The outer player keeps the lesson/stage navigation constant while it switches the center simulator. Direct step URLs reconstruct only the actions belonging to the active application through that point, so returning to IntelliJ restores the Java project state instead of starting a new lesson.


## Bookshelf / book navigation

The repository root is the journey library. The playback simulator lives at `player.html`.

Books are an organizational layer only. They must never create a separate lesson timeline or reset simulator state. A chapter always maps to its existing stage, and opening that chapter uses the first global step of the stage. The player then reconstructs all applicable earlier actions through that global step.

Book ranges are declared in `window.COURSE.books` inside `lessons.js` using `chapterStart` and `chapterEnd`. Future books can therefore group hundreds of stages without changing the cumulative playback engine.

The player stores the last visited global step under `developerJourney.lastStep.v1`, allowing the landing page to offer a Continue action.
