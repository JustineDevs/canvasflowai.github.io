# Research: CanvasFlow AI MVP

## Decision: Static-first frontend with no-provider core flow
Rationale: The frontend must run on GitHub Pages and remain useful without any remote service.
Alternatives considered: Runtime backend proxy in the same deployment lane | rejected because the
static host cannot securely handle server-side provider mediation.

## Decision: Cloudflare Workers for backend web services
Rationale: Trusted cloud-provider calls need a separate server-side boundary for secret handling,
prompt sanitization, and provider normalization without abandoning static frontend deployment.
Alternatives considered: Next.js API routes in the same frontend host | rejected because the MVP
deployment lane is static export and should not depend on serverful frontend hosting.

## Decision: `react-konva` for editor interactions
Rationale: The MVP needs drag, resize, layering, and grouped scene rendering more than vector
authoring or export tooling.
Alternatives considered: Fabric.js | rejected for MVP because the React integration path is less
direct for a lightweight scene editor shell.

## Decision: Deterministic prompt summary from serializable scene state
Rationale: Predictable summaries are testable, explainable, and resilient when no provider is
configured.
Alternatives considered: Free-text prompt authoring | rejected because it weakens the core visual
translation value proposition.

## Decision: Export readiness metadata before full asset generation
Rationale: Users still need a reliable preview and size-readiness signal even when rendering is
deferred or unavailable.
Alternatives considered: Full rendering in MVP | rejected because provider integration and media
compression would dominate the first release.

## Decision: Provider adapters behind a uniform interface
Rationale: The UI should expose provider states without binding the editor to any one local or
cloud implementation.
Alternatives considered: Direct provider logic in UI components | rejected because it couples the
first build slice to future integrations.
