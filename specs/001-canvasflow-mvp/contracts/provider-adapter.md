# Contract: Provider Adapter

## Purpose
UI-facing contract for optional local or cloud generation providers.

For trusted cloud-provider flows, the frontend-facing cloud adapter is expected to call a
Cloudflare Worker rather than the static frontend host directly.

## Interface
- `getStatus(): Promise<ProviderStatus>`
- `generate(scene, promptSummary): Promise<GenerationResult>`

## ProviderStatus
- `mode`
- `connectionState`
- `message`

## GenerationResult
- `assetUrl | null`
- `format`
- `estimatedBytes`
- `warnings[]`

## Rules
- The adapter MUST never mutate the active scene.
- Failures MUST return structured error information consumable by the UI.
- No-provider mode MUST behave as a supported state, not as an error.
- Cloud-backed adapters MUST treat the Worker endpoint as the secret-bearing trust boundary.
