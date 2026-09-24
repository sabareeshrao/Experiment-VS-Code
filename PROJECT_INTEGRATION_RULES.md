# Downstream Project Integration Rules — READ BEFORE BUILDING A NEW PROJECT

These rules define how every current and future learning/project repository must use `sabareeshrao/Experiment-VS-Code` as the central software/runtime master.

The purpose is to let every project keep its own repository, source, curriculum, Git history and GitHub Pages URL while reusing one centrally maintained playback/runtime/simulator system.

---

## 1. Architecture is master runtime + independent project content

The required architecture is:

```text
sabareeshrao/Experiment-VS-Code
CENTRAL MASTER
    │
    ├─ Library/player shell
    ├─ replay/loading/cache infrastructure
    ├─ global explanation system
    ├─ highlighter/focus/layout infrastructure
    └─ software simulators
            │
            ▼
Downstream Project Repository
    ├─ its own source/reference project
    ├─ its own curriculum/questions
    ├─ its own books/chapters
    ├─ its own project baseline/package data
    ├─ its own Git history
    └─ its own GitHub Pages site
```

A downstream repository is **not a forked software platform**. It is project content rendered through the master platform.

---

## 2. Master repository owns reusable software/runtime

The authoritative copies of reusable platform files live only in:

`sabareeshrao/Experiment-VS-Code`

The master owns:

- `index.html`
- `library.js`
- `library.css`
- `player.html`
- `app.js`
- `styles.css`
- `simulator/`
- global explanation behavior
- boot/readiness recovery
- lazy iframe loading
- cache resilience
- cumulative replay
- highlighting
- focus-follow/autotyping infrastructure
- global/shared layout mechanics
- simulator capability/action contracts

If IntelliJ, Kubernetes, MySQL Workbench, Redis, GitHub, Jenkins, or another software needs a fix, make the fix in the master repository.

Do not maintain a second editable copy in a project repository.

---

## 3. Downstream project owns project-specific content

A downstream project owns its own:

- source/reference project
- curriculum source
- books and chapters
- lessons/questions
- lesson order
- project-specific package/baseline state
- project-specific generated browser data
- build adapter/generator
- project documentation
- deployment workflow
- Git history

A master update must never delete, replace, renumber or silently rewrite downstream project curriculum.

---

## 4. Never copy master curriculum into a downstream project

The following master files/directories are **not downstream curriculum**:

- master `lessons.js`
- master `lesson-json/`
- master `project/`
- master `project-data/`

Do not use them to overwrite a downstream project's content.

The downstream build must combine:

```text
MASTER runtime/software
        +
DOWNSTREAM project curriculum/data
        =
DOWNSTREAM GitHub Pages artifact
```

---

## 5. Every downstream project stays independent

Each project must keep:

- its own GitHub repository
- its own default branch
- its own commits/history
- its own GitHub Pages deployment
- its own Pages URL

Example:

```text
https://sabareeshrao.github.io/Spring-Petclinic/
https://sabareeshrao.github.io/Java-Experience/
https://sabareeshrao.github.io/<Future-Project>/
```

Do not merge unrelated projects into the master repo merely to reuse the simulator platform.

---

## 6. Required downstream master reference

Every downstream repo should contain:

`MASTER_SOFTWARE_REF`

Recommended content:

```text
sabareeshrao/Experiment-VS-Code@<validated-master-commit-sha>
```

Use an exact validated SHA for reproducible deployments.

Do not treat the file as decorative metadata. The deployment workflow should read the SHA from this file and checkout that exact master commit.

A rolling `main` checkout may be used only when the user explicitly chooses automatic latest-master behavior and accepts that downstream deployments can change without a project-content commit.

---

## 7. Required deployment sequence

A downstream Pages build should perform these phases in this order:

### Phase A — checkout downstream project

The workflow checks out the project repository that owns the curriculum.

### Phase B — resolve the master SHA

Read `MASTER_SOFTWARE_REF` and extract the commit after `@`.

### Phase C — checkout master runtime

Checkout:

`sabareeshrao/Experiment-VS-Code@<resolved SHA>`

into a temporary build path such as:

`.software/`

### Phase D — create clean Pages artifact

Create a clean output folder such as:

`_site/`

### Phase E — copy reusable master runtime only

Copy from the master:

- `index.html`
- `library.js`
- `library.css`
- `player.html`
- `app.js`
- `styles.css`
- complete `simulator/`

Do **not** copy master curriculum/project data into the downstream artifact unless the downstream project explicitly needs a specific generic asset and the contract documents it.

### Phase F — generate downstream project data

Run the downstream project's own generator/adapter.

That generator should create or write the project's:

- `lessons.js`
- project/package data
- project-data files
- full-code/reference data
- any project-specific Library metadata

The downstream data is layered on top of the reusable runtime.

### Phase G — record exact master snapshot

Write:

`_site/software-snapshot.json`

with at minimum:

```json
{
  "repository": "sabareeshrao/Experiment-VS-Code",
  "commit": "<exact-master-sha>"
}
```

### Phase H — deploy this downstream artifact to its own Pages site

The project deploys `_site/` to its own GitHub Pages environment.

---

## 8. Reference GitHub Actions pattern

Use `templates/downstream-project/deploy-pages.yml` as the baseline.

A project may adapt its project-data generation command, but it must preserve the ownership boundary.

The master checkout is build input, not project source ownership.

---

## 9. Required project adapter

Every downstream repo needs a project-owned adapter/generator, for example:

`scripts/build-player-data.py`

or an equivalent Node/Python script.

Its job is to translate that project's curriculum/source into the master player's data contract.

It must not reimplement:

- player navigation
- explanation UI
- simulator UI
- replay orchestration
- highlighter
- shared boot protocol

Those stay in the master.

---

## 10. Global explanation rule applies downstream automatically

Downstream projects do not create their own lesson explanation component.

The master player owns the canonical global explanation card.

A downstream project supplies only lesson content such as:

- title/question
- explanation/why
- optional answer

It must not add project-specific explanation CSS, drag code, resize code, persistence code or per-software explanation boxes.

---

## 11. Simulator capability expansion always goes upstream first

### Detailed capability check

Before declaring a transcript/video feature missing, the downstream AI must:

1. use `AI_CAPABILITY_INDEX.json` only to locate the target software
2. open that software's `simulator/<software>/features/index.json`
3. read the relevant individual feature JSON files
4. confirm canonical actions and visible UI behavior
5. inspect the engine handler for exact action parameters

The short capability summary is not sufficient because many implemented capabilities exist at engine-action level and are cataloged separately.

When a downstream lesson needs a capability that the master does not support:

1. identify the required software and interaction
2. inspect `AI_CAPABILITY_INDEX.json`
3. implement the missing UI/action inside the relevant master simulator
4. update the master capability/action contracts
5. validate the master
6. wait for a successful master package/Pages build
7. update the downstream `MASTER_SOFTWARE_REF`
8. rebuild the downstream project

Do not patch the missing simulator feature only inside one downstream repository.

---

## 12. Do not use a downstream project to fix platform bugs

The following bugs belong in the master:

- blank/stale simulator screens
- "Waiting for package" startup failures
- Ctrl+F5 dependencies
- explanation box instability
- replay flicker
- giant/global highlight rectangles
- simulator lazy-load races
- missing resize/persistence mechanics
- shared navigation bugs
- simulator fidelity/interaction bugs

Fix once in the master, validate, then move the downstream reference forward.

---

## 13. Master upgrade procedure for an existing downstream project

For a controlled upgrade:

1. verify the desired master SHA has:
   - repository validation success
   - package workflow success
   - GitHub Pages success
2. change only the downstream master reference/integration metadata required for the upgrade
3. do not alter downstream curriculum as part of the runtime upgrade
4. deploy the downstream project
5. verify the exact master SHA in `software-snapshot.json`
6. test downstream behavior
7. only then call the upgrade complete

Do not combine a large curriculum rewrite and a master-runtime migration unless explicitly requested.

---

## 14. Required downstream regression test

Before a new project or master upgrade is considered complete, verify:

- project GitHub Pages loads normally
- no hard refresh is required
- first lesson works
- representative middle lesson works
- final lesson works
- direct URL/step jump reconstructs correct state
- Next works
- Previous works
- Replay works
- software transitions work
- current simulator contains expected project state
- no stale "Waiting for package" state
- global explanation card appears
- explanation card remains consistent across software changes
- explanation height adapts to content
- no duplicate explanation cards
- no giant/blinking highlight
- user layout persistence does not get overwritten by replay
- full-code/reference view is project-specific
- downstream curriculum count/order remains unchanged by a runtime-only upgrade
- `software-snapshot.json` contains the expected master SHA

If visual browser testing cannot be performed, state that limitation instead of claiming visual verification.

---

## 15. New project creation checklist

When the user gives an empty/new project repository:

1. inspect the repo first
2. create project-specific source/curriculum structure
3. add `MASTER_SOFTWARE_REF`
4. add the downstream deployment workflow
5. add the project data adapter/generator
6. use the master runtime contract; do not clone simulator source as maintained project files
7. create the project's own books/chapters/lessons
8. make project content the source of truth
9. deploy to the project's own Pages URL
10. verify the regression checklist
11. report:
   - downstream commit SHA
   - master SHA consumed
   - files changed
   - Pages deployment result

---

## 16. Future AI first-read rule

Any AI asked to create, rebuild, migrate, connect or upgrade a downstream project must read this file before making repository changes.

It must also read:

- `AGENTS.md`
- `SIMULATOR_INTEGRATION_RULES.md` when simulator work is required
- `AI_CAPABILITY_INDEX.json` when generating transcript-based lesson actions

The AI must preserve the master/downstream ownership boundary even when the user asks to build quickly.

---

## 17. No automatic fan-out unless explicitly enabled

A master commit does not automatically authorize changing every project repo.

By default:

```text
master validated
      ↓
choose one downstream project
      ↓
update its master reference
      ↓
deploy and verify
```

Automatic fan-out/redeployment may be added later, but only after the user explicitly requests it and the downstream contract has been proven on representative projects.

---

## 18. Completion definition

A downstream integration is complete only when:

- the project remains independent
- its curriculum/source remains project-owned
- runtime/software comes from the validated master
- the exact master SHA is recorded
- Pages deploys successfully
- representative playback flows work
- project-specific content was not replaced by master content
- no duplicate simulator/runtime maintenance was introduced

This is the required architecture for future projects.
