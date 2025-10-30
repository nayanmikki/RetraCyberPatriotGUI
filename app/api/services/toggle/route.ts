import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

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
    const { serviceName, enable } = body;

    if (!serviceName) {
      return NextResponse.json(
        { success: false, error: 'Service name is required' },
        { status: 400 }
      );
    }

    // Guardrail: cannot disable vsftpd
    if (serviceName === 'vsftpd' && !enable) {
      return NextResponse.json(
        { success: false, error: 'Cannot disable vsftpd (protected service)' },
        { status: 403 }
      );
    }

    const action = enable ? 'enable --now' : 'disable --now';
    const { stdout, stderr } = await execAsync(`sudo systemctl ${action} ${serviceName}`);

    return NextResponse.json({
      success: true,
      output: stdout,
      stderr,
    });

  } catch (error: any) {
    console.error('Toggle service error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to toggle service',
      },
      { status: 500 }
    );
  }
}

