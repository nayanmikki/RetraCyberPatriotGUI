import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';

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
    const { lockoutEnabled, resetOnSuccess, notifyLockout } = body;

    // Create PAM config files for faillock
    if (lockoutEnabled) {
      const faillockConfig = `Name: Faillock
Default: yes
Priority: 0
Auth-Type: Primary
Auth:
\t[default=die] pam_faillock.so authfail
\trequired pam_faillock.so authsucc
Account-Type: Primary
Account:
\trequired pam_faillock.so
`;
      
      await writeFile('/tmp/faillock-config', faillockConfig);
      await execAsync('sudo mv /tmp/faillock-config /usr/share/pam-configs/faillock');
    }

    if (resetOnSuccess) {
      const resetConfig = `Name: Faillock Reset
Default: yes
Priority: 0
Auth-Type: Primary
Auth:
\trequired pam_faillock.so preauth
`;
      
      await writeFile('/tmp/faillock-reset-config', resetConfig);
      await execAsync('sudo mv /tmp/faillock-reset-config /usr/share/pam-configs/faillock_reset');
    }

    if (notifyLockout) {
      const notifyConfig = `Name: Faillock Notify
Default: yes
Priority: 0
Auth-Type: Primary
Auth:
\toptional pam_echo.so file=/var/log/faillock.log
`;
      
      await writeFile('/tmp/faillock-notify-config', notifyConfig);
      await execAsync('sudo mv /tmp/faillock-notify-config /usr/share/pam-configs/faillock_notify');
    }

    // Run pam-auth-update
    await execAsync('sudo DEBIAN_FRONTEND=noninteractive pam-auth-update --package');

    return NextResponse.json({
      success: true,
      message: 'Lockout policies applied',
    });

  } catch (error: any) {
    console.error('Set lockout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to set lockout policies',
      },
      { status: 500 }
    );
  }
}

