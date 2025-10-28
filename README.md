# CyberPatriot Mint 21 Console

A graphical Linux Mint 21 hardening console built for **CyberPatriot training**. This GUI allows you to visualize, modify, and automate system-security operations defined in the CyberPatriot Practice Image checklist.

## Features

- **Visual User Management**: Automatically lists all local users with draggable nodes
- **Manual User Labeling**: Tag users as Authorized Admin, Standard User, or Unauthorized User
- **Interactive Settings**: Configure all security settings through an intuitive UI
- **Operation Execution**: Run system commands safely with whitelisted operations
- **Comprehensive Coverage**:
  - Forensics & file scanning
  - Account & password management
  - Firewall (UFW) configuration
  - SSH hardening
  - Service management
  - System updates
  - Prohibited software removal
  - Reporting & logging

## Technology Stack

- **Next.js 15** + TypeScript
- **shadcn/ui** + Tailwind CSS
- **Framer Motion** for animations
- **React Flow** for node graph visualization
- **Node.js backend** for executing system commands

## Quick Start

### Installation & Launch (Linux Mint 21)

1. Clone or download this repository
2. Make the installer executable:
   ```bash
   chmod +x install-and-run.sh
   ```
3. Run the installer:
   ```bash
   ./install-and-run.sh
   ```

The script will:
- Install Node.js (if not present)
- Install all npm dependencies
- Launch the development server
- Open the GUI in your browser at `http://localhost:3000`

### Manual Installation

If you prefer to install manually:

```bash
# Install Node.js 20.x (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open your browser to `http://localhost:3000`

## Usage

1. **Scan System**: Click "Scan System" to load all users and system information
2. **Label Users**: Manually label each user node as Admin, Standard, or Unauthorized
3. **Configure Settings**: Adjust all security settings in the right panel
4. **Execute Operations**: Run individual operations or apply all changes
5. **Export Report**: Generate a Markdown report of all actions taken

## Configuration Categories

### 1. Forensics
- Distribution information
- File search paths
- Allowed/prohibited file extensions

### 2. Accounts & Access Control
- Password policies (length, complexity, rotation)
- User promotion/demotion
- Account locking

### 3. Firewall (UFW)
- Enable/disable firewall
- Allowed services configuration
- Custom port rules
- Default policies

### 4. SSH Configuration
- Root login settings
- Password authentication
- Port configuration
- Max authentication tries

### 5. Services
- Apache2 management
- SSH service control
- Auto-start configuration
- Custom service commands

### 6. Updates & Packages
- Automatic updates
- Update frequency
- Package selection
- Repository verification

### 7. Prohibited Items
- Scan directories
- Prohibited file types
- Software blacklist/whitelist
- Auto-removal options

### 8. Reporting & Control
- Execution mode (simulation/live)
- Log levels
- Visual settings

## Security Notes

- All system operations require appropriate permissions
- Operations that modify the system require sudo access
- Commands are whitelisted and validated before execution
- Run in simulation mode first to preview changes

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Directory Structure

```
MintCPGUI/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── execute/       # Operation execution
│   │   └── scan/          # System scanning
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── settings/          # Setting panel components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Main components
├── lib/                   # Utilities and types
│   ├── context/          # React context
│   ├── opsRegistry.ts    # Operation definitions
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── docs/                  # Documentation
├── install-and-run.sh    # Main installer script
├── package.json          # Dependencies
└── README.md            # This file
```

## Requirements

- Linux Mint 21 (or Ubuntu-based distribution)
- Node.js 18.x or higher
- npm 9.x or higher
- sudo access for system operations

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
sudo kill -9 $(sudo lsof -t -i:3000)
# Then run the installer again
./install-and-run.sh
```

### Permission Denied
If you get permission errors:
```bash
chmod +x install-and-run.sh
```

### Node.js Installation Issues
If Node.js fails to install:
```bash
# Remove any existing Node.js
sudo apt remove nodejs npm
# Clean up
sudo apt autoremove
# Run the installer again
./install-and-run.sh
```

## License

This project is created for educational purposes as part of CyberPatriot training.

## Contributing

This is a training tool. Feel free to modify and extend it for your specific CyberPatriot needs.

## Support

For issues or questions, refer to the CyberPatriot documentation and Linux Mint community resources.

