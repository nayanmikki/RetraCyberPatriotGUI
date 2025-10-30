import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createBackup, safeEditFile } from '@/lib/safe-edit';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    if (process.platform !== 'linux') {
      return NextResponse.json({
        success: false,
        error: 'This operation requires Linux',
      }, { status: 400 });
    }

    const body = await request.json();
    const { enabled } = body;

    const value = enabled ? '1' : '0';
    const filePath = '/etc/sysctl.conf';

    // Create backup and edit file
    await createBackup(filePath);
    
    await safeEditFile(filePath, (content) => {
      const lines = content.split('\n');
      let found = false;
      
      const newLines = lines.map(line => {
        if (line.includes('net.ipv4.tcp_syncookies')) {
          found = true;
          return `net.ipv4.tcp_syncookies=${value}`;
        }
        return line;
      });
      
      if (!found) {
        newLines.push(`net.ipv4.tcp_syncookies=${value}`);
      }
      
      return newLines.join('\n');
    });

    // Apply changes
    await execAsync('sudo sysctl --system');

    return NextResponse.json({
      success: true,
      message: `SYN cookies ${enabled ? 'enabled' : 'disabled'}`,
    });

  } catch (error: any) {
    console.error('Set SYN cookies error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to set SYN cookies',
      },
      { status: 500 }
    );
  }
}

