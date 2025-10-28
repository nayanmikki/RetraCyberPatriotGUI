'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemUser, UserLabel } from '@/lib/types';
import { User, Shield, UserX } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface UserNodeProps {
  user: SystemUser;
}

export function UserNode({ user }: UserNodeProps) {
  const { updateUserLabel } = useApp();

  const getIcon = () => {
    switch (user.label) {
      case 'admin':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'unauthorized':
        return <UserX className="h-5 w-5 text-red-500" />;
      default:
        return <User className="h-5 w-5 text-blue-500" />;
    }
  };

  const getGlowClass = () => {
    switch (user.label) {
      case 'admin':
        return 'node-glow';
      case 'unauthorized':
        return 'node-glow-danger';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`glass p-4 cursor-move hover:border-primary/50 transition-all ${getGlowClass()}`}>
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="font-semibold text-white truncate">{user.username}</h3>
              <StatusBadge label={user.label} />
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div>UID: {user.uid}</div>
              <div className="truncate">Home: {user.home}</div>
              <div className="truncate">
                Groups: {user.groups.join(', ') || 'none'}
              </div>
            </div>
            
            <div className="mt-3">
              <Select
                value={user.label}
                onValueChange={(value: UserLabel) => updateUserLabel(user.username, value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Authorized Admin</SelectItem>
                  <SelectItem value="standard">Standard User</SelectItem>
                  <SelectItem value="unauthorized">Unauthorized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

