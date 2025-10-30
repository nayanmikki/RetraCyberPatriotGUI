import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    if (process.platform !== 'linux') {
      return NextResponse.json({
        success: false,
        error: 'This operation requires Linux',
      }, { status: 400 });
    }

    const files: string[] = [];

    // Try locate first (faster)
    try {
      const { stdout: locateOutput } = await execAsync("sudo updatedb && locate '*.ogg' 2>/dev/null || true");
      if (locateOutput.trim()) {
        files.push(...locateOutput.trim().split('\n').filter(Boolean));
      }
    } catch (error) {
      console.log('locate failed, trying find');
    }

    // Also use find for /home
    try {
      const { stdout: findOutput } = await execAsync("find /home -type f -name '*.ogg' 2>/dev/null || true");
      if (findOutput.trim()) {
        const findFiles = findOutput.trim().split('\n').filter(Boolean);
        // Merge with locate results, avoiding duplicates
        for (const file of findFiles) {
          if (!files.includes(file)) {
            files.push(file);
          }
        }
      }
    } catch (error) {
      console.log('find failed');
    }

    return NextResponse.json({
      success: true,
      files: files.sort(),
    });

  } catch (error: any) {
    console.error('Scan media error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to scan media files',
      },
      { status: 500 }
    );
  }
}

