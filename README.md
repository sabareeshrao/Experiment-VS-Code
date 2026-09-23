# Developer Playback Simulator

This repository is a browser-based software-development playback platform built with static HTML, CSS and JavaScript. It is not a Java application build, React application, or npm project.

## Current course

The current `lessons.js` timeline contains five books and twelve chapters covering Java development and a growing set of developer tools. Books are navigation/grouping only; the global lesson timeline remains canonical and simulator state is reconstructed cumulatively.

The player is `player.html`. The library/bookshelf is `index.html`.

## Simulator architecture

`app.js` is the playback orchestrator. It switches software, reconstructs state, routes lesson actions, handles navigation, and communicates with same-page simulator iframes.

Each simulator owns its product UI:

- IntelliJ IDEA
- VS Code
- pgAdmin
- Postman
- Command Prompt
- Linux
- SQL Server Management Studio
- Jira
- Jenkins
- Power BI Desktop
- Git
- GitHub
- GitHub Actions
- MySQL Workbench

Product-specific DOM, CSS, menus, dialogs, trees, grids and behavior must remain inside that simulator's folder. Shared code under `simulator/shared/` may provide mechanics such as highlighting, explanation positioning, focus-follow and layout persistence, but must not implement a generic cross-product visual UI.

The core message protocol is:

```text
lessons.js
    ↓
app.js
    ├─ SIM_PACKAGE
    ├─ SIM_SEEK
    ├─ SIM_EXPLAIN
    └─ SIM_HIGHLIGHT
        ↓
simulator iframe
        ├─ ENGINE_READY
        └─ SIM_NAVIGATE
```

The machine-readable simulator contract is `simulator/action-contract.json`. Capability metadata lives in `simulator/adaptive-capabilities.json`.

## Deterministic playback rule

Step N must be reproducible from a clean page load. The player sends each active simulator all of that simulator's applicable actions through the current global step. Books never reset software state.

`View Full Code` is a separate finished-project/reference view and must not contaminate timeline state.

## Validation

No npm install is required. Run:

```bash
node scripts/validate-repo.cjs
```

The validator checks:

- required runtime files
- JavaScript syntax
- book/chapter coverage
- lesson structure
- registered software routes
- player iframe registration
- package baseline registration
- adaptive capability registration
- required simulator protocol markers
- every lesson action against the target simulator's supported actions
- packaging workflow completeness

GitHub Actions runs the same validation on pushes to `main` and on pull requests.

## Packaging

`.github/workflows/package-simulator.yml` validates before packaging and produces:

- `IntelliJ-Simulator-UI` — IntelliJ product files plus the shared mechanics it requires
- `Experiment-VS-Code-Trial` — complete runnable library/player/simulator/project package

The complete trial package includes `player.html`, `library.js`, and `library.css`.

## Adding or upgrading a simulator

1. Modify only that product's simulator folder for product UI behavior.
2. Register new supported actions in that simulator before lessons use them.
3. Update `simulator/action-contract.json` only when adding a new software application or changing its integration identity.
4. Update `simulator/adaptive-capabilities.json` when capability metadata changes.
5. Run `node scripts/validate-repo.cjs`.
6. Prefer a feature branch and pull request for large or externally generated upgrades.

Do not create a shared generic menu/dialog/tree/grid implementation across products.

## Project source

The editable Java Practice reference source is under `project/`. Browser-ready serialized project state is under `project-data/`.

## GitHub Pages

GitHub Pages serves the static application from the repository. The root library links into `player.html`, which hosts the simulator iframes.


## Java enterprise workflow fidelity

Frameworks and libraries without a meaningful standalone desktop application stay inside the software where developers actually use them. The repository targets at least **90% hands-on workflow fidelity** rather than exhaustive API coverage.

`simulator/java-enterprise-capabilities.json` tracks JDK/JVM, Maven, Gradle, Spring, JUnit 5, Mockito, JPA/Hibernate, Spring Security/JWT/OAuth2, RestTemplate/WebClient/OpenFeign, Resilience4j/Spring Retry, Flyway/Liquibase, logging, Tomcat, SOAP, and Linux kubectl workflows.

The repository validator rejects an enterprise domain below the 90% target or an action that its target simulator does not advertise.

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
