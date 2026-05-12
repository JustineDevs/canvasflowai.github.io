# Deployment Guide

## Frontend
- Build with `pnpm build`
- Publish the static `out/` output to GitHub Pages or an equivalent static host
- GitHub Actions workflow: `.github/workflows/deploy-pages.yml`

## Cloudflare Worker
- Configure secrets and upstream URLs using Wrangler environment variables
- Deploy from `workers/cloud-bridge/`
- Set `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL` in the frontend environment
- GitHub Actions workflow: `.github/workflows/deploy-worker.yml`

## Required Runtime Variables
### Frontend
- `NEXT_PUBLIC_CLOUDFLARE_WORKER_URL`

### Worker
- `APIMART_API_KEY`
- `APIMART_BASE_URL`
- `APIMART_GENERATE_PATH`
- `LAOZHANG_API_KEY`
- `LAOZHANG_BASE_URL`
- `LAOZHANG_GENERATE_PATH`
- `ALLOWED_ORIGIN`

## Verification
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint .`
- `pnpm exec vitest run --reporter=verbose --pool=forks --poolOptions.forks.singleFork`
- `pnpm build`
