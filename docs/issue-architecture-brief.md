# CanvasFlow AI Architecture Brief

## Objective
Define the high-level structure, architecture system design, semantic codebase rules, and
engineering discipline for CanvasFlow AI so all future implementation issues inherit the same
constraints and patterns.

## Product Shape
- Static frontend application for the primary user experience
- Trusted backend web services on Cloudflare Workers
- Local-first editing and scene persistence
- Optional provider-backed generation behind explicit adapter boundaries

## System Design
### Frontend
- Next.js static export application
- Browser-resident scene editor, prompt summary, save/load, export preview
- No-provider mode must remain fully usable

### Trusted Backend
- Cloudflare Workers own secret-bearing cloud integrations
- Workers sanitize prompts, normalize provider responses, and enforce request limits
- Frontend never stores or proxies trusted provider secrets through static hosting

### Core Domain Boundaries
- `scene-model`: serializable source of truth for composition state
- `prompt-translator`: deterministic semantic translation from scene to prompt summary
- `provider-adapters`: local, cloud, and no-provider contracts
- `export-pipeline`: preview metadata, readiness checks, and later media optimization

## Semantic Codebase Structure
### App Surface
- `app/`: route shell and page entrypoints only
- `src/components/`: presentation and interaction components
- `src/lib/scene/`: domain types, schema, reducer, serialization
- `src/lib/prompting/`: prompt semantics only
- `src/lib/providers/`: provider state and adapter contracts
- `src/lib/export/`: export readiness and future optimization hooks
- `tests/`: behavior-first regression coverage

### Naming Discipline
- Prefer domain names over UI-only names
- Use explicit module names that reflect ownership and boundary
- Keep cross-cutting helpers out of feature modules unless they are genuinely shared

## Strict Discipline
- No production behavior without tests first for new functional slices
- Keep browser-safe logic separate from trusted backend logic
- Prefer deterministic data transforms over hidden side effects
- Preserve static-host compatibility for the frontend unless a deliberate architecture change is approved
- No secret-bearing cloud integration in the frontend bundle
- Small, reviewable slices only; no speculative abstraction layers

## Patterns & Practices
- Use typed scene models as the only source of truth
- Validate imported/exported scene files at the boundary
- Use adapter interfaces for provider integrations
- Keep no-provider mode as a first-class supported path
- Design failure states explicitly: malformed scene, unavailable provider, oversize export, invalid import
- Favor composition over global singleton state
- Document every new subsystem with its boundary, inputs, outputs, and failure modes

## Definition of Done For Architecture Issues
- Boundary is described clearly
- Ownership of modules is explicit
- Trust boundary is identified
- Verification path is stated
- Out-of-scope items are listed

## Follow-On Issue Breakdown
- Frontend shell and scene model
- Prompt translation engine
- Scene persistence and import/export validation
- Provider UX and Cloudflare Worker bridge
- Export optimization pipeline
