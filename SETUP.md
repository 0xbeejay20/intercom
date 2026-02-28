# TaskFlow Setup Guide (Windows)

Follow these steps exactly. Do NOT skip any step.

---

## Prerequisites

1. Install **Node.js LTS** from https://nodejs.org
2. Install **Git** from https://git-scm.com/download/win (keep all defaults)

---

## Step 1 — Move to a folder with NO spaces in the path

This is critical on Windows. Open **Git Bash as Administrator** and run:

```bash
mkdir /c/taskflow
cd /c/taskflow
```

---

## Step 2 — Copy files here

Copy all the files from this repo into `C:\taskflow` so your folder looks like:
```
C:\taskflow\
  index.js
  package.json
  contract\
    contract.js
    protocol.js
  SKILL.md
  README.md
```

---

## Step 3 — Install dependencies

In Git Bash inside `C:\taskflow`:

```bash
npm install -g pear
npm install
```

---

## Step 4 — Fix Pear PATH

```bash
export PATH="$APPDATA/pear/bin:$PATH"
```

Or on Windows CMD:
```cmd
set PATH=C:\Users\%USERNAME%\AppData\Roaming\pear\bin;%PATH%
```

---

## Step 5 — Complete Pear setup

```bash
pear run pear://runtime
```

Wait for it to open and close. Then:

```bash
pear run . store1
```

---

## Step 6 — First run setup

When the app loads:
1. Choose **option 1)** to create your identity
2. Copy the **Peer Writer key** shown (starts with `trac1...`)
3. Open `index.js` in a text editor
4. Replace `REPLACE_WITH_YOUR_PEER_WRITER_KEY` with your key
5. Type `/exit` in the terminal
6. Run again: `pear run . store1`
7. Type: `/add_admin --address YOUR_PEER_ADDRESS`
8. Type: `/set_auto_add_writers --enabled 1`

---

## Step 7 — Test it works

```
/task_add --title "My first task" --priority high
/task_list
```

Take a screenshot — this is your proof!

---

## Troubleshooting

**Error: Cannot use import statement outside a module**
→ Run `pear run pear://runtime` first to update Pear, then try again

**Error: No matching version found for trac-peer**
→ Make sure package.json has `"trac-peer": "0.4.5"` (not `^1.0.0`)

**Error: ERR_INVALID_PROJECT_DIR**
→ You are running from a path with spaces. Move to `C:\taskflow` and try again

**pear: command not found**
→ Run the PATH export command in Step 4 first
