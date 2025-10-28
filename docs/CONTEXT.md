# CyberPatriot Mint 21 Console

## 🧩 Overview
A graphical Linux Mint 21 hardening console built for **CyberPatriot training**.  
Users can visualize, modify, and automate system-security operations defined in the CyberPatriot Practice Image checklist.  
Unlike a static script, this GUI allows **manual labeling, drag-and-drop linking**, and **custom configuration** of every operation.

Built with:
- **Next.js 15 + TypeScript**
- **shadcn/ui + Tailwind CSS**
- **Framer Motion** for transitions
- Optional **Electron shell** for Mint desktop deployment
- **Node.js backend** for executing safe, whitelisted system commands

---

## 🎯 Goal
Provide a visual, modular interface that mirrors CyberPatriot checklists but allows **interactive control**:
- Label system users manually
- Link user nodes to permissions and account actions
- Configure every security item dynamically in the UI

---

## ⚙️ Core Concept — Node Graph System

### 1. User Labeling
- The GUI automatically lists all local users from `/etc/passwd` (UID ≥ 1000).  
- Each user is represented as a **node** on a draggable graph.
- The user manually labels each node as:
  - ✅ *Authorized Admin*  
  - 👤 *Standard User*  
  - 🚫 *Unauthorized User*
- These labels define what actions are available (demote, delete, randomize password, etc).

### 2. Settings Nodes
- The right side of the UI displays **configurable setting nodes**, one per checklist category:
  - Firewall
  - SSH
  - Updates
  - Services
  - Forensics
  - Prohibited Items
- Each node has sliders, toggles, or dropdowns for:
  - Enable/Disable firewall  
  - PermitRootLogin (yes/no)  
  - Auto-update interval  
  - Service states (e.g., Apache2 running)  
  - File scan paths (e.g., `/home/*/Music`)  

### 3. Node Linking
- Users can **drag arrows** between user nodes and setting nodes to define control relationships.  
  - Example: drag “tcolby” → “Admin Policy Node” to mark as admin.  
  - Example: drag “SSH Config Node” → “Disable Root Login” setting.  
- Each connection represents a pending configuration rule that can be executed or reverted.

---

## 🧠 Functional Groups (based on CyberPatriot checklist)

1. **Forensics**
   - View distro codename (via `lsb_release`)
   - Locate MP3 files in unauthorized directories

2. **Accounts**
   - Display all users and their groups
   - Manually label each user before any action
   - Available actions per label:
     - Demote to desktop user
     - Delete unauthorized user
     - Randomize password

3. **Firewall**
   - Toggle UFW on/off
   - Configure allow-list (SSH, HTTP)
   - Drag-link to network-related nodes

4. **Services**
   - Install/start Apache2
   - Verify SSH status
   - Disable SSH root login

5. **Updates**
   - Enable auto-updates
   - Run `apt full-upgrade`
   - Track specific packages (systemd, openssh, chromium, gimp)

6. **Prohibited**
   - Locate and delete MP3s under chosen directories
   - Remove unauthorized software (Wireshark, Ophcrack)

---

## 🧩 UI Architecture

### Layout
- **Left Sidebar:** Node graph of users (drag-sortable, colored by label)
- **Right Panel:** Settings nodes with adjustable controls
- **Top Bar:**  
  - “Scan System” → refresh node list  
  - “Apply Changes” → executes all linked operations  
  - “Revert” → rolls back last change  
  - “Export Report” → outputs Markdown summary

### Visuals
- **Font:** Inter  
- **Style:** glassmorphic, minimal, dark background  
- **Color Scheme:**  
  - Background: `#0f172a`  
  - Primary accent: `#22c55e`  
  - Warning: `#fbbf24`  
  - Danger: `#ef4444`  
- Smooth Framer Motion transitions and node animations (hover glow, snap-lines).

---

## 🧰 Components

- `Sidebar.tsx` → draggable user nodes (DnD-Kit or React Flow)
- `SettingsPanel.tsx` → all configuration nodes with sliders/toggles
- `LinkCanvas.tsx` → renders edges between nodes
- `OperationCard.tsx` → details + run/fix button
- `TopBar.tsx` → main control actions
- `StatusBadge.tsx` → shows state per operation
- `opsRegistry.ts` → safe backend commands and descriptions

---

## 🔐 Backend Behavior

Each operation corresponds to a key in `opsRegistry.ts`, e.g.:

```ts
export const OPS = {
  enableUfw: ["ufw", "--force", "enable"],
  allowSsh: ["ufw", "allow", "OpenSSH"],
  disableRootSsh: [
    "bash", "-lc",
    "sed -i 's/^#\\?PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config && systemctl reload ssh"
  ],
  fullUpgrade: ["apt", "update", "&&", "apt", "full-upgrade", "-y"],
  removeWireshark: ["apt", "purge", "-y", "wireshark*", "ophcrack*"]
};
