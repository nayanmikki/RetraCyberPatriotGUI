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

    const { stdout } = await execAsync('systemctl list-units --type=service --all --no-pager');
    const lines = stdout.split('\n');
    
    const services: any[] = [];
    
    for (const line of lines) {
      if (!line.trim() || line.includes('UNIT') || line.includes('●')) continue;
      
      const match = line.match(/^\s*(\S+\.service)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/);
      if (match) {
        const [, name, loaded, active, sub, description] = match;
        services.push({
          name: name.replace('.service', ''),
          loaded: loaded === 'loaded',
          active: active === 'active',
          enabled: sub !== 'dead',
          description: description.trim(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      services: services.filter(s => s.loaded),
    });

  } catch (error: any) {
    console.error('List services error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to list services',
      },
      { status: 500 }
    );
  }
}

