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

    const { stdout } = await execAsync('sudo ufw status verbose');
    const enabled = stdout.includes('Status: active');

    return NextResponse.json({
      success: true,
      enabled,
      status: stdout,
    });

  } catch (error: any) {
    console.error('Firewall status error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get firewall status',
      },
      { status: 500 }
    );
  }
}

