-- Local demo reset only. Never run against production.
DELETE FROM comments;
DELETE FROM issue_labels;
DELETE FROM issues;
DELETE FROM labels;
DELETE FROM projects;
DELETE FROM _meta;
-- Fictional workspace records; loaded only in disposable demos.
INSERT INTO projects (id, name, description, status) VALUES
 (1, 'Client onboarding', 'Prepare a welcoming first week for a new client.', 'in_progress'),
 (2, 'Website refresh', 'Review the pages and collect launch feedback.', 'planned');
INSERT INTO labels (id, name, color) VALUES (1, 'Client experience', '#2563eb'), (2, 'Website', '#16a34a');
INSERT INTO issues (id, identifier, title, description, status, priority, project_id, sort_order) VALUES
 (1, 'TASK-1', 'Prepare the welcome checklist', 'List the information to collect before the kickoff meeting.', 'in_progress', 'high', 1, 0),
 (2, 'TASK-2', 'Schedule the kickoff meeting', 'Find a suitable time with the sample client team.', 'todo', 'medium', 1, 1),
 (3, 'TASK-3', 'Review the home page copy', 'Collect feedback on the draft introduction.', 'backlog', 'low', 2, 2);
INSERT INTO issue_labels VALUES (1, 1), (2, 1), (3, 2);
INSERT INTO comments (issue_id, content) VALUES (1, 'Start with the people, goals and documents needed for the first meeting.');
INSERT INTO issues (id, identifier, title, description, status, priority, project_id, due_date) VALUES
 (4, 'TASK-4', 'Approve the launch checklist', 'Review the release checklist.', 'todo', 'urgent', 2, date('now', '-2 days')),
 (5, 'TASK-5', 'Publish the getting started guide', 'Ready for the sample workspace.', 'done', 'medium', 1, date('now', '-1 day')),
 (6, 'TASK-6', 'Check mobile navigation', 'Verify the menu on smaller screens.', 'in_progress', 'high', 2, date('now', '+2 days')),
 (7, 'TASK-7', 'Explore a new illustration style', 'Collect ideas for design review.', 'backlog', 'low', 2, date('now', '+7 days')),
 (8, 'TASK-8', 'Retire the old signup experiment', 'Superseded by the checklist.', 'cancelled', 'none', 1, '');
INSERT INTO issue_labels VALUES (4, 2), (5, 1), (6, 2), (7, 2);
INSERT INTO _meta (key, value) VALUES ('issue_counter', '8'), ('identifier_prefix', 'TASK');
