# Redis Insight simulator

Standalone Redis Insight UI simulator targeting roughly 90% visual fidelity to the Redis Insight 3.x refreshed interface.

## Intent

This folder is intentionally isolated. It is **not integrated** into the main player, lessons, routing, or application registry yet.

Do not modify `player.html`, `app.js`, or `lessons.js` for Redis until integration is explicitly requested.

## Files

- `index.html` — standalone shell
- `redis.css` — Redis Insight-style visual system and workspace layouts
- `engine.js` — local state, Browser, Workbench, Search, Analyze, Pub/Sub and CLI behaviors
- `capabilities.js` — feature/action registry prepared for future playback integration

## Implemented UI

- Redis Insight 3.x-style top navigation
- Database switcher and connection surface
- Browser with key search, type filtering, TTL/size metadata and typed key inspector
- String, Hash, JSON, List, Set, Sorted Set and Stream views
- Workbench command editor and result view
- Dedicated Search workspace with index navigation, Explain and Profile surfaces
- Analyze workspace with memory stats, Slow Log, Profiler and recommendations
- Pub/Sub subscriptions and message publishing
- Docked Redis CLI with basic realistic command responses
- Settings/help/database dialogs, toasts and keyboard shortcut behavior

## Future integration

The engine already recognizes the intended simulator id `redis` and contains optional handling for `SIM_PACKAGE`, `SIM_SEEK`, `SIM_EXPLAIN`, and `SIM_READY`. None of those are wired into the outer application yet.

The feature set is based on current Redis Insight documentation and 3.x release notes, including the refreshed top-level navigation and dedicated Search workspace introduced in the 3.x line.
