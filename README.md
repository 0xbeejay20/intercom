# TaskFlow — P2P Task Coordinator

**TaskFlow** is a decentralized, gas-free task management app built on [Trac Network](https://tracsystems.io) using the [Intercom](https://github.com/Trac-Systems/intercom) stack and Pear Runtime.

Multiple peers share a replicated task board over a P2P network. No server, no central database, no gas fees. Tasks are stored in a Trac smart contract and synced across all connected peers automatically.

> Built for the [Intercom Vibe Competition](https://github.com/Trac-Systems/awesome-intercom)

---

## Trac Address (for reward payouts)

```
trac10sn2k6d3py0rswn5x2qsq5pk4waf7e5vxc048zp2lwq50r0j89tswu2net
```

---

## What It Does

- **Create tasks** with title, description, priority (`low` / `normal` / `high` / `critical`), and tags
- **Assign tasks** to any peer by their Trac address
- **Mark tasks done** from any connected peer
- **List & filter tasks** by status, priority, or assignee
- **Works across peers** — all nodes stay in sync via P2P replication

---

## Quick Start

```bash
git clone https://github.com/0xbeejay20/intercom
cd intercom
npm install -g pear
npm install
npm pkg set overrides.trac-wallet=1.0.1
rm -rf node_modules package-lock.json
npm install
pear run . store1
```

On first run, follow the bootstrap setup in [SKILL.md](./SKILL.md).

---

## Usage

```bash
# Create a task
/task_add --title "Write tests" --priority high --tags "dev,testing"

# Assign it
/task_assign --id 1 --to <peer_address>

# Mark done
/task_done --id 1

# List open tasks
/task_list --status open

# List all critical tasks
/task_list --priority critical

# Get a specific task
/task_get --id 1
```

All commands can also be sent as raw contract transactions:
```bash
/tx --command '{ "op": "task_add", "title": "Deploy to prod", "priority": "critical" }'
```

---

## Architecture

```
taskflow/
├── index.js               # Entry point — Trac peer setup
├── contract/
│   ├── contract.js        # Task state machine (add/assign/done/list/get)
│   └── protocol.js        # CLI command → contract op mapping
├── SKILL.md               # Agent instruction file
├── README.md              # This file
└── package.json
```

---

## Why TaskFlow?

Most task managers are centralized or require gas for every action. TaskFlow uses Trac Network's Intercom stack for:

- **Zero-fee transactions** — no gas, no fees
- **True P2P sync** — no cloud backend
- **Agent-ready** — SKILL.md makes it easy for AI agents to manage tasks via natural language
- **Composable** — can be extended with TNK payments, deadlines, or voting via Trac contracts

---

## Competition Links

- This fork: https://github.com/0xbeejay20/intercom
- Upstream Intercom: https://github.com/Trac-Systems/intercom
- Awesome Intercom list: https://github.com/Trac-Systems/awesome-intercom

---

## Proof

See `screenshots/` folder for proof the app runs.

---

## License

Based on the Intercom reference implementation by Trac Systems. MIT License.
