import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    if (process.platform !== 'linux') {
      return NextResponse.json({
        success: false,
        error: 'This operation requires Linux',
      }, { status: 400 });
    }

    const results = [];

    // Delete pyrdp archive
    try {
      await execAsync('sudo rm -f /usr/games/pyrdp-master.zip');
      results.push({ item: 'pyrdp-master.zip', success: true });
    } catch (error: any) {
      results.push({ item: 'pyrdp-master.zip', success: false, error: error.message });
    }

    // Purge doona
    try {
      await execAsync('sudo apt purge -y doona');
      results.push({ item: 'doona', success: true });
    } catch (error: any) {
      results.push({ item: 'doona', success: false, error: error.message });
    }

    // Purge xprobe
    try {
      await execAsync('sudo apt purge -y xprobe');
      results.push({ item: 'xprobe', success: true });
    } catch (error: any) {
      results.push({ item: 'xprobe', success: false, error: error.message });
    }

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error: any) {
    console.error('Remove software error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to remove software',
      },
      { status: 500 }
    );
  }
}

