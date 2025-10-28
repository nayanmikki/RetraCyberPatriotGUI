'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FirewallSettings } from '@/lib/types';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FirewallSettingsProps {
  settings: FirewallSettings;
  onChange: (settings: Partial<FirewallSettings>) => void;
}

export function FirewallSettingsCard({ settings, onChange }: FirewallSettingsProps) {
  const [newService, setNewService] = useState('');
  const [newPort, setNewPort] = useState('');
  const [newProtocol, setNewProtocol] = useState<'tcp' | 'udp'>('tcp');

  const commonServices = ['OpenSSH', 'HTTP', 'HTTPS', 'FTP', 'MySQL', 'PostgreSQL'];

  const addService = () => {
    if (newService && !settings.allowedServices.includes(newService)) {
      onChange({ allowedServices: [...settings.allowedServices, newService] });
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    onChange({ allowedServices: settings.allowedServices.filter(s => s !== service) });
  };

  const addCustomRule = () => {
    if (newPort) {
      const rule = { port: newPort, protocol: newProtocol, action: 'allow' as const };
      onChange({ customRules: [...settings.customRules, rule] });
      setNewPort('');
    }
  };

  const removeRule = (index: number) => {
    onChange({ customRules: settings.customRules.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="firewall-enabled">Firewall Status</Label>
        <Switch
          id="firewall-enabled"
          checked={settings.enabled}
          onCheckedChange={(checked) => onChange({ enabled: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="logging">Logging</Label>
        <Switch
          id="logging"
          checked={settings.logging}
          onCheckedChange={(checked) => onChange({ logging: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label>Default Inbound Policy</Label>
        <Select
          value={settings.defaultInbound}
          onValueChange={(value: 'deny' | 'allow') => onChange({ defaultInbound: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deny">Deny</SelectItem>
            <SelectItem value="allow">Allow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Default Outbound Policy</Label>
        <Select
          value={settings.defaultOutbound}
          onValueChange={(value: 'deny' | 'allow') => onChange({ defaultOutbound: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deny">Deny</SelectItem>
            <SelectItem value="allow">Allow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Allowed Services</Label>
        <div className="space-y-2 mt-2">
          <div className="flex flex-wrap gap-2">
            {settings.allowedServices.map((service, i) => (
              <Card key={i} className="px-2 py-1 flex items-center gap-2">
                <Shield className="h-3 w-3 text-green-500" />
                <span className="text-sm">{service}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0"
                  onClick={() => removeService(service)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newService} onValueChange={setNewService}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {commonServices.map(svc => (
                  <SelectItem key={svc} value={svc}>{svc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addService} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label>Custom Rules</Label>
        <div className="space-y-2 mt-2">
          {settings.customRules.map((rule, i) => (
            <Card key={i} className="p-2 flex items-center justify-between">
              <span className="text-sm">
                {rule.action} {rule.port}/{rule.protocol}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => removeRule(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Card>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Port (e.g., 8080)"
              value={newPort}
              onChange={(e) => setNewPort(e.target.value)}
            />
            <Select value={newProtocol} onValueChange={(v: 'tcp' | 'udp') => setNewProtocol(v)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tcp">TCP</SelectItem>
                <SelectItem value="udp">UDP</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addCustomRule} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

