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
- IntelliJ simulator: `/simulator/`
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
