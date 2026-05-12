# Cloud Bridge Worker

This Worker is the trusted boundary for CanvasFlow AI cloud-provider execution.

## Responsibilities
- Accept sanitized scene/prompt requests from the static frontend
- Validate request shape at runtime
- Enforce browser-safe CORS
- Forward generation calls to configured upstream providers
- Return a normalized response envelope to the frontend

## Local Setup
1. Copy `.dev.vars.example` to `.dev.vars`
2. Fill in provider keys and base URLs
3. Run `wrangler dev`

## Endpoints
- `GET /api/health`
- `GET /api/providers/status`
- `POST /api/generate`
