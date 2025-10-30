import { NextRequest, NextResponse } from 'next/server';
import { setMinPasswordLength } from '@/lib/safe-edit';

export async function POST(request: NextRequest) {
  try {
    if (process.platform !== 'linux') {
      return NextResponse.json({
        success: false,
        error: 'This operation requires Linux',
      }, { status: 400 });
    }

    const body = await request.json();
    const { minLength } = body;

    if (!minLength || minLength < 8 || minLength > 32) {
      return NextResponse.json(
        { success: false, error: 'Invalid minimum length (must be 8-32)' },
        { status: 400 }
      );
    }

    const result = await setMinPasswordLength(minLength);

    return NextResponse.json({
      success: true,
      backup: result.backup,
      diff: result.diff,
    });

  } catch (error: any) {
    console.error('Set min length error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to set minimum password length',
      },
      { status: 500 }
    );
  }
}

