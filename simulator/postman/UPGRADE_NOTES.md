# Postman Simulator Upgrade

This build expands the simulator from the core REST-request workflow into a broader Postman-style platform surface while preserving the playback protocol (`SIM_PACKAGE`, `SIM_SEEK`, `SIM_EXPLAIN`).

## Added / completed
- Expanded modern toolbar and sidebar navigation for Collections, APIs, History, Flows, Mocks, Monitors, Reports, Agent, and platform tools.
- Request Save control and richer request settings.
- Live HTTP mode using browser `fetch` where CORS permits, plus simulated HTTP playback for deterministic lessons.
- Auth workflows: Bearer, Basic, API Key, OAuth 2.0, JWT Bearer, AWS Signature, inherited auth.
- Pre-request and post-response script simulation for common `pm.*` variable and test patterns.
- Detailed test results, examples, Postman Console, cookies, advanced cookie attributes, history.
- Variables across global/environment/collection/local scopes plus variable metadata.
- Collection Runner data, results, performance testing, scheduled runs.
- Postman CLI / Newman simulation.
- Import: cURL, collections, OpenAPI, HAR; export and code snippets.
- Mock servers, response matching metadata, call logs.
- Monitors, run history, regions/alerts configuration.
- GraphQL query/variables/schema explorer.
- WebSocket configuration, protocols, message history.
- gRPC proto/reflection/service/metadata/unary/stream simulation.
- Vault, package library, Visualizer.
- Workspaces, sharing, comments, collection forks, pull requests.
- Spec Hub, request validation, collection generation from specs.
- Postman Flows canvas with blocks/connections/run state.
- Certificates and proxy configuration.
- Git integrations, reports/analytics, APIs hub, agent surface.
- Romanized Telugu lesson explanation panel with drag/minimize/close support.
- Fixed advanced-feature state initialization and all previously dangling UI references.

## Playback API
The engine now advertises 179 supported playback actions and every advertised action has a matching implementation case.

## Important limitation
`sendLiveRequest` / live mode uses browser `fetch`, so browser CORS and security rules still apply. For fully deterministic teaching playback, lesson-defined responses remain the preferred mode.
