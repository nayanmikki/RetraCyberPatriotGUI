'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  KeyRound, 
  Loader2,
  AlertCircle,
  Shield
} from 'lucide-react';

export default function PasswordView() {
  const { users } = useApp();
  const [loading, setLoading] = useState(false);
  
  // Password policy settings
  const [minLength, setMinLength] = useState('12');
  const [rememberPrevious, setRememberPrevious] = useState('5');
  const [lockoutEnabled, setLockoutEnabled] = useState(false);
  const [resetOnSuccess, setResetOnSuccess] = useState(false);
  const [notifyLockout, setNotifyLockout] = useState(false);
  const [disableNullPasswords, setDisableNullPasswords] = useState(false);
  
  // Per-user settings
  const [selectedUser, setSelectedUser] = useState('');
  const [maxPasswordAge, setMaxPasswordAge] = useState('90');

  const applyMinLength = async () => {
    if (!confirm(`Set minimum password length to ${minLength} characters?\n\nThis will modify /etc/pam.d/common-password`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/password/set-min-length', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minLength: parseInt(minLength) }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Minimum password length updated successfully');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyRememberPrevious = async () => {
    if (!confirm(`Remember ${rememberPrevious} previous passwords?\n\nThis will modify /etc/pam.d/common-password`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/password/set-remember', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remember: parseInt(rememberPrevious) }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Password history updated successfully');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyLockoutPolicies = async () => {
    if (!confirm('Apply lockout policies?\n\nThis will create PAM configuration files and run pam-auth-update')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/password/set-lockout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lockoutEnabled,
          resetOnSuccess,
          notifyLockout
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Lockout policies applied successfully');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyDisableNullPasswords = async () => {
    if (!confirm('Remove nullok from PAM configuration?\n\nThis will prevent users from having empty passwords.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/password/disable-null', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disable: disableNullPasswords }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Null password policy updated successfully');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setUserPasswordAge = async () => {
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }

    if (!confirm(`Set maximum password age to ${maxPasswordAge} days for user "${selectedUser}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/password/set-max-age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: selectedUser,
          maxDays: parseInt(maxPasswordAge)
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Password age set for "${selectedUser}"`);
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
            <h2 className="text-2xl font-semibold text-foreground mb-1">Password Policy</h2>
            <p className="text-sm text-muted-foreground">Configure system-wide password requirements and user-specific policies</p>
          </div>

          <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <strong>Warning:</strong> Password policy changes modify PAM configuration files. Backups are created automatically. Test changes carefully to avoid locking yourself out.
              </div>
            </div>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              System-Wide Password Policies
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-length">Minimum Password Length</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="min-length"
                      type="number"
                      value={minLength}
                      onChange={(e) => setMinLength(e.target.value)}
                      min="8"
                      max="32"
                    />
                    <Button onClick={applyMinLength} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sets minlen in /etc/pam.d/common-password
                  </p>
                </div>

                <div>
                  <Label htmlFor="remember">Remember Previous Passwords</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="remember"
                      type="number"
                      value={rememberPrevious}
                      onChange={(e) => setRememberPrevious(e.target.value)}
                      min="0"
                      max="24"
                    />
                    <Button onClick={applyRememberPrevious} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Prevents reusing last N passwords
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="font-medium mb-4">Account Lockout Policies</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lockout-enabled">Lockout on Failed Logins</Label>
                      <p className="text-xs text-muted-foreground">Lock account after multiple failed attempts</p>
                    </div>
                    <Switch
                      id="lockout-enabled"
                      checked={lockoutEnabled}
                      onCheckedChange={setLockoutEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reset-success">Reset Lockout on Success</Label>
                      <p className="text-xs text-muted-foreground">Reset failed count on successful login</p>
                    </div>
                    <Switch
                      id="reset-success"
                      checked={resetOnSuccess}
                      onCheckedChange={setResetOnSuccess}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-lockout">Notify on Account Lockout</Label>
                      <p className="text-xs text-muted-foreground">Show notification when account is locked</p>
                    </div>
                    <Switch
                      id="notify-lockout"
                      checked={notifyLockout}
                      onCheckedChange={setNotifyLockout}
                    />
                  </div>

                  <Button onClick={applyLockoutPolicies} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply Lockout Policies'}
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="disable-null">Disable Null Passwords</Label>
                    <p className="text-xs text-muted-foreground">Remove nullok from /etc/pam.d/common-auth</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="disable-null"
                      checked={disableNullPasswords}
                      onCheckedChange={setDisableNullPasswords}
                    />
                    <Button onClick={applyDisableNullPasswords} disabled={loading} size="sm">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Per-User Password Settings
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="user-select">Select User</Label>
                <select
                  id="user-select"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="">-- Select a user --</option>
                  {users.map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.username} (UID: {user.uid})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="max-age">Maximum Password Age (days)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="max-age"
                    type="number"
                    value={maxPasswordAge}
                    onChange={(e) => setMaxPasswordAge(e.target.value)}
                    min="1"
                    max="365"
                  />
                  <Button onClick={setUserPasswordAge} disabled={loading || !selectedUser}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Age'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Uses: sudo chage -M {maxPasswordAge} {selectedUser || '[user]'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="w-96 border-l border-border p-6 overflow-y-auto bg-card/30">
        <h3 className="text-lg font-semibold mb-4">Configuration Info</h3>
        
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Files Modified</h4>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• /etc/pam.d/common-password</li>
              <li>• /etc/pam.d/common-auth</li>
              <li>• /usr/share/pam-configs/*</li>
              <li>• /etc/login.defs</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Backup Location</h4>
            <p className="text-xs text-muted-foreground">
              Backups are saved with timestamp:
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              /etc/pam.d/*.backup-YYYYMMDD-HHMMSS
            </p>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 text-sm">Commands Used</h4>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• sudo chage -M [days] [user]</li>
              <li>• sudo pam-auth-update</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

