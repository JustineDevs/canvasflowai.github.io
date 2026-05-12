# CanvasFlow AI Issue Roadmap

## Purpose
Replace the initial low-level setup issues with architecture-aligned epics and implementation
slices that map directly to the approved system design.

## Superseded Issues
- #1 T001 Create project manifest and scripts
- #2 T002 Create TypeScript, Next.js, and Tailwind base config
- #3 T003 Create app shell layout and global styles
- #4 T004 Create test runner configuration
- #5 T005 Create lint and formatting baselines

## Replacement Structure

### Meta
- Architecture brief: issue #6
- Delivery roadmap and supersession map: new meta issue

### Epics / Slices
- Frontend shell and scene editor
- Semantic prompt translation and scene domain model
- Scene persistence and import/export validation
- Provider UX and Cloudflare Worker bridge
- Export readiness and asset optimization pipeline

## Rules
- New issues should describe boundaries, trust assumptions, verification paths, and explicit
  out-of-scope items.
- No replacement issue should collapse back into raw setup chores without tying the work to a
  subsystem outcome.
