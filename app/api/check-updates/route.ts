import { NextResponse } from 'next/server';

const CURRENT_VERSION = '1.0.0';
const GITHUB_REPO = 'cyberpatriot/mintcpgui'; // Update with actual repo
const UPDATE_CHECK_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

export async function GET() {
  try {
    // Check if running on Linux
    const isLinux = process.platform === 'linux';
    
    if (!isLinux) {
      return NextResponse.json({
        success: false,
        error: 'This application must run on a Linux system',
      }, { status: 400 });
    }

    // Try to fetch latest version from GitHub
    let latestVersion = CURRENT_VERSION;
    let updateAvailable = false;
    let releaseNotes = '';
    let downloadUrl = '';

    try {
      const response = await fetch(UPDATE_CHECK_URL, {
        headers: {
          'User-Agent': 'MintCPGUI',
        },
      });

      if (response.ok) {
        const data = await response.json();
        latestVersion = data.tag_name?.replace('v', '') || CURRENT_VERSION;
        releaseNotes = data.body || '';
        downloadUrl = data.html_url || '';
        
        // Simple version comparison
        updateAvailable = compareVersions(latestVersion, CURRENT_VERSION) > 0;
      }
    } catch (fetchError) {
      console.error('Error checking for updates:', fetchError);
      // Continue with current version if update check fails
    }

    return NextResponse.json({
      success: true,
      currentVersion: CURRENT_VERSION,
      latestVersion,
      updateAvailable,
      releaseNotes,
      downloadUrl,
      checkedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Update check error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check for updates',
      },
      { status: 500 }
    );
  }
}

function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  
  return 0;
}

