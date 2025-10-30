'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/context/AppContext';
import { Scan, Download, Shield, AlertCircle, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
  const { scanSystem, loading, systemInfo, dryRunMode, setDryRunMode } = useApp();
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<any>(null);

  const handleCheckUpdates = async () => {
    setCheckingUpdates(true);
    try {
      const response = await fetch('/api/check-updates');
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUpdateInfo(data);
        
        if (data.updateAvailable) {
          alert(`Update available: v${data.latestVersion}\n\nCurrent: v${data.currentVersion}\n\nVisit: ${data.downloadUrl}`);
        } else {
          alert(`You are running the latest version (v${data.currentVersion})`);
        }
      } else {
        alert(`Failed to check for updates: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Update check error:', error);
      alert(`Failed to check for updates: ${error.message}`);
    } finally {
      setCheckingUpdates(false);
    }
  };

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">CyberPatriot Mint21 Training Console</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {systemInfo ? (
                <>
                  <span>{systemInfo.distro}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    Firewall:
                    {systemInfo.firewall === 'active' ? (
                      <Badge variant="default" className="ml-1 h-4 px-1.5 text-[10px]">
                        <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="ml-1 h-4 px-1.5 text-[10px]">
                        <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                        Inactive
                      </Badge>
                    )}
                  </span>
                </>
              ) : (
                <span>Ready to scan system</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/50 border border-border">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="dry-run" className="text-xs cursor-pointer">
              Dry Run
            </Label>
            <Switch
              id="dry-run"
              checked={dryRunMode}
              onCheckedChange={setDryRunMode}
              className="scale-75"
            />
          </div>
          
          <Button
            onClick={scanSystem}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Scan className="h-4 w-4" />
            {loading ? 'Scanning...' : 'Scan System'}
          </Button>
          
          <Button
            onClick={handleCheckUpdates}
            disabled={checkingUpdates}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {checkingUpdates ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {checkingUpdates ? 'Checking...' : 'Check Updates'}
          </Button>
        </div>
      </div>
    </div>
  );
}

