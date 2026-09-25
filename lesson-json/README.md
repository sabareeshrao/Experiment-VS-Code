# Lesson JSON Source

This folder is the canonical source for course lessons.

- `course.json` contains course metadata, books, simulator baseline package data, and the ordered chapter manifest.
- `chapters/*.json` contains one chapter per file.
- `chapter.schema.json` documents the chapter shape.
- `../lessons.js` is generated output for the static browser player.

## Editing rule

Do not hand-edit `lessons.js`.

For an existing chapter, edit its JSON file. For a new transcript-derived chapter, create a new JSON file, append it to `course.json -> chapters`, then run:

```bash
node scripts/build-lessons.cjs
node scripts/validate-repo.cjs
```

The compiler preserves chapter order from `course.json`.


## Mandatory visual-guidance field

Every step must contain `highlight`.

Examples:

```json
"highlight": { "kind": "target", "selectors": ["#runBtn"] }
```

```json
"highlight": { "kind": "code", "lines": [12, 13, 14] }
```

```json
"highlight": {
  "kind": "none",
  "reason": "Theory only; no software-owned visual target exists."
}
```

`auto` is forbidden in committed lesson source. Every step must use an explicit `target`, `code`, or justified `none`. If a declared target unexpectedly cannot resolve at runtime, the player visibly adds `[no highlight]` to both the explanation title and body. Do not tell the learner to inspect code without a `code` highlight.

See `examples/highlight-contract.example.json`.

Run `node scripts/apply-step-highlights.cjs` only as a migration/helper and review its generated selectors before committing. Repository validation rejects `highlight.kind: "auto"`.
