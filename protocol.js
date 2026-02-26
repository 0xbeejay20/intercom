'use strict'

/**
 * TaskFlow Protocol
 * Defines how CLI commands map to contract operations.
 * Extends the base Intercom protocol.
 */

const CHANNEL = 'taskflow-v1'

module.exports = {
  channel: CHANNEL,

  /**
   * Commands available in the terminal.
   * Each returns a tx object that gets submitted to the contract.
   */
  commands: {
    /**
     * /task_add --title "Fix login bug" --priority high --tags "bug,auth"
     */
    task_add: (args) => {
      if (!args.title) return { error: 'Usage: /task_add --title "..." [--desc "..."] [--priority low|normal|high|critical] [--tags "a,b"]' }
      return {
        op: 'task_add',
        title: args.title,
        desc: args.desc || '',
        priority: args.priority || 'normal',
        tags: args.tags || ''
      }
    },

    /**
     * /task_assign --id 3 --to <peer_address>
     */
    task_assign: (args) => {
      if (!args.id || !args.to) return { error: 'Usage: /task_assign --id <id> --to <peer_address>' }
      return { op: 'task_assign', id: parseInt(args.id), to: args.to }
    },

    /**
     * /task_done --id 3
     */
    task_done: (args) => {
      if (!args.id) return { error: 'Usage: /task_done --id <id>' }
      return { op: 'task_done', id: parseInt(args.id) }
    },

    /**
     * /task_list [--status open|assigned|done] [--priority high] [--limit 20]
     */
    task_list: (args) => {
      return {
        op: 'task_list',
        status: args.status || null,
        assignee: args.assignee || null,
        priority: args.priority || null,
        limit: args.limit ? parseInt(args.limit) : 20
      }
    },

    /**
     * /task_get --id 3
     */
    task_get: (args) => {
      if (!args.id) return { error: 'Usage: /task_get --id <id>' }
      return { op: 'task_get', id: parseInt(args.id) }
    }
  },

  /**
   * Format a task for terminal display.
   */
  formatTask (task) {
    const PRIORITY_ICON = { critical: '🔴', high: '🟠', normal: '🟡', low: '🟢' }
    const STATUS_ICON = { open: '⬜', assigned: '🔵', done: '✅' }
    const icon = PRIORITY_ICON[task.priority] || '⬜'
    const status = STATUS_ICON[task.status] || '?'
    const tags = task.tags && task.tags.length ? ` [${task.tags.join(', ')}]` : ''
    const assignee = task.assigned_to ? `\n     → assigned to: ${task.assigned_to.slice(0, 16)}...` : ''
    return `${status} #${task.id} ${icon} [${task.priority.toUpperCase()}] ${task.title}${tags}${assignee}`
  }
}
