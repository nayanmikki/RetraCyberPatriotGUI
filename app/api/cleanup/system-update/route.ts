import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    if (process.platform !== 'linux') {
      return NextResponse.json({
        success: false,
        error: 'This operation requires Linux',
      }, { status: 400 });
    }

    // Run system update
    const { stdout, stderr } = await execAsync(
      'sudo DEBIAN_FRONTEND=noninteractive apt update && sudo DEBIAN_FRONTEND=noninteractive apt full-upgrade -y',
      { timeout: 600000, maxBuffer: 10 * 1024 * 1024 } // 10 minutes, 10MB buffer
    );

    return NextResponse.json({
      success: true,
      output: stdout,
      stderr,
    });

  } catch (error: any) {
    console.error('System update error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update system',
        output: error.stdout || '',
        stderr: error.stderr || '',
      },
      { status: 500 }
    );
  }
}

