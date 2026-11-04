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


## Latest Changes demo: issue intake

`main` remains the successful full-scan state at
`f2915461556be12a3f2a7ec5e03663d37344e123`. The existing `changes-test` branch
contains the new issue description/due-date inputs; compare that main revision
with the committed changes-test head. The same main revision is preserved as
`demo/change-test-baseline-2026-11-04`.

At `/?agent`, click New Issue to see Description (optional) and Due date
(optional). Create an issue, open it, and reload to verify the saved context and
deadline. `demo/docsyde-inspection.json` version 2 captures the form without
creating records. Source, API, and startup responsibilities stay unchanged.
No schema migration, package changes, or dependency installation are required.

Verification: production build and Playwright intake checks passed, including
blank optional fields, required title, and saved values after reload. Existing
TypeScript diagnostics remain identical (15 server errors).

### Baseline matching the saved main scan

The subsequently verified successful run `85abcbea-3513-4625-9be7-d9ac10515c91`
scanned remote main at `8810bfc4e75f3d5e84824efffcd062683e2150ee`.
Use that immutable SHA as the base when demonstrating changes against those saved
documents. This comparison includes the filters/board, search feedback, project
context, and issue intake changes. The narrower `f291546` base isolates intake.

The prior change test compared `6223397` with `4e2191a` (the merge adding ignore
rules), so that pair does not demonstrate a user-facing product change. Select
an explicit base/head comparison rather than that merge's immediate parent.
The new feature commits must be available on GitHub before remote analysis can
resolve them; local checkout changes alone do not update the remote branch.


The tip feature also extends issue search to descriptions. For an immediate-parent
Latest Changes demo, use the latest changes-test commit: it contains the API query
and visible search hint changes together. Search a word present only in an issue's
description to demonstrate the added capability. No startup configuration changes.


## Expanded feature demo on changes-test

The latest feature commit combines Workload overview, bulk triage, duplication,
project-description editing, and description search with their source changes.
Selecting changes-test in Latest Changes now selects a product-changing tip.
The previous head `9c75d51` is the immediate-parent baseline for this feature set;
use `8810bfc` when comparing with documents from the successful remote main scan.

Suggested walkthrough:
1. Open `/?agent&view=overview`, inspect live counts and the deadline queue.
2. Review overdue issues, then select several issues in My Issues and apply
   a shared status/priority. Return to Workload to see the updated counts.
3. Open an issue, Duplicate issue, review the draft, and save a follow-up.
4. In Projects, edit a description, save, and reload to confirm persistence.
5. Search a keyword that appears only in an issue description.

New endpoints are `GET /api/workload` and `POST /api/issues/bulk`. They use the
existing local database; no schema migration or new package is required. The
inspection workflow version 3 visits Workload and bulk-triage controls without
modifying records. Existing source-based model/validation behavior is unchanged.

With `pnpm dev` running, execute `node --test tests/workspace.integration.mjs`.
This uses Node's built-in test runner and temporary local records, cleaned up
in finally. It verifies workspace counts, deadline exclusions, bulk input limits,
combined updates, duplicate IDs, and all-or-nothing behavior for missing records.
Playwright separately verifies drill-downs, persistence, selection reset, failed
bulk-save recovery, dashboard refresh/retry, and the earlier intake/copy/project
workflows. Existing TypeScript diagnostics remain unchanged apart from line numbers.
