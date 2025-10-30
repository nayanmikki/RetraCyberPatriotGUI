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
    const { pid } = body;

    if (!pid) {
      return NextResponse.json(
        { success: false, error: 'PID is required' },
        { status: 400 }
      );
    }

    const { stdout, stderr } = await execAsync(`sudo kill -9 ${pid}`);

    return NextResponse.json({
      success: true,
      output: stdout || 'Process killed',
      stderr,
    });

  } catch (error: any) {
    console.error('Kill process error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to kill process',
      },
      { status: 500 }
    );
  }
}

