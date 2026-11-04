import { useState } from "preact/hooks";
import { X } from "lucide-preact";
import { useApp } from "../context";
import type { IssueStatus, Priority } from "../types";

const STATUSES: IssueStatus[] = ["backlog", "todo", "in_progress", "done"];
const PRIORITIES: Priority[] = ["none", "urgent", "high", "medium", "low"];

export function CreateIssue({ onClose }: { onClose: () => void }) {
  const { addIssue, projectLookup, setError } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<IssueStatus>("todo");
  const [priority, setPriority] = useState<Priority>("none");
  const [projectId, setProjectId] = useState<string>("");

  const handleSubmit = async () => {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      await addIssue({
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
        status,
        priority,
        project_id: projectId ? parseInt(projectId, 10) : null,
      });
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div class="create-form-bar">
      <div class="create-form-header">
        <span class="create-form-title">New Issue</span>
        <button class="btn btn-sm" onClick={onClose} aria-label="Cancel">
          <X size={14} />
        </button>
      </div>
      <div class="create-form-grid">
        <div class="create-form-field create-form-field-wide">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="Issue title"
            autoFocus
            aria-label="Issue title"
          />
        </div>
        <div class="create-form-field create-form-field-wide">
          <label for="issue-description">Description (optional)</label>
          <textarea id="issue-description" value={description} onInput={(e) => setDescription(e.currentTarget.value)} rows={3} placeholder="Describe the request and what a successful outcome looks like." />
        </div>
        <div class="create-form-field">
          <label for="issue-due-date">Due date (optional)</label>
          <input id="issue-due-date" type="date" value={dueDate} onInput={(e) => setDueDate(e.currentTarget.value)} />
        </div>
        <div class="create-form-field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus((e.target as HTMLSelectElement).value as IssueStatus)} aria-label="Status">
            {STATUSES.map((s) => <option key={s} value={s}>{s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div class="create-form-field">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority((e.target as HTMLSelectElement).value as Priority)} aria-label="Priority">
            {PRIORITIES.map((p) => <option key={p} value={p}>{p === "none" ? "No priority" : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div class="create-form-field">
          <label>Project</label>
          <select value={projectId} onChange={(e) => setProjectId((e.target as HTMLSelectElement).value)} aria-label="Project">
            <option value="">No project</option>
            {projectLookup.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
          </select>
        </div>
      </div>
      <div class="create-form-actions">
        <button class="btn btn-primary" onClick={handleSubmit} disabled={!title.trim() || saving} aria-label="Create issue">
          {saving ? "Creating…" : "Create Issue"}
        </button>
      </div>
    </div>
  );
}
