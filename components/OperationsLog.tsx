'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/lib/context/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, CheckCircle, XCircle, Clock } from 'lucide-react';

export function OperationsLog() {
  const { operations } = useApp();

  const getStatusIcon = (status: string) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Operations Log</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-64">
          {operations.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No operations yet
            </div>
          ) : (
            <div className="space-y-2">
              {operations.map((op) => (
                <div
                  key={op.id}
                  className="p-3 bg-secondary/30 rounded-lg border border-white/5"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(op.status)}
                      <span className="text-sm font-medium">{op.operationName}</span>
                    </div>
                    {getStatusBadge(op.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(op.timestamp).toLocaleString()}
                  </div>
                  {op.output && (
                    <div className="mt-2 p-2 bg-black/20 rounded text-xs font-mono text-green-400">
                      {op.output}
                    </div>
                  )}
                  {op.error && (
                    <div className="mt-2 p-2 bg-red-500/10 rounded text-xs font-mono text-red-400">
                      {op.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

