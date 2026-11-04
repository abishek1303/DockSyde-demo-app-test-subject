import test from 'node:test';
import assert from 'node:assert/strict';

const base = new URL(process.env.REQUEST_DESK_TEST_URL ?? 'http://localhost:5173');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Use a local test runtime.');
async function request(method, path, data) {
  const response = await fetch(new URL(path, base), { method, headers: { 'Content-Type': 'application/json' }, ...(data ? { body: JSON.stringify(data) } : {}) });
  return { status: response.status, data: await response.json() };
}
const date = days => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

test('workload counts active deadlines and bulk triage validates and updates atomically', async () => {
  const ids = [];
  let projectId;
  try {
    const before = await request('GET', '/api/workload');
    assert.equal(before.status, 200);
    const project = await request('POST', '/api/projects', { name: `Integration workspace ${Date.now()}` });
    assert.equal(project.status, 201); projectId = project.data.project.id;
    for (const [status, due_date, project_id] of [
      ['todo', date(-2), null], ['in_progress', date(3), projectId], ['done', date(-3), null], ['cancelled', date(1), null],
    ]) {
      const created = await request('POST', '/api/issues', { title: `Integration issue ${Date.now()}`, status, due_date, project_id, priority: 'low' });
      assert.equal(created.status, 201); ids.push(created.data.issue.id);
    }
    const overview = (await request('GET', '/api/workload')).data;
    assert.equal(overview.totals.active, before.data.totals.active + 2);
    assert.equal(overview.totals.overdue, before.data.totals.overdue + 1);
    assert.equal(overview.totals.upcoming, before.data.totals.upcoming + 1);
    assert.equal(overview.totals.unprojected, before.data.totals.unprojected + 1);
    assert.ok(!overview.deadlines.some(issue => [ids[2], ids[3]].includes(issue.id)));
    assert.ok(overview.deadlines.length <= 10);
    for (const body of [{ ids: [] }, { ids: [ids[0]] }, { ids: [ids[0]], status: 'invalid' }, { ids: [ids[0]], priority: 'invalid' }, { ids: Array(101).fill(ids[0]), status: 'done' }, { ids: [ids[0]], title: 'Forbidden field', status: 'done' }]) {
      assert.equal((await request('POST', '/api/issues/bulk', body)).status, 400);
    }
    assert.equal((await request('POST', '/api/issues/bulk', { ids: [ids[0], 2147483647], status: 'done' })).status, 404);
    assert.equal((await request('GET', `/api/issues/${ids[0]}`)).data.issue.status, 'todo', 'Missing selection must not partially update the others.');
    const updated = await request('POST', '/api/issues/bulk', { ids: [ids[0], ids[1], ids[0]], status: 'done', priority: 'urgent' });
    assert.equal(updated.status, 200);
    assert.deepEqual(updated.data.updatedIds.sort((a, b) => a - b), ids.slice(0, 2).sort((a, b) => a - b));
    for (const id of ids.slice(0, 2)) {
      const issue = (await request('GET', `/api/issues/${id}`)).data.issue;
      assert.equal(issue.status, 'done'); assert.equal(issue.priority, 'urgent');
    }
    const after = (await request('GET', '/api/workload')).data;
    assert.equal(after.totals.active, before.data.totals.active);
    assert.equal(after.totals.overdue, before.data.totals.overdue);
    assert.equal(after.totals.upcoming, before.data.totals.upcoming);
  } finally {
    for (const id of ids) await request('DELETE', `/api/issues/${id}`);
    if (projectId) await request('DELETE', `/api/projects/${projectId}`);
  }
});
