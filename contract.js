'use strict'

/**
 * TaskFlow Contract
 * P2P Task Coordinator on Trac Network
 *
 * Supported ops:
 *   task_add    - create a new task
 *   task_assign - assign task to a peer
 *   task_done   - mark task as complete
 *   task_list   - list tasks with optional filters
 *   task_get    - get a single task by id
 */

const tasks = {}
let next_id = 1

const contract = {}

contract.apply = async function (tx, meta) {
  const op = (tx && tx.op) ? tx.op : null

  if (op === 'task_add')    return _task_add(tx, meta)
  if (op === 'task_assign') return _task_assign(tx, meta)
  if (op === 'task_done')   return _task_done(tx, meta)
  if (op === 'task_list')   return _task_list(tx)
  if (op === 'task_get')    return _task_get(tx)

  return { error: 'unknown_op', op }
}

contract.snapshot = function () {
  return { tasks, next_id }
}

contract.restore = function (snap) {
  if (!snap) return
  Object.assign(tasks, snap.tasks || {})
  next_id = snap.next_id || 1
}

// ── Handlers ─────────────────────────────────────────────────────────────────

function _task_add (tx, meta) {
  const title    = (tx.title || '').trim()
  const desc     = (tx.desc  || '').trim()
  const priority = tx.priority || 'normal'
  const tags     = tx.tags || ''

  if (!title) return { error: 'title_required' }

  const valid_priorities = ['low', 'normal', 'high', 'critical']
  if (!valid_priorities.includes(priority)) {
    return { error: 'invalid_priority', valid: valid_priorities }
  }

  const id   = next_id++
  const task = {
    id,
    title,
    desc,
    priority,
    tags:        tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    status:      'open',
    created_by:  meta ? meta.sender : 'unknown',
    assigned_to: null,
    done_by:     null,
    created_at:  Date.now(),
    updated_at:  Date.now(),
    done_at:     null
  }

  tasks[id] = task
  return { ok: true, task }
}

function _task_assign (tx, meta) {
  const id   = parseInt(tx.id)
  const to   = (tx.to || '').trim()
  const task = tasks[id]

  if (!task) return { error: 'not_found', id }
  if (!to)   return { error: 'to_required' }
  if (task.status === 'done') return { error: 'task_already_done' }

  task.assigned_to = to
  task.status      = 'assigned'
  task.updated_at  = Date.now()

  return { ok: true, task }
}

function _task_done (tx, meta) {
  const id   = parseInt(tx.id)
  const task = tasks[id]

  if (!task) return { error: 'not_found', id }
  if (task.status === 'done') return { error: 'task_already_done' }

  task.status     = 'done'
  task.done_by    = meta ? meta.sender : 'unknown'
  task.done_at    = Date.now()
  task.updated_at = Date.now()

  return { ok: true, task }
}

function _task_list (tx) {
  const status   = tx.status   || null
  const priority = tx.priority || null
  const assignee = tx.assignee || null
  const limit    = Math.min(parseInt(tx.limit) || 20, 100)

  let list = Object.values(tasks)

  if (status)   list = list.filter(t => t.status === status)
  if (priority) list = list.filter(t => t.priority === priority)
  if (assignee) list = list.filter(t => t.assigned_to === assignee)

  const p_order = { critical: 0, high: 1, normal: 2, low: 3 }
  list.sort((a, b) => {
    const pd = (p_order[a.priority] || 2) - (p_order[b.priority] || 2)
    return pd !== 0 ? pd : b.created_at - a.created_at
  })

  return { ok: true, tasks: list.slice(0, limit), total: list.length }
}

function _task_get (tx) {
  const id   = parseInt(tx.id)
  const task = tasks[id]
  if (!task) return { error: 'not_found', id }
  return { ok: true, task }
}

module.exports = contract
