# IntelliJ IDEA enterprise microscopic evidence

Advanced IntelliJ actions implemented in `simulator/intellij/enterprise-ui.js` are split by domain.

Read `index.json`, resolve the canonical action through `action_to_domain`, then open only that domain JSON. Each domain file contains action-specific observed data keys, state paths, source snippets, shared handler evidence, replay limitations, and authoring rules.

The ordinary `features/<action>.json` file remains the first capability contract. This folder supplements it when the main engine handler is absent.
