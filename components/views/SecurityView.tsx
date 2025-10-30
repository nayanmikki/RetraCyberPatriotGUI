'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function SecurityView() {
  const [loading, setLoading] = useState(false);
  const [aslrEnabled, setAslrEnabled] = useState(false);
  const [synCookiesEnabled, setSynCookiesEnabled] = useState(false);
  const [firewallEnabled, setFirewallEnabled] = useState(false);
  const [firewallStatus, setFirewallStatus] = useState<any>(null);

  const loadFirewallStatus = async () => {
    try {
      const response = await fetch('/api/security/firewall-status');
      const data = await response.json();
      
      if (data.success) {
        setFirewallEnabled(data.enabled);
        setFirewallStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to load firewall status:', error);
    }
  };

  useEffect(() => {
    loadFirewallStatus();
  }, []);

  const toggleASLR = async () => {
    const newValue = !aslrEnabled;
    
    if (!confirm(`${newValue ? 'Enable' : 'Disable'} ASLR (Address Space Layout Randomization)?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/security/set-aslr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newValue }),
      });

      const data = await response.json();

      if (data.success) {
        setAslrEnabled(newValue);
        alert('ASLR setting updated successfully');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleSynCookies = async () => {
    const newValue = !synCookiesEnabled;
    
    if (!confirm(`${newValue ? 'Enable' : 'Disable'} TCP SYN cookies?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/security/set-syn-cookies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newValue }),
      });

      const data = await response.json();

      if (data.success) {
        setSynCookiesEnabled(newValue);
        alert('SYN cookies setting updated successfully');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleFirewall = async () => {
    const newValue = !firewallEnabled;
    
    if (!confirm(`${newValue ? 'Enable' : 'Disable'} UFW firewall?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/security/toggle-firewall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newValue }),
      });

      const data = await response.json();

      if (data.success) {
        setFirewallEnabled(newValue);
        await loadFirewallStatus();
        alert(`Firewall ${newValue ? 'enabled' : 'disabled'} successfully`);
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">System Security</h2>
            <p className="text-sm text-muted-foreground">Configure kernel security features and firewall</p>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Kernel Security Features
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-md bg-accent/50">
                <div>
                  <Label htmlFor="aslr" className="text-base">Address Space Layout Randomization (ASLR)</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Randomizes memory addresses to prevent exploitation
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    kernel.randomize_va_space=2 in /etc/sysctl.conf
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {aslrEnabled ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Disabled
                    </Badge>
                  )}
                  <Switch
                    id="aslr"
                    checked={aslrEnabled}
                    onCheckedChange={toggleASLR}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md bg-accent/50">
                <div>
                  <Label htmlFor="syn-cookies" className="text-base">TCP SYN Cookies</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Protects against SYN flood attacks
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    net.ipv4.tcp_syncookies=1 in /etc/sysctl.conf
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {synCookiesEnabled ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Disabled
                    </Badge>
                  )}
                  <Switch
                    id="syn-cookies"
                    checked={synCookiesEnabled}
                    onCheckedChange={toggleSynCookies}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Firewall (UFW)
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md bg-accent/50">
                <div>
                  <Label htmlFor="firewall" className="text-base">UFW Firewall</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Uncomplicated Firewall - iptables frontend
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {firewallEnabled ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                  <Switch
                    id="firewall"
                    checked={firewallEnabled}
                    onCheckedChange={toggleFirewall}
                    disabled={loading}
                  />
                </div>
              </div>

              {firewallStatus && (
                <div className="p-4 rounded-md bg-muted">
                  <h4 className="font-medium mb-2">Firewall Status</h4>
                  <pre className="text-xs whitespace-pre-wrap font-mono">{firewallStatus}</pre>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="w-96 border-l border-border p-6 overflow-y-auto bg-card/30">
        <h3 className="text-lg font-semibold mb-4">Security Info</h3>
        
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Commands Used</h4>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• sudo sysctl --system</li>
              <li>• sudo ufw enable</li>
              <li>• sudo ufw disable</li>
              <li>• sudo ufw status verbose</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Configuration Files</h4>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• /etc/sysctl.conf</li>
              <li>• /etc/ufw/ufw.conf</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Best Practices</h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>• Keep ASLR enabled for security</li>
              <li>• Enable SYN cookies to prevent DoS</li>
              <li>• Always enable firewall in production</li>
              <li>• Review firewall rules regularly</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

