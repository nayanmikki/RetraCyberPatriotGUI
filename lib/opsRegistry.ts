// Registry of safe, whitelisted system commands for CyberPatriot operations

export interface Operation {
  id: string;
  name: string;
  description: string;
  category: 'forensics' | 'accounts' | 'firewall' | 'services' | 'updates' | 'prohibited';
  command: string[];
  requiresRoot: boolean;
}

export const OPS: Record<string, Operation> = {
  // Forensics
  getDistroInfo: {
    id: 'getDistroInfo',
    name: 'Get Distribution Info',
    description: 'View Linux Mint distribution codename',
    category: 'forensics',
    command: ['lsb_release', '-a'],
    requiresRoot: false,
  },
  findMP3s: {
    id: 'findMP3s',
    name: 'Find MP3 Files',
    description: 'Locate MP3 files in unauthorized directories',
    category: 'forensics',
    command: ['find', '/home', '-name', '*.mp3', '-type', 'f'],
    requiresRoot: false,
  },

  // Firewall
  enableUfw: {
    id: 'enableUfw',
    name: 'Enable UFW',
    description: 'Enable Uncomplicated Firewall',
    category: 'firewall',
    command: ['ufw', '--force', 'enable'],
    requiresRoot: true,
  },
  disableUfw: {
    id: 'disableUfw',
    name: 'Disable UFW',
    description: 'Disable Uncomplicated Firewall',
    category: 'firewall',
    command: ['ufw', 'disable'],
    requiresRoot: true,
  },
  allowSsh: {
    id: 'allowSsh',
    name: 'Allow SSH',
    description: 'Allow SSH through firewall',
    category: 'firewall',
    command: ['ufw', 'allow', 'OpenSSH'],
    requiresRoot: true,
  },
  allowHttp: {
    id: 'allowHttp',
    name: 'Allow HTTP',
    description: 'Allow HTTP through firewall',
    category: 'firewall',
    command: ['ufw', 'allow', '80/tcp'],
    requiresRoot: true,
  },
  ufwStatus: {
    id: 'ufwStatus',
    name: 'UFW Status',
    description: 'Check UFW firewall status',
    category: 'firewall',
    command: ['ufw', 'status', 'verbose'],
    requiresRoot: true,
  },

  // Services
  installApache: {
    id: 'installApache',
    name: 'Install Apache2',
    description: 'Install Apache2 web server',
    category: 'services',
    command: ['apt', 'install', '-y', 'apache2'],
    requiresRoot: true,
  },
  startApache: {
    id: 'startApache',
    name: 'Start Apache2',
    description: 'Start Apache2 service',
    category: 'services',
    command: ['systemctl', 'start', 'apache2'],
    requiresRoot: true,
  },
  enableApache: {
    id: 'enableApache',
    name: 'Enable Apache2',
    description: 'Enable Apache2 to start on boot',
    category: 'services',
    command: ['systemctl', 'enable', 'apache2'],
    requiresRoot: true,
  },
  sshStatus: {
    id: 'sshStatus',
    name: 'SSH Status',
    description: 'Check SSH service status',
    category: 'services',
    command: ['systemctl', 'status', 'ssh'],
    requiresRoot: false,
  },
  disableRootSsh: {
    id: 'disableRootSsh',
    name: 'Disable Root SSH',
    description: 'Disable root login via SSH',
    category: 'services',
    command: [
      'bash',
      '-c',
      "sed -i 's/^#\\?PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config && systemctl reload ssh"
    ],
    requiresRoot: true,
  },
  disablePasswordAuth: {
    id: 'disablePasswordAuth',
    name: 'Disable SSH Password Auth',
    description: 'Disable password authentication for SSH',
    category: 'services',
    command: [
      'bash',
      '-c',
      "sed -i 's/^#\\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config && systemctl reload ssh"
    ],
    requiresRoot: true,
  },

  // Updates
  aptUpdate: {
    id: 'aptUpdate',
    name: 'APT Update',
    description: 'Update package lists',
    category: 'updates',
    command: ['apt', 'update'],
    requiresRoot: true,
  },
  fullUpgrade: {
    id: 'fullUpgrade',
    name: 'Full Upgrade',
    description: 'Perform full system upgrade',
    category: 'updates',
    command: ['apt', 'full-upgrade', '-y'],
    requiresRoot: true,
  },
  enableAutoUpdates: {
    id: 'enableAutoUpdates',
    name: 'Enable Auto-Updates',
    description: 'Enable automatic security updates',
    category: 'updates',
    command: ['apt', 'install', '-y', 'unattended-upgrades'],
    requiresRoot: true,
  },
  checkPackage: {
    id: 'checkPackage',
    name: 'Check Package',
    description: 'Check if a package is installed',
    category: 'updates',
    command: ['dpkg', '-l'],
    requiresRoot: false,
  },

  // Prohibited Software
  removeWireshark: {
    id: 'removeWireshark',
    name: 'Remove Wireshark',
    description: 'Remove Wireshark network analyzer',
    category: 'prohibited',
    command: ['apt', 'purge', '-y', 'wireshark*'],
    requiresRoot: true,
  },
  removeOphcrack: {
    id: 'removeOphcrack',
    name: 'Remove Ophcrack',
    description: 'Remove Ophcrack password cracker',
    category: 'prohibited',
    command: ['apt', 'purge', '-y', 'ophcrack*'],
    requiresRoot: true,
  },
  removeNmap: {
    id: 'removeNmap',
    name: 'Remove Nmap',
    description: 'Remove Nmap network scanner',
    category: 'prohibited',
    command: ['apt', 'purge', '-y', 'nmap*'],
    requiresRoot: true,
  },
  removeJohnTheRipper: {
    id: 'removeJohnTheRipper',
    name: 'Remove John the Ripper',
    description: 'Remove John the Ripper password cracker',
    category: 'prohibited',
    command: ['apt', 'purge', '-y', 'john*'],
    requiresRoot: true,
  },

  // Accounts
  listUsers: {
    id: 'listUsers',
    name: 'List Users',
    description: 'List all system users',
    category: 'accounts',
    command: ['bash', '-c', 'getent passwd | awk -F: \'$3 >= 1000 && $3 < 65534 {print $1":"$3":"$6}\''],
    requiresRoot: false,
  },
  listGroups: {
    id: 'listGroups',
    name: 'List Groups',
    description: 'List groups for a user',
    category: 'accounts',
    command: ['groups'],
    requiresRoot: false,
  },
  demoteUser: {
    id: 'demoteUser',
    name: 'Demote User',
    description: 'Remove user from sudo/admin groups',
    category: 'accounts',
    command: ['gpasswd', '-d', 'USERNAME', 'sudo'],
    requiresRoot: true,
  },
  deleteUser: {
    id: 'deleteUser',
    name: 'Delete User',
    description: 'Delete a user account',
    category: 'accounts',
    command: ['userdel', '-r', 'USERNAME'],
    requiresRoot: true,
  },
  changePassword: {
    id: 'changePassword',
    name: 'Change Password',
    description: 'Change user password to random value',
    category: 'accounts',
    command: ['bash', '-c', 'echo "USERNAME:$(openssl rand -base64 12)" | chpasswd'],
    requiresRoot: true,
  },
  addUser: {
    id: 'addUser',
    name: 'Add User',
    description: 'Add a new user account',
    category: 'accounts',
    command: ['useradd', '-m', '-s', '/bin/bash', 'USERNAME'],
    requiresRoot: true,
  },
  promoteUser: {
    id: 'promoteUser',
    name: 'Promote User',
    description: 'Add user to sudo group',
    category: 'accounts',
    command: ['usermod', '-aG', 'sudo', 'USERNAME'],
    requiresRoot: true,
  },
};

export function getOperationsByCategory(category: Operation['category']): Operation[] {
  return Object.values(OPS).filter(op => op.category === category);
}

export function getOperation(id: string): Operation | undefined {
  return OPS[id];
}

