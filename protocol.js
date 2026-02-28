'use strict'

/**
 * TaskFlow Protocol
 * Maps terminal commands to contract operations.
 * trac-peer calls protocol.commands[name](args) to build the tx object.
 */

const protocol = {}

protocol.channel = 'taskflow-v1'

protocol.commands = {

  /**
   * /task_add --title "Fix bug" --priority high --tags "bug,auth" --desc "optional"
   */
  task_add: function (args) {
    if (!args.title) {
      return { _error: 'Usage: /task_add --title "..." [--desc "..."] [--priority low|normal|high|critical] [--tags "a,b"]' }
    }
    return {
      op:       'task_add',
      title:    args.title,
      desc:     args.desc     || '',
      priority: args.priority || 'normal',
      tags:     args.tags     || ''
    }
  },

  /**
   * /task_assign --id 1 --to <peer_address>
   */
  task_assign: function (args) {
    if (!args.id || !args.to) {
      return { _error: 'Usage: /task_assign --id <number> --to <peer_address>' }
    }
    return { op: 'task_assign', id: parseInt(args.id), to: args.to }
  },

  /**
   * /task_done --id 1
   */
  task_done: function (args) {
    if (!args.id) {
      return { _error: 'Usage: /task_done --id <number>' }
    }
    return { op: 'task_done', id: parseInt(args.id) }
  },

  /**
   * /task_list [--status open|assigned|done] [--priority high] [--limit 20]
   */
  task_list: function (args) {
    return {
      op:       'task_list',
      status:   args.status   || null,
      priority: args.priority || null,
      assignee: args.assignee || null,
      limit:    args.limit    || 20
    }
  },

  /**
   * /task_get --id 1
   */
  task_get: function (args) {
    if (!args.id) {
      return { _error: 'Usage: /task_get --id <number>' }
    }
    return { op: 'task_get', id: parseInt(args.id) }
  }

}

module.exports = protocol
