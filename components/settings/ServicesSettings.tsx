'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ServicesSettings } from '@/lib/types';
import { Server, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ServicesSettingsProps {
  settings: ServicesSettings;
  onChange: (settings: Partial<ServicesSettings>) => void;
}

export function ServicesSettingsCard({ settings, onChange }: ServicesSettingsProps) {
  const [newService, setNewService] = useState('');
  const [newCommand, setNewCommand] = useState('');

  const availableServices = ['ufw', 'ssh', 'apache2', 'mysql', 'postgresql', 'nginx'];

  const toggleAutoStart = (service: string) => {
    const autoStart = settings.autoStartServices.includes(service)
      ? settings.autoStartServices.filter(s => s !== service)
      : [...settings.autoStartServices, service];
    onChange({ autoStartServices: autoStart });
  };

  const addCommand = () => {
    if (newCommand) {
      onChange({ customCommands: [...settings.customCommands, newCommand] });
      setNewCommand('');
    }
  };

  const removeCommand = (index: number) => {
    onChange({ customCommands: settings.customCommands.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="apache-running">Apache2 Running</Label>
        <Switch
          id="apache-running"
          checked={settings.apache2Running}
          onCheckedChange={(checked) => onChange({ apache2Running: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="apache-enabled">Apache2 Auto-Start</Label>
        <Switch
          id="apache-enabled"
          checked={settings.apache2Enabled}
          onCheckedChange={(checked) => onChange({ apache2Enabled: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="ssh-enabled">SSH Enabled</Label>
        <Switch
          id="ssh-enabled"
          checked={settings.sshEnabled}
          onCheckedChange={(checked) => onChange({ sshEnabled: checked })}
        />
      </div>

      <div>
        <Label>Auto-Start on Boot</Label>
        <div className="space-y-2 mt-2">
          {availableServices.map(service => (
            <div key={service} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
              <span className="text-sm">{service}</span>
              <Switch
                checked={settings.autoStartServices.includes(service)}
                onCheckedChange={() => toggleAutoStart(service)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Custom Service Commands</Label>
        <div className="space-y-2 mt-2">
          {settings.customCommands.map((cmd, i) => (
            <Card key={i} className="p-2 flex items-center justify-between">
              <span className="text-xs font-mono truncate flex-1">{cmd}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => removeCommand(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </Card>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="systemctl restart service"
              value={newCommand}
              onChange={(e) => setNewCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCommand()}
            />
            <Button onClick={addCommand} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

