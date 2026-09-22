# SQL Server Management Studio simulator

This simulator owns its UI. Do not implement SSMS visual behavior in `simulator/shared/` or in another simulator.

## Transcript expansion workflow

1. Read the new SSMS transcript and list every visible interaction.
2. Compare those interactions with `capabilities.js`.
3. Reuse an existing SSMS capability when possible.
4. If something is missing, add the capability inside this folder only.
5. Add lesson actions only after the SSMS engine advertises support for them.
6. Revalidate every existing SSMS lesson action before deployment.

## Adaptive surfaces

`capabilities.js` contains SSMS-specific definitions for context menus, nested submenus and tool-window catalogs.

`engine.js` implements the behavior and state.

`index.html` and `ssms-light.css` own the visual presentation.

Supported adaptive lesson actions include:

- `openContextMenu`
- `chooseContextMenuPath`
- `openAdaptiveDialog`
- `setAdaptiveField`
- `selectAdaptiveOption`
- `showObjectDependencies`
- `showServerProperties`
- `openToolWindow`
- `setToolWindowPinned`
- `openTemplateExplorer`
- `openSolutionExplorer`
- `openPropertiesWindow`
- `showLiveQueryStatistics`
- `showStandardReport`
- `setConnectionColor`

These are SSMS capabilities, not shared UI primitives.

## Manual SSMS interactions

The query editor, result grid, server/database nodes, tables, views, stored procedures and functions support SSMS-style right-click context menus. Nested menu paths are defined in `capabilities.js`.

Object Dependencies uses a dedicated SSMS modal with dependency direction controls and a dependency tree.

Template Explorer, Solution Explorer, Registered Servers and Properties use the SSMS-owned tool-window surface.

## Navigation

Normal lesson Left/Right navigation is restored after SSMS auto-typing releases editor focus. Alt+Left and Alt+Right are also available from the outer player as a fallback even when an SSMS text field is focused.
