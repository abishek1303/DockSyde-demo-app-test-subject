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
