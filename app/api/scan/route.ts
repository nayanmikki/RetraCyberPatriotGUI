import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SystemUser {
  username: string;
  uid: number;
  home: string;
  groups: string[];
  label?: 'admin' | 'standard' | 'unauthorized';
}

export async function GET() {
  try {
    // Get all users with UID >= 1000 (regular users)
    const { stdout: userOutput } = await execAsync(
      "getent passwd | awk -F: '$3 >= 1000 && $3 < 65534 {print $1\":\"$3\":\"$6}'"
    );

    const users: SystemUser[] = [];

    for (const line of userOutput.trim().split('\n')) {
      if (!line) continue;
      
      const [username, uid, home] = line.split(':');
      
      // Get groups for this user
      try {
        const { stdout: groupOutput } = await execAsync(`groups ${username}`);
        const groupsLine = groupOutput.trim();
        const groups = groupsLine.includes(':')
          ? groupsLine.split(':')[1].trim().split(' ')
          : [];

        // Auto-label based on groups
        let label: 'admin' | 'standard' | 'unauthorized' = 'standard';
        if (groups.includes('sudo') || groups.includes('admin')) {
          label = 'admin';
        }

        users.push({
          username,
          uid: parseInt(uid),
          home,
          groups,
          label,
        });
      } catch (groupError) {
        console.error(`Error getting groups for ${username}:`, groupError);
        users.push({
          username,
          uid: parseInt(uid),
          home,
          groups: [],
          label: 'standard',
        });
      }
    }

    // Get system info
    let distroInfo = 'Unknown';
    try {
      const { stdout: distroOutput } = await execAsync('lsb_release -d');
      distroInfo = distroOutput.replace('Description:', '').trim();
    } catch (error) {
      console.error('Error getting distro info:', error);
    }

    // Get firewall status
    let firewallStatus = 'unknown';
    try {
      const { stdout: ufwOutput } = await execAsync('sudo ufw status');
      firewallStatus = ufwOutput.includes('Status: active') ? 'active' : 'inactive';
    } catch (error) {
      firewallStatus = 'error';
    }

    return NextResponse.json({
      success: true,
      users,
      system: {
        distro: distroInfo,
        firewall: firewallStatus,
        scannedAt: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('System scan error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Scan failed',
      },
      { status: 500 }
    );
  }
}

