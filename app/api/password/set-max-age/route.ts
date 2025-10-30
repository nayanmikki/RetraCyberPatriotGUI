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
    const { username, maxDays } = body;

    if (!username || !maxDays) {
      return NextResponse.json(
        { success: false, error: 'Username and maxDays are required' },
        { status: 400 }
      );
    }

    const { stdout, stderr } = await execAsync(`sudo chage -M ${maxDays} ${username}`);

    return NextResponse.json({
      success: true,
      output: stdout,
      stderr,
    });

  } catch (error: any) {
    console.error('Set max age error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to set maximum password age',
      },
      { status: 500 }
    );
  }
}

