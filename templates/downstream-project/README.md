# Downstream Project Template

Use this folder as a reference when connecting a new project repository to the central master:

`sabareeshrao/Experiment-VS-Code`

Do not deploy this folder directly from the master repo.

A new downstream repo should copy/adapt:

- `MASTER_SOFTWARE_REF.example` → `MASTER_SOFTWARE_REF`
- `deploy-pages.yml` → `.github/workflows/deploy-pages.yml`

Then provide its own project curriculum/source and its own `scripts/build-player-data.*` adapter.

Read `../../PROJECT_INTEGRATION_RULES.md` before using this template.
