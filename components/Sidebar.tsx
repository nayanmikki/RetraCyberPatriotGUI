'use client';

import { useApp } from '@/lib/context/AppContext';
import { UserNode } from '@/components/UserNode';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function Sidebar() {
  const { users, loading } = useApp();

  return (
    <div className="w-80 h-full glass border-r border-white/10 overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">System Users</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {users.length} user{users.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="p-4 space-y-3">
        {loading && users.length === 0 ? (
          <Card className="glass p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Loading users...
            </p>
          </Card>
        ) : users.length === 0 ? (
          <Card className="glass p-6 text-center">
            <p className="text-muted-foreground text-sm">
              No users found. Click "Scan System" to load users.
            </p>
          </Card>
        ) : (
          users.map((user) => (
            <UserNode key={user.username} user={user} />
          ))
        )}
      </div>
    </div>
  );
}

