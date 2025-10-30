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
    const { groupName } = body;

    if (!groupName) {
      return NextResponse.json(
        { success: false, error: 'Group name is required' },
        { status: 400 }
      );
    }

    const { stdout, stderr } = await execAsync(`sudo addgroup ${groupName}`);

    return NextResponse.json({
      success: true,
      output: stdout,
      stderr,
    });

  } catch (error: any) {
    console.error('Create group error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create group',
      },
      { status: 500 }
    );
  }
}

