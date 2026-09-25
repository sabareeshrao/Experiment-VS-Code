# AGENTS.md — READ BEFORE CHANGING OR LINKING PROJECTS

This repository is the **central software/runtime master** for the Developer Playback system.

Before making changes, every AI or developer must read:

1. `PROJECT_INTEGRATION_RULES.md` — how downstream project repositories use this master.
2. `SIMULATOR_INTEGRATION_RULES.md` — how software simulators are added or upgraded.
3. `AI_CAPABILITY_INDEX.json` — machine-readable simulator/capability map when creating lessons from transcripts.

## Core rule

**Do not turn a downstream project into another copy of this repository.**

The master owns reusable runtime/software. A downstream project owns its own curriculum and project source.

### Master owns

- `index.html`
- `library.js`
- `library.css`
- `player.html`
- `app.js`
- `styles.css`
- `simulator/`
- shared boot/replay/highlight/explanation/layout infrastructure

### Downstream project owns

- its project source/reference source
- its books, chapters, lessons and questions
- its project-specific package/baseline data
- its curriculum source
- its adapter/generator that produces browser-ready lesson/project data
- its own Git history and GitHub Pages deployment

## New-project rule

When asked to create a new learning/project repository:

1. Keep the project in its **own GitHub repository**.
2. Give it its **own GitHub Pages URL**.
3. Link it to this master using the contract in `PROJECT_INTEGRATION_RULES.md`.
4. Use `templates/downstream-project/` as the starting integration pattern.
5. Never copy master simulator source into the downstream repository as independently maintained source.
6. Never replace the downstream curriculum with this master's `lessons.js` or `lesson-json/`.
7. Build the Pages artifact by combining:
   - reusable runtime from this master
   - project-specific generated curriculum/data from the downstream repo
8. Record the exact master commit used by the deployment.
9. Validate first/middle/last lesson, direct jumps, reload, replay, explanation UI and simulator state before calling the integration complete.

If a downstream lesson requires a missing software capability, implement that capability **here in the master**, validate the master, then update the downstream project's master reference.

Do not silently modify multiple downstream repositories when upgrading the master unless the user explicitly requests propagation.


## Detailed feature-catalog rule

`AI_CAPABILITY_INDEX.json` is now a **routing index only**. It is not sufficient for deciding whether a transcript feature exists.

For every transcript/video requirement:

1. identify the target software
2. open that software's `features/index.json`
3. read the relevant individual JSON file(s) under `simulator/<software>/features/`
4. confirm `canonical_actions`, visible UI contract, implementation source, and lesson-authoring guidance
5. inspect the engine handler before writing `action.data`
6. if no detailed feature file/UI/action supports the transcript behavior, upgrade the master first

Do not mark a capability missing merely because it is absent from the short summary list in `AI_CAPABILITY_INDEX.json`. Engine action-level capabilities are also cataloged as separate feature files.


## Lesson highlight guardrail

Every lesson step must declare an explicit `highlight.kind` of `target`, `code`, or justified `none`; committed `auto` highlights are forbidden. A learner must either see a precise highlighted/pointed target or see `[no highlight]` in both the explanation title and body. Use explicit `code` line highlights whenever the text asks the learner to inspect code. Do not accept a silent missing highlight. See `PROJECT_INTEGRATION_RULES.md` and `lesson-json/examples/highlight-contract.example.json`.
