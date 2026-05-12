# Operations Guide

## Verification Command

Run the full local quality gate with:

```bash
pnpm verify
```

## Local Automation

- Install git hooks: `pnpm exec lefthook install`
- Install pre-commit hooks: `pre-commit install`
- Test GitHub Actions locally: `act`
- Draft a release note/version intent: `pnpm changeset`
- Dry-run semantic-release: `pnpm release:dry`

## Frontend Deployment

- GitHub Pages deployment is automated by `.github/workflows/deploy-pages.yml`
- The workflow builds the static `out/` directory and publishes it to Pages

## Worker Deployment

- Cloudflare Worker deployment is automated by `.github/workflows/deploy-worker.yml`
- Required repository secrets:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

## Required Runtime Configuration

### Frontend
- `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL`

### Worker
- `ALLOWED_ORIGIN`
- `APIMART_API_KEY`
- `APIMART_BASE_URL`
- `APIMART_GENERATE_PATH`
- `LAOZHANG_API_KEY`
- `LAOZHANG_BASE_URL`
- `LAOZHANG_GENERATE_PATH`

## Release Checklist

1. `pnpm verify`
2. Confirm Worker health endpoint reports `ok`
3. Confirm provider status shows configured providers
4. Publish Pages
5. Deploy Worker
6. Smoke-test scene save/load, prompt generation, and cloud draft flow
