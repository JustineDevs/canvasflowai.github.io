# Implementation Plan: CanvasFlow AI MVP

## Summary
Build a static-exportable web application that lets users compose a visual scene, derive a prompt
summary from that scene, save and reload scene files, and preview export readiness without
requiring any configured generation provider.

## Technical Context
- Product surface: Static web application deployed to GitHub Pages or equivalent static hosting
- Trusted backend services: Cloudflare Workers for cloud-provider mediation, request sanitization,
  and secret-managed integrations outside the frontend host
- App framework: Next.js App Router with static export enabled
- Language: TypeScript
- UI styling: Tailwind CSS with a lightweight design token layer
- State management: Local React state with serializable scene models
- Canvas interaction: `react-konva`
- Validation: `zod` scene schema for import/export safety
- Testing: Vitest + React Testing Library
- Export readiness: in-browser draft metadata, with real media compression deferred behind an
  adapter boundary
- Provider strategy: No-provider mode first, local/cloud adapters behind interfaces, with
  Cloudflare Workers as the default backend target for trusted cloud flows

## Constitution Check
- Browser-first surface preserved: PASS
- Deterministic scene semantics preserved: PASS
- Local-first privacy preserved: PASS
- Small, verified increments preserved: PASS

## Phase 0: Research
- Confirm static hosting constraints and keep remote-secret flows out of MVP
- Reserve Cloudflare Workers for future trusted backend calls instead of mixing backend concerns
  into the static frontend
- Validate local image generation is deferred behind adapter boundaries
- Choose a single canvas interaction library for the editor shell
- Define the MVP export flow as draft metadata rather than full rendering

## Phase 1: Design
- Define core entities: scene, scene element, style profile, prompt summary, export draft,
  provider profile
- Define app areas: editor canvas, asset palette, prompt panel, export preview, provider settings
- Define adapter seams: prompt translator, scene serializer, provider adapters, export estimator
- Define tests for deterministic prompt generation, scene persistence, and failure handling

## Phase 2: Build Slice
### Slice A - Foundation
- Static Next.js app shell
- Shared scene types and validation
- Minimal test harness

### Slice B - Editor and Semantics
- Canvas editor with starter assets and scene editing controls
- Deterministic prompt translator
- Prompt preview panel

### Slice C - Persistence and Preview
- Scene save/load flow
- README-style preview frame
- Export readiness metadata card

### Slice D - Provider UX
- Provider mode selector with explicit local/cloud/no-provider states
- Non-destructive error surfaces for unavailable providers

### Slice E - Post-MVP Cloud Bridge
- Cloudflare Worker endpoint for cloud-provider request mediation
- Worker-side secret handling and prompt sanitization
- Shared contract between static frontend provider adapters and Worker routes

## Risks
- Canvas interaction complexity can expand quickly if freeform editing is overbuilt too early.
- Static hosting makes secret-managed cloud proxying unavailable in the frontend deployment lane,
  which is why Cloudflare Workers must own that boundary.
- Real animated export can become a performance problem if added before the static preview path is
  solid.
