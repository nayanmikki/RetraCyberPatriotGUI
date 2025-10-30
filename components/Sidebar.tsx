'use client';

import { 
  LayoutDashboard, 
  Search, 
  Users, 
  KeyRound, 
  Shield, 
  Server, 
  Trash2, 
  FileText 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'forensics', label: 'Forensics', icon: Search },
  { id: 'users', label: 'Users & Groups', icon: Users },
  { id: 'password', label: 'Password Policy', icon: KeyRound },
  { id: 'security', label: 'System Security', icon: Shield },
  { id: 'services', label: 'Services', icon: Server },
  { id: 'cleanup', label: 'Cleanup & Updates', icon: Trash2 },
  { id: 'logs', label: 'Logs', icon: FileText },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-56 h-full border-r border-border bg-card/30 backdrop-blur-sm overflow-y-auto">
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

