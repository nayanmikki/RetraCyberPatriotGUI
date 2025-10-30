import { NextRequest, NextResponse } from 'next/server';
import { disableNullPasswords } from '@/lib/safe-edit';

export async function POST(request: NextRequest) {
  try {
    if (process.platform !== 'linux') {
      return NextResponse.json({
        success: false,
        error: 'This operation requires Linux',
      }, { status: 400 });
    }

    const body = await request.json();
    const { disable } = body;

    if (!disable) {
      return NextResponse.json({
        success: true,
        message: 'No action taken (disable was false)',
      });
    }

    const result = await disableNullPasswords();

    return NextResponse.json({
      success: true,
      backup: result.backup,
      diff: result.diff,
    });

  } catch (error: any) {
    console.error('Disable null passwords error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to disable null passwords',
      },
      { status: 500 }
    );
  }
}

