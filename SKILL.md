---
name: taskflow
description: >
  P2P Task Coordinator built on Trac Network (Intercom fork).
  Use when users want to create, assign, complete, or list tasks
  over a decentralized peer-to-peer network with no gas fees.
  All task operations are sent as /tx commands to the Trac contract.
---

# TaskFlow — SKILL.md

TaskFlow is a peer-to-peer task management app built on [Trac Network](https://tracsystems.io)
using the [Intercom](https://github.com/Trac-Systems/intercom) stack.
Tasks are stored in a shared replicated contract state across all connected peers.
No server, no gas, no central authority.

---

## Runtime Requirement

**Always use Pear runtime. Never run with native node.**

```bash
npm install -g pear
npm install
npm pkg set overrides.trac-wallet=1.0.1
rm -rf node_modules package-lock.json
npm install
pear run . store1
```

---

## First-Run: Bootstrap Setup (Admin Only — Do Once)

1. Run `pear run . store1`
2. Choose **option 1)** → generates your peer identity (wallet)
3. Copy the **Peer Writer key** shown in the Peer section
4. Open `index.js` and replace `trac10sn2k6d3py0rswn5x2qsq5pk4waf7e5vxc048zp2lwq50r0j89tswu2net` with that key
5. Type `/exit` and run again: `pear run . store1`
6. In the terminal: `/add_admin --address <YourPeerAddress>`
7. Enable others to join: `/set_auto_add_writers --enabled 1`

Your node is now the bootstrap and admin for the TaskFlow network.

---

## Running a Second Peer (for testing / joining)

Use the exact same `index.js` configuration (same `BOOTSTRAP_ADDRESS` and `APP_CHANNEL`):

```bash
pear run . store2
```

Both peers will sync task state automatically over the P2P network.

---

## Task Commands

All task commands are submitted as contract transactions using `/tx`:

### Create a task
```
/tx --command '{ "op": "task_add", "title": "Fix login bug", "priority": "high", "tags": "bug,auth" }'
```
Or using the shortcut command:
```
/task_add --title "Fix login bug" --priority high --tags "bug,auth"
```

**Fields:**
- `title` *(required)* — task title, max 200 chars
- `desc` *(optional)* — longer description
- `priority` *(optional)* — `low` | `normal` (default) | `high` | `critical`
- `tags` *(optional)* — comma-separated tags

---

### Assign a task to a peer
```
/task_assign --id 3 --to <peer_address>
```
Or:
```
/tx --command '{ "op": "task_assign", "id": 3, "to": "trac1abc...xyz" }'
```

---

### Mark a task done
```
/task_done --id 3
```
Or:
```
/tx --command '{ "op": "task_done", "id": 3 }'
```

---

### List tasks
```
/task_list
/task_list --status open
/task_list --status assigned
/task_list --status done
/task_list --priority critical
/task_list --limit 50
```
Or:
```
/tx --command '{ "op": "task_list", "status": "open", "limit": 20 }'
```

**Filter fields:**
- `status`: `open` | `assigned` | `done`
- `priority`: `low` | `normal` | `high` | `critical`
- `assignee`: peer address string
- `limit`: integer, max 100

---

### Get a single task
```
/task_get --id 3
```
Or:
```
/tx --command '{ "op": "task_get", "id": 3 }'
```

---

## Task Object Schema

```json
{
  "id": 1,
  "title": "Fix login bug",
  "desc": "Users cannot login with email on mobile",
  "priority": "high",
  "tags": ["bug", "auth"],
  "status": "assigned",
  "created_by": "<peer_writer_key>",
  "assigned_to": "<peer_writer_key>",
  "done_by": null,
  "created_at": 1700000000000,
  "updated_at": 1700000001000,
  "done_at": null
}
```

---

## Status Flow

```
open  →  assigned  →  done
  └──────────────────→ done  (skip assign if needed)
```

---

## Agent Usage Notes

- Always submit ops via `/tx --command '{...}'` (JSON string)
- Integer IDs only — do not quote the id value in JSON
- `task_list` is read-only; it does not modify state
- `task_done` can be called by any peer (no ownership restriction in v1)
- The contract is deterministic: all peers will converge to the same state
- To watch live task updates, join the sidechannel: `/sc_join --channel "taskflow-v1"`

---

## Trac Address (for reward payouts)

```
trac10sn2k6d3py0rswn5x2qsq5pk4waf7e5vxc048zp2lwq50r0j89tswu2net
```

---

## Repository

- Fork: https://github.com/0xbeejay20/intercom
- Upstream: https://github.com/Trac-Systems/intercom
