import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import { Plus, Search } from "lucide-preact";
import { useApp } from "../context";
import { IssueRow } from "./issue-row";
import { StatusIcon, statusLabel } from "./status-icon";
import { Pagination } from "./pagination";
import { CreateIssue } from "./create-issue";
import type { IssueStatus, Priority } from "../types";

const STATUS_ORDER: IssueStatus[] = ["in_progress", "todo", "backlog", "done", "cancelled"];

export function IssueList() {
  const { issues, issuesPag, setIssuesPage, issuesSearch, setIssuesSearch, selectIssue, stats, bulkUpdateIssues, filters, setFilters, projectLookup } = useApp();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkPriority, setBulkPriority] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [layout, setLayout] = useState("list");
  const [searchValue, setSearchValue] = useState(issuesSearch);
  const [showCreate, setShowCreate] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<IssueStatus>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIssuesSearch(value), 300);
  }, [setIssuesSearch]);

  useEffect(() => {
    setSelected(new Set()); setBulkMessage(""); setBulkError("");
  }, [issuesSearch, issuesPag.page, filters.status, filters.priority, filters.project_id, filters.overdue]);

  const selectedIds = issues.filter(issue => selected.has(issue.id)).map(issue => issue.id);
  const toggleSelected = (id: number) => setSelected(previous => {
    const next = new Set(previous); if (next.has(id)) next.delete(id); else next.add(id); return next;
  });
  const applyBulkUpdate = async () => {
    if (bulkSaving || selectedIds.length === 0 || (!bulkStatus && !bulkPriority)) return;
    setBulkSaving(true); setBulkError(""); setBulkMessage("");
    try {
      await bulkUpdateIssues(selectedIds, {
        ...(bulkStatus ? { status: bulkStatus as IssueStatus } : {}),
        ...(bulkPriority ? { priority: bulkPriority as Priority } : {}),
      });
      setBulkMessage(`Updated ${selectedIds.length} issues.`); setSelected(new Set());
      setBulkStatus(""); setBulkPriority("");
    } catch (e) { setBulkError((e as Error).message); }
    finally { setBulkSaving(false); }
  };

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
              placeholder="Search titles, IDs, or descriptions..."
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
      <div class="demo-summary" role="status" aria-live="polite">
        <strong>{issuesPag.total} matching issues{issuesSearch && ` for “${issuesSearch}”`}</strong>
        <span>On this page: {issues.filter(i => i.status === "in_progress").length} in progress</span>
        <span>{issues.filter(i => i.status === "done").length} completed</span>
        <span>{issues.filter(i => ["urgent", "high"].includes(i.priority) && !["done", "cancelled"].includes(i.status)).length} need attention</span>
      </div>
      {issuesSearch && <button class="btn btn-sm" onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setSearchValue(""); setIssuesSearch(""); }} aria-label="Clear search">Clear search</button>}
      {issues.length === 0 && <p class="empty-group">No matching issues. Try a title, identifier, or description keyword, clear the filters, or create an issue.</p>}
      <section class="bulk-triage" aria-label="Bulk triage">
        <label><input type="checkbox" aria-label="Select all issues on this page" disabled={bulkSaving || issues.length === 0} checked={issues.length > 0 && selectedIds.length === issues.length} onChange={e => setSelected(e.currentTarget.checked ? new Set(issues.map(issue => issue.id)) : new Set())} /> Select page</label>
        <span>{selectedIds.length} selected</span>
        <select aria-label="Bulk status" value={bulkStatus} disabled={bulkSaving} onChange={e => setBulkStatus(e.currentTarget.value)}><option value="">Keep status</option>{STATUS_ORDER.map(status => <option value={status} key={status}>{statusLabel(status)}</option>)}</select>
        <select aria-label="Bulk priority" value={bulkPriority} disabled={bulkSaving} onChange={e => setBulkPriority(e.currentTarget.value)}><option value="">Keep priority</option>{["urgent", "high", "medium", "low", "none"].map(priority => <option value={priority} key={priority}>{priority}</option>)}</select>
        <button class="btn btn-primary" onClick={applyBulkUpdate} disabled={bulkSaving || selectedIds.length === 0 || (!bulkStatus && !bulkPriority)}>{bulkSaving ? "Applying…" : "Apply to selected"}</button>
        <button class="btn" disabled={bulkSaving || selectedIds.length === 0} onClick={() => setSelected(new Set())}>Clear selection</button>
        <small class="muted">Selections apply to this page and clear when filters or pages change.</small>
      </section>
      {bulkMessage && <p role="status" class="bulk-feedback">{bulkMessage}</p>}
      {bulkError && <p role="alert" class="bulk-feedback">{bulkError}</p>}
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
                    <div class="selectable-issue" key={issue.id}>
                      <input type="checkbox" aria-label={`Select issue ${issue.identifier}`} checked={selected.has(issue.id)} disabled={bulkSaving} onChange={() => toggleSelected(issue.id)} />
                      <IssueRow issue={issue} onClick={() => selectIssue(issue.id)} />
                    </div>
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
