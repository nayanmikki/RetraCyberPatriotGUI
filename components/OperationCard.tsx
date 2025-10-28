'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Operation } from '@/lib/opsRegistry';
import { useApp } from '@/lib/context/AppContext';
import { PlayCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface OperationCardProps {
  operation: Operation;
  status?: 'pending' | 'success' | 'error';
  params?: Record<string, string>;
}

export function OperationCard({ operation, status, params }: OperationCardProps) {
  const { executeOperation } = useApp();

  const handleExecute = () => {
    executeOperation(operation.id, params);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getCategoryColor = () => {
    switch (operation.category) {
      case 'firewall':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'accounts':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'services':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'updates':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'forensics':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'prohibited':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return '';
    }
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base">{operation.name}</CardTitle>
              {getStatusIcon()}
            </div>
            <CardDescription className="text-xs">{operation.description}</CardDescription>
          </div>
          <Badge className={getCategoryColor()} variant="outline">
            {operation.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {operation.requiresRoot && (
              <span className="text-yellow-500">Requires root</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleExecute}
            disabled={status === 'pending'}
            className="gap-2"
          >
            <PlayCircle className="h-3 w-3" />
            Run
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

