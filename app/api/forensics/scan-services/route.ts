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

    // Run ss -tlnp to get listening TCP ports
    let services: any[] = [];
    
    try {
      const { stdout: ssOutput } = await execAsync('sudo ss -tlnp 2>/dev/null || ss -tlnp 2>/dev/null');
      const lines = ssOutput.split('\n').slice(1); // Skip header
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 4) {
          const localAddr = parts[3];
          const port = localAddr.split(':').pop();
          const processInfo = parts[parts.length - 1];
          
          // Parse process info: users:(("process",pid=123,fd=4))
          const pidMatch = processInfo.match(/pid=(\d+)/);
          const processMatch = processInfo.match(/\("([^"]+)"/);
          
          if (pidMatch && processMatch) {
            services.push({
              pid: parseInt(pidMatch[1]),
              command: processMatch[1],
              port: port,
              user: 'root', // ss doesn't easily show user, would need ps
            });
          }
        }
      }
    } catch (error) {
      console.error('Error running ss:', error);
    }

    // Also scan for Python processes
    try {
      const { stdout: psOutput } = await execAsync('ps -ef | grep python | grep -v grep');
      const lines = psOutput.trim().split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 8) {
          const user = parts[0];
          const pid = parseInt(parts[1]);
          const command = parts.slice(7).join(' ');
          
          // Only add if not already in services
          if (!services.find(s => s.pid === pid)) {
            services.push({
              pid,
              command,
              user,
              port: null,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error running ps:', error);
    }

    return NextResponse.json({
      success: true,
      services,
    });

  } catch (error: any) {
    console.error('Scan services error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to scan services',
      },
      { status: 500 }
    );
  }
}

