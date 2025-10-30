'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Server, 
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';

export default function ServicesView() {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/services/list');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const toggleService = async (serviceName: string, enable: boolean) => {
    // Guardrail: cannot disable vsftpd
    if (serviceName === 'vsftpd' && !enable) {
      alert('⚠️ GUARDRAIL: Cannot disable vsftpd!\n\nDisabling vsftpd may result in scoring penalties.');
      return;
    }

    if (!confirm(`${enable ? 'Enable' : 'Disable'} ${serviceName}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/services/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceName, enable }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`${serviceName} ${enable ? 'enabled' : 'disabled'} successfully`);
        loadServices();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const quickDisableNginx = async () => {
    await toggleService('nginx', false);
  };

  const quickDisableSquid = async () => {
    if (!confirm('Disable squid?\n\nNote: This operation can take ~1 minute.')) {
      return;
    }
    
    await toggleService('squid', false);
  };

  const ensureVsftpd = async () => {
    await toggleService('vsftpd', true);
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">Services</h2>
            <p className="text-sm text-muted-foreground">Manage system services and daemons</p>
          </div>

          <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <strong>Guardrail:</strong> vsftpd cannot be disabled through this interface to prevent scoring penalties. Ensure vsftpd remains running and do not delete files under public FTP paths flagged as "critical".
              </div>
            </div>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button onClick={quickDisableNginx} disabled={loading} variant="outline" className="gap-2">
                <XCircle className="h-4 w-4" />
                Disable nginx
              </Button>
              <Button onClick={quickDisableSquid} disabled={loading} variant="outline" className="gap-2">
                <XCircle className="h-4 w-4" />
                Disable squid
              </Button>
              <Button onClick={ensureVsftpd} disabled={loading} variant="default" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Ensure vsftpd Running
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Services</h3>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Filter services..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-48"
                />
                <Button onClick={loadServices} disabled={loading} size="sm" className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Server className="h-4 w-4" />}
                  Refresh
                </Button>
              </div>
            </div>

            <ScrollArea className="h-96">
              {loading && services.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin" />
                  <p>Loading services...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Server className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No services found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredServices.map((service) => (
                    <div key={service.name} className="p-4 rounded-md bg-accent/50 border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{service.name}</span>
                            {service.name === 'vsftpd' && (
                              <Badge variant="default" className="gap-1">
                                <Shield className="h-3 w-3" />
                                Protected
                              </Badge>
                            )}
                            {service.active ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                Inactive
                              </Badge>
                            )}
                            {service.enabled ? (
                              <Badge variant="outline">Enabled</Badge>
                            ) : (
                              <Badge variant="outline">Disabled</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{service.description || 'No description'}</p>
                        </div>

                        <div className="flex gap-2 ml-4">
                          {!service.enabled && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => toggleService(service.name, true)}
                              disabled={loading}
                            >
                              Enable
                            </Button>
                          )}
                          {service.enabled && service.name !== 'vsftpd' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => toggleService(service.name, false)}
                              disabled={loading}
                            >
                              Disable
                            </Button>
                          )}
                          {service.name === 'vsftpd' && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="gap-1"
                            >
                              <Shield className="h-3 w-3" />
                              Protected
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>

      <div className="w-96 border-l border-border p-6 overflow-y-auto bg-card/30">
        <h3 className="text-lg font-semibold mb-4">Service Management</h3>
        
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Commands Used</h4>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• systemctl list-units --type=service</li>
              <li>• sudo systemctl enable [service]</li>
              <li>• sudo systemctl disable --now [service]</li>
              <li>• sudo systemctl status [service]</li>
            </ul>
          </Card>

          <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
            <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              Important Notes
            </h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>• vsftpd is protected and cannot be disabled</li>
              <li>• Disabling squid can take ~1 minute</li>
              <li>• Always verify service status after changes</li>
              <li>• Some services may require reboot</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Service States</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="h-5">Active</Badge>
                <span>Service is running</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-5">Inactive</Badge>
                <span>Service is stopped</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-5">Enabled</Badge>
                <span>Starts on boot</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-5">Disabled</Badge>
                <span>Does not start on boot</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

