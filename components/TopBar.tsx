'use client';

import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/context/AppContext';
import { Scan, PlayCircle, Undo2, FileDown, Shield } from 'lucide-react';

export function TopBar() {
  const { scanSystem, loading, systemInfo } = useApp();

  const handleExport = () => {
    // Generate markdown report
    const report = `# CyberPatriot Security Report
Generated: ${new Date().toLocaleString()}

## System Information
- Distribution: ${systemInfo?.distro || 'Unknown'}
- Firewall Status: ${systemInfo?.firewall || 'Unknown'}

## Actions Taken
[Operations would be listed here]
`;
    
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpatriot-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-white">CyberPatriot Mint 21 Console</h1>
            <p className="text-sm text-muted-foreground">
              {systemInfo ? `${systemInfo.distro} | Firewall: ${systemInfo.firewall}` : 'Ready to scan'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={scanSystem}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            <Scan className="h-4 w-4" />
            {loading ? 'Scanning...' : 'Scan System'}
          </Button>
          
          <Button
            variant="default"
            className="gap-2"
            disabled={loading}
          >
            <PlayCircle className="h-4 w-4" />
            Apply Changes
          </Button>
          
          <Button
            variant="secondary"
            className="gap-2"
            disabled={loading}
          >
            <Undo2 className="h-4 w-4" />
            Revert
          </Button>
          
          <Button
            onClick={handleExport}
            variant="outline"
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}

