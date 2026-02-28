'use strict'

const peer = require('trac-peer')

// ─── YOUR BOOTSTRAP ADDRESS (fill in after first run) ────────────────────────
// Step 1: Run once, choose option 1), copy your Peer Writer key shown on screen
// Step 2: Paste it below replacing REPLACE_WITH_YOUR_PEER_WRITER_KEY
// Step 3: Run again - you are now the bootstrap admin
const bootstrap = 'REPLACE_WITH_YOUR_PEER_WRITER_KEY'
// ─────────────────────────────────────────────────────────────────────────────

const peer_opts = {}

// Bootstrap / contract address - your peer writer key from first run
peer_opts.bootstrap = bootstrap

// Subnet channel name - must be exactly 32 chars
peer_opts.subnet_channel = 'taskflow-main-v1-0000000000000000'

// App name shown in terminal
peer_opts.app_name = 'TaskFlow'

// Store name from CLI argument e.g. "store1"
peer_opts.store_name = process.argv[2] || 'store1'

// Load our custom contract
peer_opts.contract = require('./contract/contract')

// Load our custom protocol (commands)
peer_opts.protocol = require('./contract/protocol')

// Allow API access for transactions and messages
peer_opts.api_tx_exposed = false
peer_opts.api_msg_exposed = false

// Enable logs
peer_opts.enable_logs = true
peer_opts.enable_txlogs = true

peer(peer_opts)
