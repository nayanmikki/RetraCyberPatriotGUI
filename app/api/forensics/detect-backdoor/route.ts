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

    let output = '';

    // Check if file exists
    try {
      const { stdout: lsOutput } = await execAsync(`ls -la ${path} 2>&1`);
      output += `File check:\n${lsOutput}\n\n`;
    } catch (error: any) {
      output += `File not found: ${path}\n\n`;
    }

    // Check for running processes
    try {
      const { stdout: psOutput } = await execAsync(`ps aux | grep -i "${path}" | grep -v grep`);
      if (psOutput.trim()) {
        output += `Running processes:\n${psOutput}\n`;
      } else {
        output += 'No running processes found\n';
      }
    } catch (error) {
      output += 'No running processes found\n';
    }

    return NextResponse.json({
      success: true,
      output,
    });

  } catch (error: any) {
    console.error('Detect backdoor error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to detect backdoor',
      },
      { status: 500 }
    );
  }
}

