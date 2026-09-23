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
