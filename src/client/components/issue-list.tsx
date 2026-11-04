import { useState, useRef, useCallback } from "preact/hooks";
import { Plus, Search } from "lucide-preact";
import { useApp } from "../context";
import { IssueRow } from "./issue-row";
import { StatusIcon, statusLabel } from "./status-icon";
import { Pagination } from "./pagination";
import { CreateIssue } from "./create-issue";
import type { IssueStatus } from "../types";

const STATUS_ORDER: IssueStatus[] = ["in_progress", "todo", "backlog", "done", "cancelled"];

export function IssueList() {
  const { issues, issuesPag, setIssuesPage, issuesSearch, setIssuesSearch, selectIssue, stats, filters, setFilters, projectLookup } = useApp();
  const [layout, setLayout] = useState("list");
  const [searchValue, setSearchValue] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<IssueStatus>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIssuesSearch(value), 300);
  }, [setIssuesSearch]);

  // Group issues by status
  const grouped = new Map<IssueStatus, typeof issues>();
  for (const s of STATUS_ORDER) {
    grouped.set(s, []);
  }
  for (const issue of issues) {
    const group = grouped.get(issue.status);
    if (group) group.push(issue);
    else grouped.set(issue.status, [issue]);
  }

  const toggleCollapse = (s: IssueStatus) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <div class="issue-list-view">
      <div class="toolbar">
        <div class="toolbar-left">
          <h1>Issues</h1>
          <span class="toolbar-count">{stats.issues}</span>
        </div>
        <div class="toolbar-actions">
          <div class="search-box">
            <Search size={14} />
            <input
              class="search-input"
              type="text"
              placeholder="Search issues..."
              value={searchValue}
              onInput={(e) => handleSearch((e.target as HTMLInputElement).value)}
              aria-label="Search issues"
            />
          </div>
          <button class="btn btn-primary" onClick={() => setShowCreate(true)} aria-label="New issue">
            <Plus size={14} /> New Issue
          </button>
        </div>
      </div>

      {showCreate && <CreateIssue onClose={() => setShowCreate(false)} />}

      <div class="demo-filters">
        <select aria-label="Filter status" value={filters.status} onChange={e => setFilters({ ...filters, status: e.currentTarget.value })}>
          <option value="">All statuses</option>{STATUS_ORDER.map(s => <option value={s}>{statusLabel(s)}</option>)}
        </select>
        <select aria-label="Filter priority" value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.currentTarget.value })}>
          <option value="">All priorities</option>{["urgent", "high", "medium", "low", "none"].map(p => <option value={p}>{p}</option>)}
        </select>
        <select aria-label="Filter project" value={filters.project_id} onChange={e => setFilters({ ...filters, project_id: e.currentTarget.value })}>
          <option value="">All projects</option>{projectLookup.map(p => <option value={p.id}>{p.name}</option>)}
        </select>
        <label><input type="checkbox" checked={!!filters.overdue} onChange={e => setFilters({ ...filters, overdue: e.currentTarget.checked ? "true" : "" })} /> Overdue only</label>
        <button class="btn" onClick={() => { setFilters({status: "", priority: "", project_id: "", overdue: ""}); handleSearch(""); }}>Clear filters</button>
        <button class="btn" aria-pressed={layout === "board"} onClick={() => setLayout(layout === "list" ? "board" : "list")}>{layout === "list" ? "Board view" : "List view"}</button>
      </div>
      <div class="demo-summary" aria-live="polite">
        <strong>{issuesPag.total} matching issues</strong>
        <span>On this page: {issues.filter(i => i.status === "in_progress").length} in progress</span>
        <span>{issues.filter(i => i.status === "done").length} completed</span>
        <span>{issues.filter(i => ["urgent", "high"].includes(i.priority) && !["done", "cancelled"].includes(i.status)).length} need attention</span>
      </div>
      {issues.length === 0 && <p class="empty-group">No matching issues. Clear the filters or create an issue to get started.</p>}
      <div class={layout === "board" ? "issue-groups demo-board" : "issue-groups"}>
        {STATUS_ORDER.map((status) => {
          const group = grouped.get(status) || [];
          if (group.length === 0 && issuesSearch) return null;

          return (
            <div key={status} class="issue-group">
              <button
                class="issue-group-header"
                onClick={() => toggleCollapse(status)}
                aria-label={`Toggle ${statusLabel(status)}`}
                aria-expanded={!collapsed.has(status)}
              >
                <StatusIcon status={status} />
                <span class="issue-group-label">{statusLabel(status)}</span>
                <span class="issue-group-count">{group.length}</span>
              </button>
              {!collapsed.has(status) && (
                <div class="issue-group-items">
                  {group.map((issue) => (
                    <IssueRow key={issue.id} issue={issue} onClick={() => selectIssue(issue.id)} />
                  ))}
                  {group.length === 0 && (
                    <div class="empty-group">No issues</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Pagination pag={issuesPag} onPage={setIssuesPage} />
    </div>
  );
}
