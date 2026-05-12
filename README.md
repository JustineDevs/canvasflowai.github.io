# CanvasFlow AI

CanvasFlow AI is a static-first visual orchestration tool for personal-brand dioramas. This MVP
lets you assemble a scene, inspect deterministic prompt semantics, and preview export readiness
without configuring a generation provider.

## Deployment Shape

- Frontend: static Next export suitable for GitHub Pages
- Trusted backend web services: Cloudflare Workers

## Local Development

```bash
pnpm install
pnpm dev
```

## Environment

Copy `.env.example` and point `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` at your deployed Worker or
local Wrangler dev URL.

The Worker runtime has its own example secrets file at
`workers/cloud-bridge/.dev.vars.example`.

## Quality Checks

```bash
pnpm test
pnpm build
pnpm verify
```

## Deployment Automation

- GitHub Pages deploy workflow: `.github/workflows/deploy-pages.yml`
- Cloudflare Worker deploy workflow: `.github/workflows/deploy-worker.yml`
- Operational runbook: `docs/operations.md`

## Developer Tooling

- Dev container: `.devcontainer/devcontainer.json`
- Renovate: `renovate.json`
- Lefthook: `lefthook.yml`
- pre-commit: `.pre-commit-config.yaml`
- Changesets: `.changeset/`
- semantic-release: `release.config.cjs`
- act: `.actrc`
