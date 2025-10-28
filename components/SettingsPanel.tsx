'use client';

import { useApp } from '@/lib/context/AppContext';
import { SettingNodeCard } from '@/components/SettingNodeCard';
import { Settings } from 'lucide-react';

export function SettingsPanel() {
  const { settingNodes } = useApp();

  return (
    <div className="w-96 h-full glass border-l border-white/10 overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Configuration</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Configure security settings
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        {settingNodes.map((node) => (
          <SettingNodeCard key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

