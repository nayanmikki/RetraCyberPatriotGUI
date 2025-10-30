import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, command } = body;

    if (!itemId || !command) {
      return NextResponse.json(
        { error: 'Item ID and command are required' },
        { status: 400 }
      );
    }

    console.log(`Executing uninstall: ${itemId}`);
    console.log(`Command: ${command}`);

    // For safety, we'll simulate the uninstall in development
    // In production on the VM, this would actually execute the commands
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({
        success: true,
        itemId,
        message: `[SIMULATION] Would execute: ${command}`,
        stdout: 'Simulation mode - no actual changes made',
      });
    }

    // In production, execute the actual command
    const { stdout, stderr } = await execAsync(command, {
      timeout: 60000, // 60 second timeout
      maxBuffer: 1024 * 1024, // 1MB buffer
    });

    return NextResponse.json({
      success: true,
      itemId,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    });

  } catch (error: any) {
    console.error('Uninstall error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Uninstall failed',
        stderr: error.stderr || '',
        stdout: error.stdout || '',
      },
      { status: 500 }
    );
  }
}

