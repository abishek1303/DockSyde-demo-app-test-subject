export type View = "issues" | "projects" | "overview";

export type IssueStatus = "backlog" | "todo" | "in_progress" | "done" | "cancelled";
export type Priority = "none" | "urgent" | "high" | "medium" | "low";
export type ProjectStatus = "backlog" | "planned" | "in_progress" | "completed" | "cancelled";

export interface Issue {
  id: number;
  identifier: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  project_id: number | null;
  due_date: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  project_name?: string;
  project_icon?: string;
  labels: LabelRef[];
  comments?: Comment[];
}

export interface Project {
  id: number;
  name: string;
  icon: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  lead: string;
  start_date: string;
  target_date: string;
  issue_count?: number;
  done_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface LabelRef {
  id: number;
  name: string;
  color: string;
}

export interface Comment {
  id: number;
  issue_id: number;
  content: string;
  created_at: string;
}

export interface Stats {
  issues: number;
  projects: number;
  labels: number;
}

export interface PaginatedState {
  page: number;
  limit: number;
  total: number;
}

export interface ProjectLookup {
  id: number;
  name: string;
  icon: string;
}

export interface Workload {
  totals: { active: number; overdue: number; upcoming: number; unprojected: number };
  statuses: { status: IssueStatus; count: number }[];
  deadlines: { id: number; identifier: string; title: string; due_date: string; priority: Priority; overdue: number }[];
}
