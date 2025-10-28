'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { SettingNode } from '@/lib/types';
import { useApp } from '@/lib/context/AppContext';
import { Shield, Lock, RefreshCw, Server, Search, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingNodeCardProps {
  node: SettingNode;
}

export function SettingNodeCard({ node }: SettingNodeCardProps) {
  const { updateSettingNode } = useApp();

  const getIcon = () => {
    switch (node.type) {
      case 'firewall':
        return <Shield className="h-5 w-5 text-orange-500" />;
      case 'ssh':
        return <Lock className="h-5 w-5 text-blue-500" />;
      case 'updates':
        return <RefreshCw className="h-5 w-5 text-green-500" />;
      case 'services':
        return <Server className="h-5 w-5 text-purple-500" />;
      case 'forensics':
        return <Search className="h-5 w-5 text-yellow-500" />;
      case 'prohibited':
        return <Ban className="h-5 w-5 text-red-500" />;
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    updateSettingNode(node.id, { [key]: value });
  };

  const renderSettings = () => {
    switch (node.type) {
      case 'firewall':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="firewall-enabled">Enable Firewall</Label>
              <Switch
                id="firewall-enabled"
                checked={node.settings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-ssh">Allow SSH</Label>
              <Switch
                id="allow-ssh"
                checked={node.settings.allowSSH}
                onCheckedChange={(checked) => handleSettingChange('allowSSH', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-http">Allow HTTP</Label>
              <Switch
                id="allow-http"
                checked={node.settings.allowHTTP}
                onCheckedChange={(checked) => handleSettingChange('allowHTTP', checked)}
              />
            </div>
          </div>
        );

      case 'ssh':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="permit-root">Permit Root Login</Label>
              <Switch
                id="permit-root"
                checked={node.settings.permitRootLogin}
                onCheckedChange={(checked) => handleSettingChange('permitRootLogin', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password-auth">Password Auth</Label>
              <Switch
                id="password-auth"
                checked={node.settings.passwordAuth}
                onCheckedChange={(checked) => handleSettingChange('passwordAuth', checked)}
              />
            </div>
          </div>
        );

      case 'updates':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-updates">Auto Updates</Label>
              <Switch
                id="auto-updates"
                checked={node.settings.autoUpdates}
                onCheckedChange={(checked) => handleSettingChange('autoUpdates', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label>Update Interval (days): {node.settings.updateInterval}</Label>
              <Slider
                value={[node.settings.updateInterval]}
                onValueChange={([value]) => handleSettingChange('updateInterval', value)}
                min={1}
                max={30}
                step={1}
              />
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="apache-running">Apache2 Running</Label>
              <Switch
                id="apache-running"
                checked={node.settings.apache2Running}
                onCheckedChange={(checked) => handleSettingChange('apache2Running', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="apache-enabled">Apache2 Enabled</Label>
              <Switch
                id="apache-enabled"
                checked={node.settings.apache2Enabled}
                onCheckedChange={(checked) => handleSettingChange('apache2Enabled', checked)}
              />
            </div>
          </div>
        );

      case 'forensics':
        return (
          <div className="space-y-2">
            <Label>Scan Paths</Label>
            <div className="text-xs text-muted-foreground space-y-1">
              {node.settings.scanPaths.map((path: string, i: number) => (
                <div key={i} className="p-2 bg-secondary/30 rounded">
                  {path}
                </div>
              ))}
            </div>
          </div>
        );

      case 'prohibited':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="remove-wireshark">Remove Wireshark</Label>
              <Switch
                id="remove-wireshark"
                checked={node.settings.removeWireshark}
                onCheckedChange={(checked) => handleSettingChange('removeWireshark', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="remove-ophcrack">Remove Ophcrack</Label>
              <Switch
                id="remove-ophcrack"
                checked={node.settings.removeOphcrack}
                onCheckedChange={(checked) => handleSettingChange('removeOphcrack', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="remove-nmap">Remove Nmap</Label>
              <Switch
                id="remove-nmap"
                checked={node.settings.removeNmap}
                onCheckedChange={(checked) => handleSettingChange('removeNmap', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="remove-john">Remove John</Label>
              <Switch
                id="remove-john"
                checked={node.settings.removeJohn}
                onCheckedChange={(checked) => handleSettingChange('removeJohn', checked)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-base">{node.label}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {renderSettings()}
        </CardContent>
      </Card>
    </motion.div>
  );
}

