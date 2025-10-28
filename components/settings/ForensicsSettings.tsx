'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ForensicsSettings } from '@/lib/types';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ForensicsSettingsProps {
  settings: ForensicsSettings;
  onChange: (settings: Partial<ForensicsSettings>) => void;
}

export function ForensicsSettingsCard({ settings, onChange }: ForensicsSettingsProps) {
  const [newPath, setNewPath] = useState('');
  const [newAllowedExt, setNewAllowedExt] = useState('');
  const [newProhibitedExt, setNewProhibitedExt] = useState('');

  const addPath = () => {
    if (newPath && !settings.scanPaths.includes(newPath)) {
      onChange({ scanPaths: [...settings.scanPaths, newPath] });
      setNewPath('');
    }
  };

  const removePath = (path: string) => {
    onChange({ scanPaths: settings.scanPaths.filter(p => p !== path) });
  };

  const addAllowedExt = () => {
    if (newAllowedExt && !settings.allowedExtensions.includes(newAllowedExt)) {
      onChange({ allowedExtensions: [...settings.allowedExtensions, newAllowedExt] });
      setNewAllowedExt('');
    }
  };

  const removeAllowedExt = (ext: string) => {
    onChange({ allowedExtensions: settings.allowedExtensions.filter(e => e !== ext) });
  };

  const addProhibitedExt = () => {
    if (newProhibitedExt && !settings.prohibitedExtensions.includes(newProhibitedExt)) {
      onChange({ prohibitedExtensions: [...settings.prohibitedExtensions, newProhibitedExt] });
      setNewProhibitedExt('');
    }
  };

  const removeProhibitedExt = (ext: string) => {
    onChange({ prohibitedExtensions: settings.prohibitedExtensions.filter(e => e !== ext) });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>File Search Paths</Label>
        <div className="space-y-2 mt-2">
          {settings.scanPaths.map((path, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={path} readOnly className="flex-1" />
              <Button
                size="icon"
                variant="destructive"
                onClick={() => removePath(path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="/home/*/Downloads"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPath()}
            />
            <Button onClick={addPath} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label>Allowed Extensions</Label>
        <div className="space-y-2 mt-2">
          <div className="flex flex-wrap gap-2">
            {settings.allowedExtensions.map((ext, i) => (
              <Card key={i} className="px-2 py-1 flex items-center gap-2">
                <span className="text-sm text-green-500">{ext}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0"
                  onClick={() => removeAllowedExt(ext)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder=".pdf"
              value={newAllowedExt}
              onChange={(e) => setNewAllowedExt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllowedExt()}
            />
            <Button onClick={addAllowedExt} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label>Prohibited Extensions</Label>
        <div className="space-y-2 mt-2">
          <div className="flex flex-wrap gap-2">
            {settings.prohibitedExtensions.map((ext, i) => (
              <Card key={i} className="px-2 py-1 flex items-center gap-2">
                <span className="text-sm text-red-500">{ext}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0"
                  onClick={() => removeProhibitedExt(ext)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder=".mp3"
              value={newProhibitedExt}
              onChange={(e) => setNewProhibitedExt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProhibitedExt()}
            />
            <Button onClick={addProhibitedExt} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Button className="w-full gap-2">
        <Search className="h-4 w-4" />
        Run Distribution Check
      </Button>
    </div>
  );
}

