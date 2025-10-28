'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AccountsSettings } from '@/lib/types';
import { Key, UserCog } from 'lucide-react';

interface AccountsSettingsProps {
  settings: AccountsSettings;
  onChange: (settings: Partial<AccountsSettings>) => void;
}

export function AccountsSettingsCard({ settings, onChange }: AccountsSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Password Minimum Length: {settings.passwordMinLength}</Label>
        <Slider
          value={[settings.passwordMinLength]}
          onValueChange={([value]) => onChange({ passwordMinLength: value })}
          min={8}
          max={32}
          step={1}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="require-mixed">Require Mixed Characters</Label>
        <Switch
          id="require-mixed"
          checked={settings.requireMixedChars}
          onCheckedChange={(checked) => onChange({ requireMixedChars: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label>Password Rotation (days): {settings.passwordRotationDays}</Label>
        <Slider
          value={[settings.passwordRotationDays]}
          onValueChange={([value]) => onChange({ passwordRotationDays: value })}
          min={30}
          max={365}
          step={30}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="auto-lock">Auto-Lock Inactive Accounts</Label>
        <Switch
          id="auto-lock"
          checked={settings.autoLockInactive}
          onCheckedChange={(checked) => onChange({ autoLockInactive: checked })}
        />
      </div>

      <div className="pt-2 space-y-2">
        <Button className="w-full gap-2" variant="outline">
          <Key className="h-4 w-4" />
          Generate Random Passwords
        </Button>
        <Button className="w-full gap-2" variant="outline">
          <UserCog className="h-4 w-4" />
          Apply Password Policy
        </Button>
      </div>
    </div>
  );
}

