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

- `main`: stable baseline with repeatable demo setup.
- `changes-test`: feature showcase for comparison with main.

Older experiment tips are preserved as `archive/*` tags. No workflow synchronizes
branches: the two branches intentionally differ.

## Demo walkthrough

1. Browse statuses and search for “launch”.
2. Open TASK-4, change its priority or status, and add a comment.
3. Create an issue and assign a project.
4. Open Projects to inspect progress.
5. Switch to changes-test to explore the added features.

`pnpm build` creates `dist/`. Append `?agent` for browser automation controls.
See `agent.md` for app capabilities. MIT licensed; based on Clawnify OpenTodo.
