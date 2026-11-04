# DockSyde demo issue tracker

Preact + Hono + Cloudflare D1 issue tracker with projects, labels, priorities, due dates, and comments.

## Run locally

Requires Node.js 22+ and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm demo
```

Open the Vite URL printed in the terminal (usually http://localhost:5173).
The API runs on port 8787. No Cloudflare account is required locally.
`pnpm demo` replaces local data with eight fictional issues across two projects.
Stop the server before resetting. `pnpm demo:reset` restores the sample workspace;
`pnpm dev` starts without resetting. Data persists in `.wrangler/`.
The reset uses `--local`; never run the seed against production.

## Branches

- `main`: merged filters, board, workload summary, search feedback, and project descriptions.
- `changes-test`: preserved original filters/board feature branch (merged into main).

Older experiment tips are preserved as `archive/*` tags. No workflow synchronizes
branches. Use the demo baseline tag for immutable comparisons.

## Demo walkthrough

1. Browse statuses and search for “launch”.
2. Open TASK-4, change its priority or status, and add a comment.
3. Create an issue and assign a project.
4. Open Projects to inspect progress.
5. Combine filters, toggle Board view, then create a project with a description.

`pnpm build` creates `dist/`. Append `?agent` for browser automation controls.
See `agent.md` for app capabilities. MIT licensed; based on Clawnify OpenTodo.

## Issue filters and board

Combine status, priority, project, and overdue filters with search. Filters run
on the API before pagination. Toggle Board view to see status columns; click
a card to edit it. The summary shows matching totals and explicitly page-scoped
workload counts. Clear filters restores the full list. Overdue excludes done
and cancelled issues and compares dates in UTC.


## Search feedback and project context

Search matches issue titles or identifiers. The summary includes the submitted query
and matching total; Clear search immediately restores the unsearched list while
preserving other filters. No matches gives guidance for revising the query.

New Project accepts an optional description and shows Creating… while saving.
Descriptions persist through the existing project API and appear below the project
name in the table, including after reload. Name remains required.

See [SETUP.md](SETUP.md) for pinned demo revisions and inspection checkpoints.


## Issue intake (changes-test)

New Issue now accepts an optional description and due date alongside title,
status, priority, and project. Describe the request and expected outcome before
creating it, and optionally set its deadline. The existing issue API persists
both values; the description appears in issue details and the due date appears
in the list and existing editable due-date control. Empty values remain allowed.
Create Issue shows Creating… and disables repeated submission while saving.


## Search request details

Issue search now matches descriptions as well as titles and identifiers. Find a
request using customer context or an expected outcome entered during creation,
even if those words are absent from its title. Search still combines with status,
priority, project, and overdue filters before pagination.


## Workload overview

Open Workload in the workspace navigation (`/?agent&view=overview`) for live
workspace-wide active, overdue, next-seven-days, and no-project counts. Done and
Cancelled issues are excluded from active/deadline counts. Status breakdowns
include every issue, not just the current list page. Select a status or Review
overdue issues to open the corresponding filtered list. The deadline queue shows
the ten earliest active deadlines through seven days from today, including late
work; selecting one opens its editable issue detail. Dates use UTC. Refresh
workload reloads the data and lets you retry a failed load.

## Bulk triage

In My Issues, select individual issues or Select page, then choose a status,
priority, or both and Apply to selected. Keep status / Keep priority preserve
that field. Selection is limited to the current page and clears when filters or
pagination change. The API validates 1–100 issue IDs and applies the changes in
one atomic statement. If any selected issue was removed, none are updated.
Failures retain the selection for correction or retry; successful edits refresh
the list and counts. No bulk deletion or automatic status transitions occur.

## Duplicate a request

Open an issue and select Duplicate issue. A reviewable creation form copies its
title (prefixed with Copy of), description, priority, and project. The copy starts
at Todo with an empty due date; comments and labels are not copied. Edit any
fields, then Create Issue to save and open the new issue with its own identifier.
Cancel creates nothing and the original remains unchanged.

## Maintain project descriptions

In Projects, use Add description / Edit description beneath a project name.
Save description persists the edited brief; Cancel description edit discards the
draft. Clear and save to remove a description. A failed save retains the draft
for retry. This uses the existing project update endpoint.
