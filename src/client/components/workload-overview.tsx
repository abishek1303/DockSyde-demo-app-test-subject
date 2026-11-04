import { reportLocation } from "@clawnify/app/client";
import { useEffect, useState } from "preact/hooks";
import { api } from "../api";
import { useApp } from "../context";
import { statusLabel } from "./status-icon";
import { priorityLabel } from "./priority-icon";
import type { IssueStatus, Workload } from "../types";

const STATUSES: IssueStatus[] = ["in_progress", "todo", "backlog", "done", "cancelled"];

export function WorkloadOverview() {
  const { selectIssue, setView, setFilters, setIssuesSearch } = useApp();
  const [data, setData] = useState<Workload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let current = true;
    setLoading(true); setError(null);
    api<Workload>("GET", "/api/workload")
      .then(value => { if (current) setData(value); })
      .catch(e => { if (current) setError((e as Error).message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [refresh]);

  const openIssues = (status = "", overdue = "") => {
    setFilters({ status, overdue, priority: "", project_id: "" });
    setIssuesSearch(""); setView("issues");
    const url = new URL(window.location.href); url.searchParams.set("view", "issues");
    window.history.pushState(null, "", url.pathname + url.search);
    reportLocation(url.pathname + url.search);
  };

  return <div class="workload-view">
    <div class="toolbar">
      <div><h1>Workload overview</h1><p class="muted">Workspace-wide counts and the next work to review.</p></div>
      <button class="btn" disabled={loading} onClick={() => setRefresh(value => value + 1)}>Refresh workload</button>
    </div>
    {loading && <p role="status" class="loading-text">Loading workload…</p>}
    {error && <p role="alert" class="workload-message">Could not load workload: {error}. Use Refresh workload to retry.</p>}
    {!loading && !error && data && <>
      <div class="workload-metrics">
        <section class="card workload-metric"><h2>Active issues</h2><strong>{data.totals.active}</strong><p>Excludes Done and Cancelled</p></section>
        <section class="card workload-metric"><h2>Overdue</h2><strong>{data.totals.overdue}</strong><button class="btn btn-sm" onClick={() => openIssues("", "true")}>Review overdue issues</button></section>
        <section class="card workload-metric"><h2>Due in 7 days</h2><strong>{data.totals.upcoming}</strong><p>Today through seven days from today</p></section>
        <section class="card workload-metric"><h2>Without a project</h2><strong>{data.totals.unprojected}</strong><p>Active issues without a project</p></section>
      </div>
      <div class="workload-panels">
        <section class="card workload-panel"><h2>Issues by status</h2><p class="muted">Select a status to review its issues.</p>
          {STATUSES.map(status => <button class="workload-status" onClick={() => openIssues(status)} key={status}><span>{statusLabel(status)}</span><strong>{data.statuses.find(item => item.status === status)?.count ?? 0}</strong></button>)}
        </section>
        <section class="card workload-panel"><h2>Deadline queue</h2><p class="muted">Up to 10 earliest active deadlines, including overdue work. Dates use UTC.</p>
          {data.deadlines.length === 0 ? <p class="workload-message">No overdue or upcoming deadlines. Add a due date to an issue to plan upcoming work.</p> : data.deadlines.map(issue =>
            <button class="workload-deadline" key={issue.id} aria-label={`Review deadline ${issue.identifier}`} onClick={() => selectIssue(issue.id)}>
              <span><small>{issue.identifier} · {priorityLabel(issue.priority)}</small><strong>{issue.title}</strong></span>
              <span class={issue.overdue ? "deadline-overdue" : "muted"}>{issue.overdue ? "Overdue · " : "Due · "}{issue.due_date}</span>
            </button>)}
        </section>
      </div>
    </>}
  </div>;
}
