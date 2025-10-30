# CyberPatriot Mint21 Training Console - Usage Guide

## Overview

A comprehensive GUI application for CyberPatriot training on Linux Mint 21. Built with Next.js, React, and shadcn/ui components.

## Prerequisites

- **Operating System**: Linux Mint 21 (required for all operations)
- **Node.js**: v18 or higher
- **Permissions**: sudo access required for system operations
- **Optional Tools**: 
  - `tshark` for PCAP analysis
  - `steghide` for steganography extraction

## Installation

### Quick Install

```bash
chmod +x install-and-run.sh
./install-and-run.sh
```

### Manual Install

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or build for production
npm run build
npm start
```

## Features

### 1. Dashboard

- **System Overview**: View total users, admin accounts, firewall status
- **Recent Operations**: Track all executed commands
- **Security Alerts**: Real-time warnings for security issues
- **Scoring Verification**: One-click verification of all security configurations

### 2. Forensics

#### Scan Running Services
- Lists all active services and processes
- Shows PID, user, command, and listening ports
- Kill processes directly from the interface

#### Detect/Remove Backdoors
- Default path: `/usr/share/zod/kneelB4zod.py`
- Actions:
  - **Detect**: Check if file exists and if processes are running
  - **Terminate**: Kill all matching processes (`pkill -f`)
  - **Delete**: Remove the file (`rm -f`)

#### PCAP Analysis
- Analyze packet capture files with tshark
- Extract TCP streams by number
- Grep for USER/PASS credentials
- View decoded output

#### Steganography Decoder
- Extract hidden messages from images using steghide
- Requires passphrase
- Displays extracted message and MD5 hash

### 3. Users & Groups

#### User Management
- View all system users (UID >= 1000)
- See UID, home directory, groups
- **Manual Authorization Required**: Mark users as:
  - Authorized (Admin)
  - Authorized (Standard)
  - Unauthorized

#### User Actions
- **Remove User**: Delete user and home directory (requires "Unauthorized" label)
- **Remove Admin Rights**: Remove user from sudo group
- **Create Group**: Add new system groups
- **Add Members to Group**: Bulk add users to groups (CSV format)

**Commands Used:**
```bash
sudo deluser --remove-home [user]
sudo gpasswd -d [user] sudo
sudo addgroup [group]
sudo gpasswd -M user1,user2 [group]
```

### 4. Password Policy

#### System-Wide Policies
- **Minimum Password Length**: Set minlen in PAM (8-32 characters)
- **Remember Previous Passwords**: Prevent password reuse (0-24 passwords)
- **Lockout on Failed Logins**: Lock account after multiple failed attempts
- **Reset Lockout on Success**: Reset failed count on successful login
- **Notify on Account Lockout**: Show notification when account is locked
- **Disable Null Passwords**: Remove nullok from PAM configuration

#### Per-User Settings
- **Maximum Password Age**: Set password expiration (1-365 days)
- Uses `chage -M` command

**Files Modified:**
- `/etc/pam.d/common-password`
- `/etc/pam.d/common-auth`
- `/usr/share/pam-configs/*`
- Automatic backups created with timestamps

### 5. System Security

#### Kernel Security Features
- **ASLR (Address Space Layout Randomization)**
  - Randomizes memory addresses to prevent exploitation
  - Sets `kernel.randomize_va_space=2` in `/etc/sysctl.conf`

- **TCP SYN Cookies**
  - Protects against SYN flood attacks
  - Sets `net.ipv4.tcp_syncookies=1` in `/etc/sysctl.conf`

#### Firewall (UFW)
- Enable/disable UFW firewall
- View current status and rules
- Applies changes with `sudo ufw enable/disable`

### 6. Services

#### Service Management
- List all active services
- View service status (active/inactive, enabled/disabled)
- Enable or disable services

#### Quick Actions
- **Disable nginx**: `sudo systemctl disable --now nginx`
- **Disable squid**: `sudo systemctl disable --now squid` (may take ~1 minute)
- **Ensure vsftpd Running**: `sudo systemctl enable --now vsftpd`

#### Guardrails
- **vsftpd is protected**: Cannot be disabled through the interface
- Prevents scoring penalties from disabling required services

### 7. Cleanup & Updates

#### System Updates
- Run full system update: `sudo apt update && sudo apt full-upgrade -y`
- May take several minutes
- Uses non-interactive mode with safe defaults

#### Media File Cleanup
- Scan for .ogg files using `locate` and `find`
- Multi-select files for deletion
- Confirm before deletion

#### Unauthorized Software Removal
- Delete `/usr/games/pyrdp-master.zip`
- Purge `doona` package
- Purge `xprobe` package
- One-click removal of all unauthorized software

### 8. Logs

#### Features
- Real-time operation log with timestamps
- Filter by:
  - Text search (operation name or ID)
  - Status (all/success/error/pending)
- View stdout and stderr for each operation
- Copy individual log entries to clipboard
- Export all logs to text file

## Dry-Run Mode

Toggle dry-run mode from the top bar to preview commands before execution. When enabled:
- Shows commands that would be executed
- No actual system changes are made
- Useful for learning and verification

## Check for Updates

Click "Check Updates" in the top bar to:
- Check for new versions from GitHub
- View release notes
- Get download link for updates

## Re-run Scoring Verification

From the Dashboard, click "Verify All" to check:
- ✓ UFW Firewall Active
- ✓ ASLR Enabled
- ✓ TCP SYN Cookies Enabled
- ✓ nginx Disabled
- ✓ squid Disabled
- ✓ vsftpd Active
- ✓ Backdoor Removed
- ✓ pyrdp Archive Removed
- ✓ doona Package Removed
- ✓ xprobe Package Removed

## Safety Features

### Automatic Backups
All file edits create timestamped backups:
```
/etc/pam.d/common-password.backup-2024-10-30-14-30-00
```

### Confirmation Dialogs
All destructive actions require confirmation:
- User removal
- File deletion
- Service changes
- System updates

### Guardrails
- vsftpd cannot be disabled
- Users must be marked "Unauthorized" before removal
- Warning about critical FTP files

## Troubleshooting

### "Unexpected token '<', "<!DOCTYPE "..." Error

This occurs when running on Windows or when the server returns HTML instead of JSON.

**Solution**: Ensure you're running on Linux Mint 21. The application includes platform checks and will show appropriate error messages.

### Permission Denied Errors

Most operations require sudo access. Ensure:
1. Your user is in the sudo group
2. You can run `sudo` commands without password (for automation)
3. Configure sudoers if needed: `sudo visudo`

### Missing Tools

Install optional tools as needed:
```bash
sudo apt install tshark steghide
```

## Development

### Project Structure
```
app/
  api/              # API routes for all operations
  page.tsx          # Main application entry
components/
  views/            # Main view components
  ui/               # shadcn/ui components
lib/
  context/          # React context for state
  safe-edit.ts      # Safe file editing utilities
  types.ts          # TypeScript types
```

### Adding New Features

1. Create API route in `app/api/[feature]/route.ts`
2. Add view component in `components/views/[Feature]View.tsx`
3. Update sidebar navigation in `components/Sidebar.tsx`
4. Add route in `app/page.tsx`

## Best Practices

1. **Always scan system first** to load current state
2. **Mark user authorization** before making changes
3. **Use dry-run mode** to preview commands
4. **Check logs** after each operation
5. **Run verification** after making changes
6. **Export logs** for documentation

## Security Notes

- All operations are logged with timestamps
- Backups are created automatically
- Guardrails prevent common mistakes
- Confirmation required for destructive actions
- Platform checks prevent accidental execution on wrong OS

## Support

For issues or questions:
1. Check the logs panel for error details
2. Review the operation output
3. Verify you're on Linux Mint 21
4. Ensure proper sudo permissions

## License

This tool is for educational purposes in CyberPatriot training environments.

