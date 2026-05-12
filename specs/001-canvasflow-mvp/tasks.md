# Tasks: CanvasFlow AI MVP

## Phase 1: Setup

- [x] T001 Create project manifest and scripts in [package.json](/mnt/c/users/justinedevs/downloads/canvasflowai/package.json)
- [x] T002 Create TypeScript, Next.js, and Tailwind base config in [tsconfig.json](/mnt/c/users/justinedevs/downloads/canvasflowai/tsconfig.json)
- [x] T003 [P] Create app shell layout and global styles in [app/layout.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/app/layout.tsx)
- [x] T004 [P] Create test runner configuration in [vitest.config.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/vitest.config.ts)
- [x] T005 [P] Create lint and formatting baselines in [eslint.config.mjs](/mnt/c/users/justinedevs/downloads/canvasflowai/eslint.config.mjs)

## Phase 2: Foundational

- [x] T006 Create core scene types in [src/lib/scene/types.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/scene/types.ts)
- [x] T007 [P] Create scene schema validation in [src/lib/scene/schema.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/scene/schema.ts)
- [x] T008 [P] Create starter asset catalog in [src/lib/assets/starter-assets.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/assets/starter-assets.ts)
- [x] T009 Create style profile definitions in [src/lib/styles/profiles.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/styles/profiles.ts)
- [x] T010 Create provider mode model and defaults in [src/lib/providers/provider-state.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/providers/provider-state.ts)

## Phase 3: User Story 1

Story goal: users can build and edit a scene on a bounded canvas.

Independent test criteria: a user can load starter assets, edit element placement, and reset the
scene without breaking scene state integrity.

- [x] T011 [US1] Create failing scene editor model tests in [tests/scene-editor-state.test.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/tests/scene-editor-state.test.ts)
- [x] T012 [US1] Create failing editor interaction component tests in [tests/editor-shell.test.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/tests/editor-shell.test.tsx)
- [x] T013 [US1] Implement scene state reducer in [src/lib/scene/reducer.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/scene/reducer.ts)
- [x] T014 [P] [US1] Implement canvas scene component in [src/components/editor/scene-canvas.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/src/components/editor/scene-canvas.tsx)
- [x] T015 [P] [US1] Implement asset palette component in [src/components/editor/asset-palette.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/src/components/editor/asset-palette.tsx)
- [x] T016 [US1] Implement editor shell composition in [src/components/editor/editor-shell.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/src/components/editor/editor-shell.tsx)

## Phase 4: User Story 2

Story goal: users can inspect deterministic prompt semantics from the active scene.

Independent test criteria: prompt summaries update after scene changes and remain stable for the
same scene input.

- [x] T017 [US2] Create failing prompt translator tests in [tests/prompt-translator.test.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/tests/prompt-translator.test.ts)
- [x] T018 [US2] Create failing prompt panel tests in [tests/prompt-panel.test.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/tests/prompt-panel.test.tsx)
- [x] T019 [US2] Implement prompt translation rules in [src/lib/prompting/generate-prompt-summary.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/prompting/generate-prompt-summary.ts)
- [x] T020 [P] [US2] Implement prompt summary panel in [src/components/prompt/prompt-panel.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/src/components/prompt/prompt-panel.tsx)
- [x] T021 [US2] Integrate prompt summary into editor shell in [src/components/editor/editor-shell.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/src/components/editor/editor-shell.tsx)

## Phase 5: User Story 3

Story goal: users can save a scene, reload it, and inspect export readiness metadata.

Independent test criteria: saved scenes reload successfully, invalid imports fail safely, and the
preview exposes draft readiness information.

- [x] T022 [US3] Create failing scene serialization tests in [tests/scene-serialization.test.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/tests/scene-serialization.test.ts)
- [x] T023 [US3] Create failing export preview tests in [tests/export-preview.test.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/tests/export-preview.test.tsx)
- [x] T024 [US3] Implement scene serialization helpers in [src/lib/scene/serialization.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/scene/serialization.ts)
- [x] T025 [P] [US3] Implement export readiness estimator in [src/lib/export/export-readiness.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/src/lib/export/export-readiness.ts)
- [x] T026 [P] [US3] Implement README preview card in [src/components/export/readme-preview.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/src/components/export/readme-preview.tsx)
- [x] T027 [US3] Integrate save/load and preview controls in [src/components/editor/editor-shell.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/src/components/editor/editor-shell.tsx)

## Phase 6: Polish

- [x] T028 Create app home route wiring in [app/page.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/app/page.tsx)
- [x] T029 [P] Add provider mode messaging UI in [src/components/providers/provider-status-panel.tsx](/mnt/c/users/justinedevs/downloads/canvasflowai/src/components/providers/provider-status-panel.tsx)
- [x] T030 [P] Add responsive layout refinements in [app/globals.css](/mnt/c/users/justinedevs/downloads/canvasflowai/app/globals.css)
- [x] T031 Add regression coverage for invalid scene imports and provider failures in [tests/provider-state.test.ts](/mnt/c/users/justinedevs/downloads/canvasflowai/tests/provider-state.test.ts)
- [x] T032 Update usage documentation in [README.md](/mnt/c/users/justinedevs/downloads/canvasflowai/README.md)

## Dependencies

- Setup must complete before foundational tasks.
- Foundational tasks must complete before story implementation.
- User Story 1 enables User Story 2 and User Story 3 because both consume the shared editor shell.
- User Story 2 and User Story 3 can proceed in parallel once the foundational editor shell exists.
- Polish follows all three user stories.

## Parallel Examples

- After T013, T014 and T015 can run in parallel.
- After T019, T020 can run while T021 waits for the panel output contract.
- After T024, T025 and T026 can run in parallel.

## Implementation Strategy

- MVP delivery target: complete Phase 1, Phase 2, and Phase 3 first for a usable editor shell.
- Second increment: complete Phase 4 for deterministic prompt semantics.
- Third increment: complete Phase 5 for persistence and preview readiness.
- Final increment: complete Phase 6 for provider messaging, responsive polish, and documentation.
