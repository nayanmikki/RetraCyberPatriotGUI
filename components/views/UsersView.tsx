'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Shield, 
  ShieldOff,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function UsersView() {
  const { users, updateUserLabel, scanSystem } = useApp();
  const [loading, setLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const removeUser = async (username: string) => {
    const user = users.find(u => u.username === username);
    
    if (!user) return;
    
    if (user.label !== 'unauthorized') {
      alert('User must be marked as "Unauthorized" before removal!');
      return;
    }

    if (!confirm(`Remove user "${username}" and their home directory?\n\nThis action cannot be undone!`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`User "${username}" removed successfully`);
        scanSystem();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeAdminRights = async (username: string) => {
    if (!confirm(`Remove admin rights from "${username}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch('/api/users/remove-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Admin rights removed from "${username}"`);
        scanSystem();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      alert('Group name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/create-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupName: newGroupName }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Group "${newGroupName}" created successfully`);
        setNewGroupName('');
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addMembersToGroup = async () => {
    if (!selectedGroup || !groupMembers.trim()) {
      alert('Group name and members are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/add-to-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          groupName: selectedGroup,
          members: groupMembers.split(',').map(m => m.trim()).filter(Boolean)
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Members added to "${selectedGroup}"`);
        setGroupMembers('');
        scanSystem();
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
            <h2 className="text-2xl font-semibold text-foreground mb-1">Users & Groups</h2>
            <p className="text-sm text-muted-foreground">Manage system users and group memberships</p>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              System Users ({users.length})
            </h3>

            <div className="mb-4 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <strong>Important:</strong> You must manually mark users as "Authorized" or "Unauthorized" before performing destructive actions. Users marked as "Unauthorized" can be removed.
                </div>
              </div>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.username} className="p-4 rounded-md bg-accent/50 border border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{user.username}</span>
                          <Badge variant="outline">UID: {user.uid}</Badge>
                          {user.groups.includes('sudo') || user.groups.includes('admin') ? (
                            <Badge variant="default" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Admin
                            </Badge>
                          ) : null}
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Home: {user.home}</p>
                          <p>Groups: {user.groups.join(', ')}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs text-muted-foreground">Authorization:</span>
                          <Button
                            size="sm"
                            variant={user.label === 'admin' ? 'default' : 'outline'}
                            onClick={() => updateUserLabel(user.username, 'admin')}
                            className="h-6 px-2 text-xs"
                          >
                            Authorized (Admin)
                          </Button>
                          <Button
                            size="sm"
                            variant={user.label === 'standard' ? 'default' : 'outline'}
                            onClick={() => updateUserLabel(user.username, 'standard')}
                            className="h-6 px-2 text-xs"
                          >
                            Authorized (Standard)
                          </Button>
                          <Button
                            size="sm"
                            variant={user.label === 'unauthorized' ? 'destructive' : 'outline'}
                            onClick={() => updateUserLabel(user.username, 'unauthorized')}
                            className="h-6 px-2 text-xs"
                          >
                            Unauthorized
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {(user.groups.includes('sudo') || user.groups.includes('admin')) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeAdminRights(user.username)}
                            disabled={loading}
                            className="gap-1"
                          >
                            <ShieldOff className="h-3 w-3" />
                            Remove Admin
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeUser(user.username)}
                          disabled={loading || user.label !== 'unauthorized'}
                          className="gap-1"
                        >
                          <UserMinus className="h-3 w-3" />
                          Remove User
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No users found. Click "Scan System" to load users.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      <div className="w-96 border-l border-border p-6 overflow-y-auto bg-card/30">
        <h3 className="text-lg font-semibold mb-4">Group Management</h3>
        
        <div className="space-y-6">
          <Card className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create Group
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., spider"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={createGroup} 
                disabled={loading || !newGroupName.trim()}
                className="w-full gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Create Group
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3">Add Members to Group</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="target-group">Group Name</Label>
                <Input
                  id="target-group"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  placeholder="e.g., spider"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="members">Members (comma-separated)</Label>
                <Input
                  id="members"
                  value={groupMembers}
                  onChange={(e) => setGroupMembers(e.target.value)}
                  placeholder="user1,user2,user3"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={addMembersToGroup} 
                disabled={loading || !selectedGroup.trim() || !groupMembers.trim()}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Add Members
              </Button>
            </div>
          </Card>

          <div className="p-3 rounded-md bg-muted text-xs text-muted-foreground">
            <p className="font-medium mb-1">Commands used:</p>
            <ul className="space-y-1 font-mono">
              <li>• sudo deluser --remove-home [user]</li>
              <li>• sudo gpasswd -d [user] sudo</li>
              <li>• sudo addgroup [group]</li>
              <li>• sudo gpasswd -M [users] [group]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

