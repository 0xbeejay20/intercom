# TaskFlow — P2P Task Coordinator

**TaskFlow** is a decentralized, gas-free task management app built on [Trac Network](https://tracsystems.io) using the [Intercom](https://github.com/Trac-Systems/intercom) stack.

Multiple peers share a replicated task board over P2P. No server, no central database, no gas fees.

> Built for the [Intercom Vibe Competition](https://github.com/Trac-Systems/awesome-intercom)

---

## Trac Address (for reward payouts)

```
trac10sn2k6d3py0rswn5x2qsq5pk4waf7e5vxc048zp2lwq50r0j89tswu2net
```

---

## What It Does

- **Create tasks** with title, description, priority and tags
- **Assign tasks** to any peer by their address
- **Mark tasks done** from any connected peer
- **List & filter tasks** by status, priority, or assignee
- **P2P sync** — all peers stay in sync automatically

---

## Quick Start

```bash
git clone https://github.com/0xbeejay20/intercom
cd intercom
npm install -g pear
npm install
pear run . store1
```

**First run only:** Choose option 1) → copy your Peer Writer key → paste it into `index.js` replacing `REPLACE_WITH_YOUR_PEER_WRITER_KEY` → type `/exit` → run again.

---

## Usage

```
/task_add --title "Write tests" --priority high --tags "dev,testing"
/task_assign --id 1 --to <peer_address>
/task_done --id 1
/task_list
/task_list --status open
/task_list --priority critical
/task_get --id 1
```

Or as raw transactions:
```
/tx --command '{ "op": "task_add", "title": "Deploy to prod", "priority": "critical" }'
```

---

## Proof

![TaskFlow running](proof.png)

---

## Links

- This fork: https://github.com/0xbeejay20/intercom
- Upstream: https://github.com/Trac-Systems/intercom
- Competition: https://github.com/Trac-Systems/awesome-intercom

---

## License

Based on the Intercom reference implementation by Trac Systems. MIT License.
