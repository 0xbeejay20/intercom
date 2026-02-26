'use strict'

/**
 * TaskFlow Contract
 * P2P Task Coordinator built on Intercom (Trac Network)
 *
 * Operations:
 *   task_add    – create a task
 *   task_assign – assign a task to a peer address
 *   task_done   – mark a task complete
 *   task_list   – list tasks (filter by status/assignee)
 *   task_get    – get a single task by id
 */

class Contract {
  constructor () {
    this.tasks = {}      // id -> task object
    this.nextId = 1
  }

  /**
   * Called by the Trac runtime for every committed transaction.
   * `tx` shape: { op, ...fields }
   * `meta` shape: { sender: <peer writer key> }
   */
  async apply (tx, meta) {
    const op = tx.op

    if (op === 'task_add') {
      return this._taskAdd(tx, meta)
    } else if (op === 'task_assign') {
      return this._taskAssign(tx, meta)
    } else if (op === 'task_done') {
      return this._taskDone(tx, meta)
    } else if (op === 'task_list') {
      return this._taskList(tx)
    } else if (op === 'task_get') {
      return this._taskGet(tx)
    }

    return { error: 'unknown_op' }
  }

  _taskAdd (tx, meta) {
    const { title, desc = '', priority = 'normal', tags = '' } = tx
    if (!title || title.trim().length === 0) {
      return { error: 'title_required' }
    }
    const validPriorities = ['low', 'normal', 'high', 'critical']
    if (!validPriorities.includes(priority)) {
      return { error: 'invalid_priority', valid: validPriorities }
    }

    const id = this.nextId++
    const task = {
      id,
      title: title.trim(),
      desc: desc.trim(),
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'open',
      created_by: meta.sender,
      assigned_to: null,
      created_at: Date.now(),
      updated_at: Date.now()
    }
    this.tasks[id] = task
    return { ok: true, task }
  }

  _taskAssign (tx, meta) {
    const { id, to } = tx
    const task = this.tasks[id]
    if (!task) return { error: 'not_found', id }
    if (!to) return { error: 'to_required' }
    if (task.status === 'done') return { error: 'task_already_done' }

    task.assigned_to = to
    task.status = 'assigned'
    task.updated_at = Date.now()
    return { ok: true, task }
  }

  _taskDone (tx, meta) {
    const { id } = tx
    const task = this.tasks[id]
    if (!task) return { error: 'not_found', id }
    if (task.status === 'done') return { error: 'task_already_done' }

    task.status = 'done'
    task.done_by = meta.sender
    task.done_at = Date.now()
    task.updated_at = Date.now()
    return { ok: true, task }
  }

  _taskList (tx) {
    const { status, assignee, priority, limit = 20 } = tx
    let list = Object.values(this.tasks)

    if (status) list = list.filter(t => t.status === status)
    if (assignee) list = list.filter(t => t.assigned_to === assignee)
    if (priority) list = list.filter(t => t.priority === priority)

    // Sort: critical first, then by created_at desc
    const pOrder = { critical: 0, high: 1, normal: 2, low: 3 }
    list.sort((a, b) => {
      const pd = pOrder[a.priority] - pOrder[b.priority]
      if (pd !== 0) return pd
      return b.created_at - a.created_at
    })

    return { ok: true, tasks: list.slice(0, Math.min(limit, 100)), total: list.length }
  }

  _taskGet (tx) {
    const { id } = tx
    const task = this.tasks[id]
    if (!task) return { error: 'not_found', id }
    return { ok: true, task }
  }

  /**
   * Snapshot — Trac runtime calls this to persist state.
   */
  snapshot () {
    return { tasks: this.tasks, nextId: this.nextId }
  }

  /**
   * Restore from snapshot.
   */
  restore (snap) {
    if (snap) {
      this.tasks = snap.tasks || {}
      this.nextId = snap.nextId || 1
    }
  }
}

module.exports = Contract
