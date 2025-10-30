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
    const { file, stream } = body;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      );
    }

    const streamNum = stream || '0';
    const { stdout, stderr } = await execAsync(
      `tshark -q -z follow,tcp,ascii,${streamNum} -r "${file}" 2>&1`
    );

    return NextResponse.json({
      success: true,
      output: stdout || stderr || 'No output',
    });

  } catch (error: any) {
    console.error('Analyze PCAP error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze PCAP. Make sure tshark is installed.',
      },
      { status: 500 }
    );
  }
}

