import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getOperation } from '@/lib/opsRegistry';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operationId, params } = body;

    if (!operationId) {
      return NextResponse.json(
        { error: 'Operation ID is required' },
        { status: 400 }
      );
    }

    const operation = getOperation(operationId);
    
    if (!operation) {
      return NextResponse.json(
        { error: `Unknown operation: ${operationId}` },
        { status: 404 }
      );
    }

    // Replace placeholders in command with actual parameters
    let command = operation.command.join(' ');
    
    if (params) {
      Object.keys(params).forEach(key => {
        command = command.replace(key.toUpperCase(), params[key]);
      });
    }

    // Add sudo if required
    if (operation.requiresRoot) {
      command = `sudo ${command}`;
    }

    console.log(`Executing operation: ${operation.name}`);
    console.log(`Command: ${command}`);

    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024, // 1MB buffer
    });

    return NextResponse.json({
      success: true,
      operationId,
      operation: operation.name,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    });

  } catch (error: any) {
    console.error('Operation execution error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Operation failed',
        stderr: error.stderr || '',
        stdout: error.stdout || '',
      },
      { status: 500 }
    );
  }
}

