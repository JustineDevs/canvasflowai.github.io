# Quickstart: CanvasFlow AI MVP

## Goal
Run the app locally, create a scene, confirm prompt translation, save a scene file, and inspect
export readiness without configuring any provider.

## Steps
1. Install dependencies.
2. Run the development server.
3. Open the editor and add starter assets.
4. Move elements and confirm the prompt summary changes.
5. Save the scene to a JSON file.
6. Reload the saved scene and confirm layout parity.
7. Switch provider modes and confirm status messaging stays non-destructive.

## Backend Follow-Up
- When cloud-backed generation is added, deploy the trusted API surface as a Cloudflare Worker.
- Keep Worker-specific secrets and provider credentials out of the static frontend.
