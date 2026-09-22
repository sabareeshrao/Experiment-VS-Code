# Jenkins educational simulator

Open **preview.html** in Chrome or Edge after extracting the ZIP. It includes a sample workspace, lesson playback, previous/next controls, a step slider, a feature selector, and both themes. You can also interact with the simulator directly: create a project, change configuration, build with parameters, inspect a failed test, or install a sample plugin.

For a course player, keep **index.html**, **engine.js**, and **jenkins.css** together. There are no runtime dependencies, external stylesheets, downloaded fonts, or network requests. The preview and tests are optional integration files.

## What's included

| Area | Added behavior |
| --- | --- |
| Workbench | Readable Jenkins-style layout, original SVG icons, light/dark themes, clickable navigation and breadcrumbs, sortable/filterable projects, views, build history filtering |
| Job management | New Item, Pipeline/Freestyle/Folder/Multibranch types, copy, rename, move, disable, enable and delete |
| Configuration | Editable fields, Save/Apply, basic validation, SCM settings, triggers, variables, parameters, script, post-build settings and approval configuration |
| Script tools | Jenkinsfile editing with line numbers and Tab indentation; highlighted preview; basic delimiter checks; Pipeline snippet generator |
| Builds | Build Now, typed parameter inputs, new build numbers, queue/cancellation, agent capacity, abort, replay, restart from stage, keep/delete and approval prompts |
| Pipeline | Stage statuses/durations, connected stage cards, nested parallel branches, per-stage logs and errors |
| Console | Dedicated view, line numbers, supplied timestamps, search highlighting, follow/pause and text log download |
| Reports | Test suites, filtering, failure messages/stack traces, build duration charts and failure trends |
| Files | Workspace folder navigation, supplied source previews/downloads, artifact details/downloads, commit file diffs |
| Administration | Editable credentials, domains/scopes, node/agent forms/logs, tools, system settings, security settings and shared libraries |
| Plugins | Installed/Available/Updates tabs, filtering, selection, simulated installation/update progress, enable/disable/uninstall |
| Organization | Folder/view editing and membership, branch/PR details, sample repository scans and scan logs |
| Keyboard | Ctrl/Cmd+K commands/projects, arrow-key selection, Enter, Escape and modal focus containment |

On the Plugins page, **Apply to selected** installs available plugins, updates plugins on the Updates tab, or enables selected installed plugins. All changes are in memory. Reset or a new lesson seek restores the package baseline.

## Playback contract

All **77 original playback actions** and **13 original HTML IDs** are retained. The existing `ENGINE_READY`, `SIM_PACKAGE`, `SIM_SEEK`, and `SIM_SETTING` messages remain supported. No original action was renamed.

```js
iframe.contentWindow.postMessage({
  type: 'SIM_PACKAGE',
  package: { apps: { jenkins: lessonState } },
  theme: 'light',
  autoType: true
}, '*');

iframe.contentWindow.postMessage({
  type: 'SIM_SEEK',
  steps: [
    { action: 'openJob', data: { name: 'web-api' } },
    { action: 'openBuild', data: { job: 'web-api', number: 24 } }
  ],
  animateFinal: true,
  autoType: true
}, '*');
```

`SIM_SEEK.steps` is cumulative: the simulator resets from the original package and applies the entire list. Seeking or replacing a package cancels older animation and simulation timers. Theme changes use `{ type: 'SIM_SETTING', key: 'theme', value: 'dark' }` or `light`.

Additional actions:

| Action | Data |
| --- | --- |
| `openConsole` | `{ job, number }` |
| `setApproval` | `{ job, number, pending, message }` |
| `approveBuild` | `{}` for the active build |
| `setWorkspaceFiles` | `{ job, files: [{ path, content }] }` |
| `setJobChanges` | `{ job, changes: [{ hash, message, author, files: [{ path, diff }] }] }` |
| `openCommandPalette` | `{}` |
| `createJob` | `{ name, type, description, config, parameters, stages }` |
| `setStageDetails` | `{ job, number, name, status, duration, log, branches }` |

The complete original action list is in `tests/original-contract.json` and the ready message's `actions` array.

## Supplying richer lesson data

`tests/fixture.cjs` contains a full sample package. Important optional fields:

- Parameters: `{ name, type: 'String' | 'Boolean' | 'Choice', default, choices, description }`.
- Stages: `{ name, status, duration, log, branches: [{ name, status, duration, log }] }`.
- Tests: `build.testResults = { total, passed, failed, tests: [{ name, suite, status, duration, message, stackTrace, output }] }`.
- Workspace: `job.workspace = [{ path, content }]`. Paths are relative and use `/`.
- Artifacts: `build.artifacts = [{ name, size, content, mime, description }]`. Downloads require supplied `content`; metadata alone never produces a fake file. This implementation downloads supplied text, not binary archive payloads.
- Nodes: `{ name, online, executors, labels, remoteFS, launchMethod, log }`. A configured agent label must match an online agent with free executor capacity. Without nodes or an agent label, interactive builds use an in-memory lesson executor.
- Branches: `{ name, status, pullRequest, job, log }`. A `job` reference links to a supplied project. `discoveredBranches` optionally supplies the next scan result.
- Plugins: `{ id, name, description, version, availableVersion, installed, enabled }`. Only supplied catalog entries appear.

An interactive build progresses only when its job provides simulation events:

```js
job.simulation = {
  events: [
    { afterMs: 500, progress: 40, console: 'Build complete' },
    {
      afterMs: 1500,
      status: 'success', progress: 100, duration: '12 sec',
      console: 'Tests passed\nFinished: SUCCESS',
      stages: [{ name: 'Build', status: 'success', duration: '12s' }]
    }
  ]
};
```

Events may also supply `testResults`, `artifacts`, `durationSeconds`, and `logTimestamps`. Delays are bounded to 30 seconds per event. Approval prompts hold pending events until Proceed; Abort prevents remaining events. With no events, the build stays running until a lesson action updates it or the user aborts it. The preview supplies explicit demonstration outcomes.

## Verification

Run `node tests/browser-checks.cjs` with Playwright available to Node and Chrome installed. Use `NODE_PATH` for an existing Playwright installation, `BROWSER_CHANNEL=msedge` to use Edge, and `JENKINS_ARTIFACT_DIR` to choose where screenshots are saved. No production package installation is needed. Run `node tests/build-preview.cjs` to regenerate the preview.

Validation on September 22, 2026: all 22 browser scenarios passed, with zero runtime errors and zero failed asset requests. JavaScript syntax and original-contract checks passed.

The checks exercise project management, saved forms and validation, typed parameters, build lifecycle, queues and agents, approval, stage logs, console search/downloads, timer cancellation and repeated seeks, test reports, source/artifact downloads, diffs, credentials, plugin actions, system/security/library forms, folder/view membership, branches, keyboard navigation, themes and layouts at 500–1920 pixels wide. Original action names and HTML IDs are also checked.

## Scope

This is a local educational simulator, not a Jenkins controller. It does not execute Groovy or shell commands, connect to repositories/agents, schedule cron jobs, receive webhooks, install real plugins, or enforce authentication/authorization. Credential fields are sample data in browser memory; use placeholders. Script checks cover simple structure only, and the syntax preview is lexical rather than a Groovy language service.

These are functional simulations of common workflows. Exact fidelity varies with Jenkins versions and plugins. The outer course player and production lesson packages were not supplied, so their integration needs verification in the full application.

References: [Jenkins project workflows](https://www.jenkins.io/doc/book/using/working-with-projects/), [Pipeline](https://www.jenkins.io/doc/book/pipeline/getting-started/), [plugin management](https://www.jenkins.io/doc/book/managing/plugins/).
