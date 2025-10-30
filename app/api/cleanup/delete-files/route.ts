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
    const { files } = body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Files array is required' },
        { status: 400 }
      );
    }

    // Delete each file
    const results = [];
    for (const file of files) {
      try {
        await execAsync(`sudo rm -f "${file}"`);
        results.push({ file, success: true });
      } catch (error: any) {
        results.push({ file, success: false, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error: any) {
    console.error('Delete files error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete files',
      },
      { status: 500 }
    );
  }
}

