# Local demo and verification

Use Node.js 22+ and pnpm. Run `pnpm install --frozen-lockfile`, then `pnpm dev`.
UI: http://localhost:5173/?agent; API: http://localhost:8787/api/stats.
This starts without replacing local data. See README for the explicitly destructive
local-only sample reset; it is unnecessary for inspecting the new form and search.

## Comparison references

- Original main: `demo/pre-merge-2026-11-04` (`8810bfc`).
- Original successful feature: `4e2191a`, `changes-test`.
- Recommended Latest Changes base: `demo/latest-changes-baseline-2026-11-04`
  (`373f773cda0db6fa28b39ca75773662bf60d3fe2`), after merging filters/board.
- Product head: `7b601cc` (search feedback `cbdf370`, project context `7b601cc`).
  Use final `main` for a comparison that also includes this setup/inspection guide.

Saved DocSyde run `007d16fd-aef2-48d8-99b8-f4ae02452331` used `changes-test`
at `4e2191a` in current-state mode. All eight stages completed; its reason was
`proposal-retained-awaiting-human-review`. This does not establish reliability
of a future Latest Changes run. No inference or publication is needed for setup.

## Visual inspection

`demo/docsyde-inspection.json` uses the existing DocSyde workflow format: list,
search feedback, board, and New Project description form, all on pathname `/`.
The usual agent URL is `/?agent`; the project view is also reachable with
`/?agent&view=projects`. Existing New issue / Search issues / New project labels
remain intact. The workflow masks inputs and textareas and never saves records.
It is an optional workflow file; selecting it in DocSyde requires the normal
runtime configuration approval. Existing runtime settings were not replaced.

## Validation

`pnpm build` passes. This repository has no lint or test script.
`pnpm exec tsc --noEmit` reports 15 existing server errors (missing D1Database
and API response typing); normalized diagnostics are identical at baseline/head.
Playwright checks passed for identifier search, no-match guidance, clear search,
board toggle, required project name, and project description persistence/display
after reload. Verification records were removed; existing local data was preserved.

The existing deterministic capture also completed: 10 retained checkpoints, no
omitted states/checkpoints, HTTP 200, and zero page errors. One bounded DOM snapshot
was truncated; screenshots and the final project form checkpoint were retained.
