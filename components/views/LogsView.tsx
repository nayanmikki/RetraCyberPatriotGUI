'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download,
  Copy,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export default function LogsView() {
  const { operations } = useApp();
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOps = operations.filter(op => {
    const matchesText = op.operationName.toLowerCase().includes(filter.toLowerCase()) ||
                       op.operationId.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    return matchesText && matchesStatus;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const exportLogs = () => {
    const logText = operations.map(op => {
      return `[${new Date(op.timestamp).toLocaleString()}] ${op.operationName} (${op.operationId})
Status: ${op.status}
${op.output ? `Output:\n${op.output}\n` : ''}
${op.error ? `Error:\n${op.error}\n` : ''}
${'='.repeat(80)}
`;
    }).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpatriot-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-1">Logs</h2>
        <p className="text-sm text-muted-foreground">View and export operation history</p>
      </div>

      <Card className="flex-1 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'success' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('success')}
              className="gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Success
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'error' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('error')}
              className="gap-1"
            >
              <XCircle className="h-3 w-3" />
              Error
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('pending')}
              className="gap-1"
            >
              <Clock className="h-3 w-3" />
              Pending
            </Button>
          </div>

          <Button onClick={exportLogs} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {filteredOps.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No operations logged yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOps.map((op) => (
                <Card key={op.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {op.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : op.status === 'error' ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{op.operationName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(op.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          op.status === 'success' ? 'default' : 
                          op.status === 'error' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {op.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(
                          `${op.operationName}\n${op.output || op.error || 'No output'}`
                        )}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {op.output && (
                    <div className="mt-2 p-3 rounded-md bg-muted">
                      <p className="text-xs font-medium mb-1">Output:</p>
                      <pre className="text-xs whitespace-pre-wrap font-mono">{op.output}</pre>
                    </div>
                  )}

                  {op.error && (
                    <div className="mt-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                      <p className="text-xs font-medium mb-1 text-destructive">Error:</p>
                      <pre className="text-xs whitespace-pre-wrap font-mono text-destructive">{op.error}</pre>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-mono">ID: {op.operationId}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total operations: {operations.length}</span>
            <span>Showing: {filteredOps.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

