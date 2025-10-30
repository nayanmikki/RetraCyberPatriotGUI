import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';

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
    const { image, passphrase } = body;

    if (!image || !passphrase) {
      return NextResponse.json(
        { success: false, error: 'Image path and passphrase are required' },
        { status: 400 }
      );
    }

    // Extract hidden message using steghide
    const outputFile = `/tmp/stego-output-${Date.now()}.txt`;
    await execAsync(`steghide extract -sf "${image}" -p "${passphrase}" -xf "${outputFile}"`);

    // Read extracted message
    const message = await readFile(outputFile, 'utf-8');

    // Calculate MD5 hash
    const md5 = createHash('md5').update(message).digest('hex');

    // Clean up
    await execAsync(`rm -f "${outputFile}"`);

    return NextResponse.json({
      success: true,
      message,
      md5,
    });

  } catch (error: any) {
    console.error('Extract stego error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to extract steganography. Make sure steghide is installed and the passphrase is correct.',
      },
      { status: 500 }
    );
  }
}

