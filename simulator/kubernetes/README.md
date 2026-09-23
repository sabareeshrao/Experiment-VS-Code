# Kubernetes / Headlamp + kubectl simulator

Target lesson-relevant fidelity: **91%**.

This simulator represents a current Kubernetes workflow using a Headlamp-style resource UI plus an integrated `kubectl` terminal. Both interfaces mutate the same simulator state.

## Architecture

- `index.html`: Headlamp-style application shell
- `engine.js`: deterministic Kubernetes state, resource rendering, kubectl parser, cumulative replay
- `icons.js`: Kubernetes/resource SVG icon registry
- `capabilities.js`: future transcript capability registry

The UI remains Kubernetes-specific. Shared repo infrastructure is used only for boot recovery, explanation controls, final-action highlighting, layout persistence and player navigation.

## Baseline cluster

The lesson package should provide a populated `campus-platform-dev` cluster with realistic namespaces, workloads, networking, storage, configuration, RBAC, metrics and events. Direct middle-step navigation must reconstruct from that baseline.

## Synchronization rule

A UI action and its kubectl equivalent must update the same state. Scaling a deployment in the UI must change `kubectl get deployments`; scaling through the terminal must change the visible Deployment and Pod lists.
