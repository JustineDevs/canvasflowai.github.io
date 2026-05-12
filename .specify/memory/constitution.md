<!--
Sync Impact Report
- Version change: 0.0.0 -> 0.1.0
- Modified principles: Initial adoption
- Added sections: Principles, Delivery Standards, Governance
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->

# CanvasFlow AI Constitution

## Principles

### Browser-First Product Surface
The primary user experience MUST function as a static web application that can be hosted on
GitHub Pages or an equivalent static host. Features that require a trusted backend MUST be
optional or explicitly deferred behind a separate deployment target.

### Deterministic Scene Semantics
Scene data MUST be represented as explicit, serializable structures. Prompt generation MUST be
deterministic from scene state, selected style profile, and export settings so generated
artifacts remain explainable and testable.

### Local-First Privacy
The product MUST default to local scene storage and explicit user-controlled export behavior.
Cloud generation, remote uploads, and key usage MUST be opt-in and clearly disclosed at the
interaction point.

### Small, Verified Increments
Changes MUST be delivered in small slices with tests or equivalent verification evidence before
expanding scope. Foundational work MUST unblock a usable MVP path before optional enhancements.

## Delivery Standards

- Specifications MUST describe user value and measurable success criteria.
- Plans MUST identify hosting boundaries, provider trust boundaries, and export constraints.
- Tasks MUST be organized by independently testable user stories.
- Implementation MUST keep the first success path simple before adding advanced provider features.

## Governance

- Version: 0.1.0
- Ratified: 2026-05-11
- Last Amended: 2026-05-11
- Amendments MUST update dependent templates and state the semantic version bump rationale.
