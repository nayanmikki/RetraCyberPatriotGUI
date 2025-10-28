export type UserLabel = 'admin' | 'standard' | 'unauthorized';

export interface SystemUser {
  username: string;
  uid: number;
  home: string;
  groups: string[];
  label: UserLabel;
  x?: number;
  y?: number;
  locked?: boolean;
}

export interface NodeLink {
  id: string;
  source: string; // node ID
  target: string; // node ID
  type: 'user-to-setting' | 'setting-to-operation';
}

export type SettingNodeType = 
  | 'firewall'
  | 'ssh'
  | 'updates'
  | 'services'
  | 'forensics'
  | 'prohibited'
  | 'accounts'
  | 'reporting';

export interface ForensicsSettings {
  scanPaths: string[];
  allowedExtensions: string[];
  prohibitedExtensions: string[];
}

export interface AccountsSettings {
  passwordMinLength: number;
  requireMixedChars: boolean;
  passwordRotationDays: number;
  autoLockInactive: boolean;
}

export interface FirewallSettings {
  enabled: boolean;
  allowedServices: string[];
  defaultInbound: 'deny' | 'allow';
  defaultOutbound: 'deny' | 'allow';
  customRules: { port: string; protocol: string; action: 'allow' | 'deny' }[];
  logging: boolean;
}

export interface SSHSettings {
  enabled: boolean;
  permitRootLogin: boolean;
  passwordAuth: boolean;
  port: number;
  maxAuthTries: number;
}

export interface ServicesSettings {
  apache2Running: boolean;
  apache2Enabled: boolean;
  sshEnabled: boolean;
  autoStartServices: string[];
  customCommands: string[];
}

export interface UpdatesSettings {
  autoUpdates: boolean;
  updateFrequency: 'daily' | 'weekly' | 'manual';
  targetPackages: string[];
  upgradeMode: 'upgrade' | 'full-upgrade';
  verifyRepositories: boolean;
}

export interface ProhibitedSettings {
  scanDirectories: string[];
  prohibitedFileTypes: string[];
  authorizedSoftware: string[];
  prohibitedSoftware: string[];
  autoRemoveViolations: boolean;
}

export interface ReportingSettings {
  logLevel: 'error' | 'info' | 'debug';
  executionMode: 'simulation' | 'live';
  showSnapLines: boolean;
  showGrid: boolean;
}

export interface SettingNode {
  id: string;
  type: SettingNodeType;
  label: string;
  x: number;
  y: number;
  settings: ForensicsSettings | AccountsSettings | FirewallSettings | SSHSettings | 
             ServicesSettings | UpdatesSettings | ProhibitedSettings | ReportingSettings;
}

export interface OperationLog {
  id: string;
  timestamp: string;
  operationId: string;
  operationName: string;
  status: 'pending' | 'success' | 'error';
  output?: string;
  error?: string;
}

export interface SystemInfo {
  distro: string;
  firewall: string;
  scannedAt: string;
}

export const DEFAULT_SETTING_NODES: SettingNode[] = [
  {
    id: 'forensics-node',
    type: 'forensics',
    label: 'Forensics',
    x: 800,
    y: 50,
    settings: {
      scanPaths: ['/home/*/Music', '/home/*/Videos', '/home/*/Downloads'],
      allowedExtensions: ['.txt', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
      prohibitedExtensions: ['.mp3', '.mp4', '.avi', '.mkv'],
    } as ForensicsSettings,
  },
  {
    id: 'accounts-node',
    type: 'accounts',
    label: 'Accounts & Access Control',
    x: 800,
    y: 200,
    settings: {
      passwordMinLength: 12,
      requireMixedChars: true,
      passwordRotationDays: 90,
      autoLockInactive: false,
    } as AccountsSettings,
  },
  {
    id: 'firewall-node',
    type: 'firewall',
    label: 'Firewall (UFW)',
    x: 800,
    y: 350,
    settings: {
      enabled: false,
      allowedServices: ['OpenSSH'],
      defaultInbound: 'deny',
      defaultOutbound: 'allow',
      customRules: [],
      logging: true,
    } as FirewallSettings,
  },
  {
    id: 'ssh-node',
    type: 'ssh',
    label: 'SSH Configuration',
    x: 1100,
    y: 50,
    settings: {
      enabled: true,
      permitRootLogin: false,
      passwordAuth: true,
      port: 22,
      maxAuthTries: 3,
    } as SSHSettings,
  },
  {
    id: 'services-node',
    type: 'services',
    label: 'Services',
    x: 1100,
    y: 200,
    settings: {
      apache2Running: false,
      apache2Enabled: false,
      sshEnabled: true,
      autoStartServices: ['ufw', 'ssh'],
      customCommands: [],
    } as ServicesSettings,
  },
  {
    id: 'updates-node',
    type: 'updates',
    label: 'Updates & Packages',
    x: 1100,
    y: 350,
    settings: {
      autoUpdates: false,
      updateFrequency: 'weekly',
      targetPackages: ['systemd', 'openssh-server', 'chromium-browser', 'gimp'],
      upgradeMode: 'full-upgrade',
      verifyRepositories: true,
    } as UpdatesSettings,
  },
  {
    id: 'prohibited-node',
    type: 'prohibited',
    label: 'Prohibited Items',
    x: 1100,
    y: 500,
    settings: {
      scanDirectories: ['/home', '/tmp', '/var/tmp'],
      prohibitedFileTypes: ['.mp3', '.mp4', '.avi', '.torrent'],
      authorizedSoftware: ['firefox', 'thunderbird', 'libreoffice', 'gimp'],
      prohibitedSoftware: ['wireshark', 'ophcrack', 'nmap', 'john'],
      autoRemoveViolations: false,
    } as ProhibitedSettings,
  },
  {
    id: 'reporting-node',
    type: 'reporting',
    label: 'Reporting & Control',
    x: 800,
    y: 500,
    settings: {
      logLevel: 'info',
      executionMode: 'simulation',
      showSnapLines: true,
      showGrid: false,
    } as ReportingSettings,
  },
];
