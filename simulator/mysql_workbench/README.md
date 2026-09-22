# MySQL Workbench simulator

Target lesson-relevant UI fidelity: **92%**.

This simulator owns its own MySQL Workbench UI and capability registry. Shared repo infrastructure may provide navigation, explanation controls, persistence, and focus-follow behavior, but Workbench menus, inspectors, editors, modeling surfaces, wizards, icons, and administration screens stay in `simulator/mysql_workbench/`.

## Future transcript workflow
1. Extract the visible Workbench interaction required by the lesson.
2. Check `MYSQL_WORKBENCH_CAPABILITIES`.
3. Reuse an existing action/capability when possible.
4. Add a missing Workbench-specific capability here once.
5. Add lesson actions only after the engine advertises them.
6. Revalidate all existing MySQL Workbench lesson actions.

## Major surfaces
SQL Editor, Navigator, Result Grid, Action/Text/History output, Table Editor, Schema/Table Inspectors, Users & Privileges, Server Administration, Performance Dashboard/Reports, Visual EXPLAIN, EER Modeling, Reverse/Forward Engineering, Migration, Import/Export, Options File, Startup/Shutdown, and Preferences.
