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
    const { groupName, members } = body;

    if (!groupName || !members || !Array.isArray(members)) {
      return NextResponse.json(
        { success: false, error: 'Group name and members array are required' },
        { status: 400 }
      );
    }

    const membersList = members.join(',');
    const { stdout, stderr } = await execAsync(`sudo gpasswd -M ${membersList} ${groupName}`);

    return NextResponse.json({
      success: true,
      output: stdout,
      stderr,
    });

  } catch (error: any) {
    console.error('Add to group error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to add members to group',
      },
      { status: 500 }
    );
  }
}

