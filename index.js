'use strict'

/**
 * TaskFlow — P2P Task Coordinator on Trac Network
 * Forked from https://github.com/Trac-Systems/intercom
 *
 * Run:
 *   pear run . store1
 *
 * First run (Bootstrap / admin):
 *   1. Choose option 1) to generate identity
 *   2. Copy your Peer Writer key (your contract address)
 *   3. Paste it into BOOTSTRAP_ADDRESS below
 *   4. /exit, then pear run . store1 again
 *   5. /add_admin --address <YourPeerAddress>
 *   6. /set_auto_add_writers --enabled 1   (to allow others to join)
 */

// ─── CONFIGURE YOUR BOOTSTRAP ADDRESS HERE ───────────────────────────────────
const BOOTSTRAP_ADDRESS = 'REPLACE_WITH_YOUR_PEER_WRITER_KEY'
const APP_CHANNEL = 'taskflow-main-v1'          // must be exactly 32 chars padded
// ──────────────────────────────────────────────────────────────────────────────

const Contract  = require('./contract/contract')
const Protocol  = require('./contract/protocol')

// Peer / Trac runtime — resolved from the installed trac-peer package
let TracPeer
try {
  TracPeer = require('trac-peer')
} catch (_) {
  console.error('[TaskFlow] Could not load trac-peer. Run: npm install')
  process.exit(1)
}

async function main () {
  const storeName = process.argv[2] || 'store1'

  const peer_opts = {
    bootstrap: BOOTSTRAP_ADDRESS,
    channel: APP_CHANNEL.padEnd(32, ' ').slice(0, 32),
    store_name: storeName,
    contract: new Contract(),
    protocol: Protocol,
    app_name: 'TaskFlow',
    app_version: '1.0.0',
    banner: `
╔══════════════════════════════════════════════╗
║  TaskFlow — P2P Task Coordinator             ║
║  Built on Trac Network / Intercom            ║
╚══════════════════════════════════════════════╝

Commands:
  /task_add    --title "..." [--desc "..."] [--priority low|normal|high|critical] [--tags "a,b"]
  /task_assign --id <n> --to <peer_address>
  /task_done   --id <n>
  /task_list   [--status open|assigned|done] [--priority high] [--limit 20]
  /task_get    --id <n>

Standard Intercom commands (chat, sidechannels, etc.) also available.
Type /help for full command list.
`
  }

  const peer = new TracPeer(peer_opts)
  await peer.start()
}

main().catch(err => {
  console.error('[TaskFlow] Fatal:', err)
  process.exit(1)
})
