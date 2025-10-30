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
    const { enabled } = body;

    const command = enabled ? 'sudo ufw --force enable' : 'sudo ufw disable';
    const { stdout, stderr } = await execAsync(command);

    return NextResponse.json({
      success: true,
      output: stdout,
      stderr,
    });

  } catch (error: any) {
    console.error('Toggle firewall error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to toggle firewall',
      },
      { status: 500 }
    );
  }
}

