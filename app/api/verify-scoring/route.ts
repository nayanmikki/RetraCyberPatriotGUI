import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    if (process.platform !== 'linux') {
      return NextResponse.json({
        success: false,
        error: 'This operation requires Linux',
      }, { status: 400 });
    }

    const results = [];

    // Check UFW status
    try {
      const { stdout } = await execAsync('sudo ufw status');
      results.push({
        check: 'UFW Firewall Active',
        passed: stdout.includes('Status: active'),
        details: stdout.trim(),
      });
    } catch (error) {
      results.push({
        check: 'UFW Firewall Active',
        passed: false,
        details: 'Error checking firewall',
      });
    }

    // Check ASLR
    try {
      const { stdout } = await execAsync('sysctl kernel.randomize_va_space');
      const value = stdout.trim().split('=')[1]?.trim();
      results.push({
        check: 'ASLR Enabled',
        passed: value === '2',
        details: stdout.trim(),
      });
    } catch (error) {
      results.push({
        check: 'ASLR Enabled',
        passed: false,
        details: 'Error checking ASLR',
      });
    }

    // Check SYN cookies
    try {
      const { stdout } = await execAsync('sysctl net.ipv4.tcp_syncookies');
      const value = stdout.trim().split('=')[1]?.trim();
      results.push({
        check: 'TCP SYN Cookies Enabled',
        passed: value === '1',
        details: stdout.trim(),
      });
    } catch (error) {
      results.push({
        check: 'TCP SYN Cookies Enabled',
        passed: false,
        details: 'Error checking SYN cookies',
      });
    }

    // Check nginx disabled
    try {
      const { stdout } = await execAsync('systemctl is-enabled nginx 2>&1');
      results.push({
        check: 'nginx Disabled',
        passed: stdout.includes('disabled') || stdout.includes('not found'),
        details: stdout.trim(),
      });
    } catch (error) {
      results.push({
        check: 'nginx Disabled',
        passed: true,
        details: 'nginx not found or disabled',
      });
    }

    // Check squid disabled
    try {
      const { stdout } = await execAsync('systemctl is-enabled squid 2>&1');
      results.push({
        check: 'squid Disabled',
        passed: stdout.includes('disabled') || stdout.includes('not found'),
        details: stdout.trim(),
      });
    } catch (error) {
      results.push({
        check: 'squid Disabled',
        passed: true,
        details: 'squid not found or disabled',
      });
    }

    // Check vsftpd active
    try {
      const { stdout } = await execAsync('systemctl is-active vsftpd 2>&1');
      results.push({
        check: 'vsftpd Active',
        passed: stdout.includes('active'),
        details: stdout.trim(),
      });
    } catch (error) {
      results.push({
        check: 'vsftpd Active',
        passed: false,
        details: 'vsftpd not active',
      });
    }

    // Check for backdoor file
    try {
      const { stdout } = await execAsync('ls -la /usr/share/zod/kneelB4zod.py 2>&1');
      results.push({
        check: 'Backdoor Removed (/usr/share/zod/kneelB4zod.py)',
        passed: stdout.includes('No such file'),
        details: stdout.trim(),
      });
    } catch (error) {
      results.push({
        check: 'Backdoor Removed (/usr/share/zod/kneelB4zod.py)',
        passed: true,
        details: 'File not found (good)',
      });
    }

    // Check for pyrdp archive
    try {
      const { stdout } = await execAsync('ls -la /usr/games/pyrdp-master.zip 2>&1');
      results.push({
        check: 'pyrdp Archive Removed',
        passed: stdout.includes('No such file'),
        details: stdout.trim(),
      });
    } catch (error) {
      results.push({
        check: 'pyrdp Archive Removed',
        passed: true,
        details: 'File not found (good)',
      });
    }

    // Check doona removed
    try {
      const { stdout } = await execAsync('dpkg -l | grep doona');
      results.push({
        check: 'doona Package Removed',
        passed: !stdout.trim(),
        details: stdout.trim() || 'Not installed',
      });
    } catch (error) {
      results.push({
        check: 'doona Package Removed',
        passed: true,
        details: 'Not installed',
      });
    }

    // Check xprobe removed
    try {
      const { stdout } = await execAsync('dpkg -l | grep xprobe');
      results.push({
        check: 'xprobe Package Removed',
        passed: !stdout.trim(),
        details: stdout.trim() || 'Not installed',
      });
    } catch (error) {
      results.push({
        check: 'xprobe Package Removed',
        passed: true,
        details: 'Not installed',
      });
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length,
      },
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify scoring',
      },
      { status: 500 }
    );
  }
}

