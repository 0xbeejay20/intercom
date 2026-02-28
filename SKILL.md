---
name: taskflow
description: >
  P2P Task Coordinator built on Trac Network (Intercom fork).
  Use when users want to create, assign, complete, or list tasks
  over a decentralized peer-to-peer network with no gas fees.
---

# TaskFlow — SKILL.md

TaskFlow is a P2P task management app on Trac Network built on the Intercom stack.

## Trac Address

```
trac10sn2k6d3py0rswn5x2qsq5pk4waf7e5vxc048zp2lwq50r0j89tswu2net
```

## Runtime

**Always use Pear. Never run with native node.**

```bash
npm install -g pear
npm install
pear run . store1
```

## First Run (Bootstrap / Admin — Do Once)

1. Run `pear run . store1`
2. Choose **option 1)** → generates your peer identity
3. Copy the **Peer Writer key** shown on screen
4. Open `index.js` → replace `REPLACE_WITH_YOUR_PEER_WRITER_KEY` with it
5. Type `/exit` → run again: `pear run . store1`
6. In the terminal: `/add_admin --address <YourPeerAddress>`
7. Enable others: `/set_auto_add_writers --enabled 1`

## Commands

### Create a task
```
/task_add --title "Fix login bug" --priority high --tags "bug,auth"
```
Or:
```
/tx --command '{ "op": "task_add", "title": "Fix login bug", "priority": "high", "tags": "bug,auth" }'
```

### Assign a task
```
/task_assign --id 1 --to <peer_address>
```

### Complete a task
```
/task_done --id 1
```

### List tasks
```
/task_list
/task_list --status open
/task_list --status done
/task_list --priority critical
/task_list --limit 50
```

### Get one task
```
/task_get --id 1
```

## Priority Values
`low` | `normal` | `high` | `critical`

## Status Flow
```
open → assigned → done
```

## Task Object
```json
{
  "id": 1,
  "title": "Fix login bug",
  "desc": "",
  "priority": "high",
  "tags": ["bug", "auth"],
  "status": "open",
  "created_by": "<peer_key>",
  "assigned_to": null,
  "done_by": null,
  "created_at": 1700000000000,
  "updated_at": 1700000000000,
  "done_at": null
}
```

## Agent Notes
- Submit ops via `/tx --command '{...}'` (JSON string)
- IDs are integers — do not quote them in JSON
- `task_list` is read-only, does not modify state
- Any peer can mark tasks done (no ownership check in v1)
