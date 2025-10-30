import { NextRequest, NextResponse } from 'next/server';
import { setPasswordRemember } from '@/lib/safe-edit';

export async function POST(request: NextRequest) {
  try {
    if (process.platform !== 'linux') {
      return NextResponse.json({
        success: false,
        error: 'This operation requires Linux',
      }, { status: 400 });
    }

    const body = await request.json();
    const { remember } = body;

    if (remember === undefined || remember < 0 || remember > 24) {
      return NextResponse.json(
        { success: false, error: 'Invalid remember value (must be 0-24)' },
        { status: 400 }
      );
    }

    const result = await setPasswordRemember(remember);

    return NextResponse.json({
      success: true,
      backup: result.backup,
      diff: result.diff,
    });

  } catch (error: any) {
    console.error('Set remember error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to set password remember',
      },
      { status: 500 }
    );
  }
}

