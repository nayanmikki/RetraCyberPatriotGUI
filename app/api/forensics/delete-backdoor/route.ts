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
    const { path } = body;

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Path is required' },
        { status: 400 }
      );
    }

    const { stdout, stderr } = await execAsync(`sudo rm -f ${path}`);

    return NextResponse.json({
      success: true,
      output: stdout || 'File deleted',
      stderr,
    });

  } catch (error: any) {
    console.error('Delete backdoor error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete file',
      },
      { status: 500 }
    );
  }
}

