# IntelliJ IDEA microscopic feature catalog

This is the canonical AI-facing capability source for the IntelliJ simulator. **One JSON file = one feature/action-level capability.**

Future AIs must open the exact feature file before writing lesson action data. Each file records canonical actions, exact action.data keys read by the current handler, state/UI refs, helper functions, visible surfaces, replay/focus behavior, project-effect classification, source evidence, regression coverage, and explicit limitations.

## Continuity truth

Today the player loads the IntelliJ package baseline and replays every prior IntelliJ action through `SIM_SEEK`. Historical actions are silent and the final action may animate/focus.

Not implemented yet: `projectImpact: build|temporary|inspect`, checkpoints/snapshots, semantic class/method anchors. `typeCode` currently supports textual `marker` + relative `position`, computes affected lines, and follows them with shared focus.

## Visual contracts

- Clickable UI: persistent blue boundary, no glow, no timeout.
- Code/SQL/text: strong flat shared line emphasis + left marker, no per-line box.
- IntelliJ terminal current command: yellow rectangular emphasis.
- Explanation: one parent-owned global explanation component.
- Project tree: long labels stay one line and scroll horizontally.
- Layout: user-resized panes persist; replay must not shake/reset them.

Regenerate with `node scripts/build-intellij-microscopic-features.cjs` after IntelliJ engine/action changes.

## Enterprise action evidence

Advanced Java/Spring actions implemented in `enterprise-ui.js` are split under `features/enterprise/`. Read `features/enterprise/index.json`, resolve the canonical action through `action_to_domain`, then open the matching domain JSON before authoring `action.data`. Enterprise domain files use exact conditional-branch extraction so action-specific keys are not inferred from neighboring actions. `enterprise-action-evidence.json` remains only as a compatibility router.

## Lesson navigation keyboard contract

Inside simulator UIs, plain **Left Arrow = previous lesson** and **Right Arrow = next lesson**, even when an auto-focused or user-edited live text field is active. Text entry keys still edit the field. Parent-player editable controls such as the lesson search box keep normal caret-arrow behavior.
