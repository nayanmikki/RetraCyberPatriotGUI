'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Server, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity,
  PlayCircle,
  Loader2
} from 'lucide-react';

export default function DashboardView() {
  const { users, systemInfo, operations } = useApp();
  const [verifying, setVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<any>(null);

  const adminUsers = users.filter(u => u.label === 'admin');
  const unauthorizedUsers = users.filter(u => u.label === 'unauthorized');
  const recentOps = operations.slice(0, 5);

  const runVerification = async () => {
    setVerifying(true);
    try {
      const response = await fetch('/api/verify-scoring');
      const data = await response.json();
      
      if (data.success) {
        setVerificationResults(data.results);
      } else {
        alert(`Verification failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1">Dashboard</h2>
          <p className="text-sm text-muted-foreground">System overview and quick status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin Users</p>
                <p className="text-2xl font-bold">{adminUsers.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Firewall Status</p>
                <Badge variant={systemInfo?.firewall === 'active' ? 'default' : 'destructive'} className="mt-1">
                  {systemInfo?.firewall || 'Unknown'}
                </Badge>
              </div>
              <Server className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unauthorized</p>
                <p className="text-2xl font-bold text-destructive">{unauthorizedUsers.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Operations
            </h3>
            <div className="space-y-3">
              {recentOps.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No operations performed yet
                </p>
              ) : (
                recentOps.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                    <div className="flex items-center gap-3">
                      {op.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : op.status === 'error' ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{op.operationName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(op.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={op.status === 'success' ? 'default' : op.status === 'error' ? 'destructive' : 'secondary'}>
                      {op.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </h3>
            <div className="space-y-3">
              {systemInfo?.firewall !== 'active' && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">Firewall Inactive</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable UFW firewall to protect your system
                  </p>
                </div>
              )}
              {unauthorizedUsers.length > 0 && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">
                    {unauthorizedUsers.length} Unauthorized User{unauthorizedUsers.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Review and remove unauthorized user accounts
                  </p>
                </div>
              )}
              {adminUsers.length > 3 && (
                <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-500">
                    Multiple Admin Accounts
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {adminUsers.length} users have admin privileges
                  </p>
                </div>
              )}
              {systemInfo?.firewall === 'active' && unauthorizedUsers.length === 0 && adminUsers.length <= 3 && (
                <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                  <p className="text-sm font-medium text-green-600 dark:text-green-500">
                    No Critical Alerts
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    System security looks good
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Distribution</p>
              <p className="text-sm font-medium">{systemInfo?.distro || 'Not scanned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Scan</p>
              <p className="text-sm font-medium">
                {systemInfo?.scannedAt 
                  ? new Date(systemInfo.scannedAt).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Re-run Scoring Verification
            </h3>
            <Button onClick={runVerification} disabled={verifying} className="gap-2">
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
              {verifying ? 'Verifying...' : 'Verify All'}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Verify that all security configurations are properly applied
          </p>

          {verificationResults && (
            <div className="space-y-2">
              {verificationResults.map((result: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-accent/50">
                  <span className="text-sm">{result.check}</span>
                  <Badge variant={result.passed ? 'default' : 'destructive'} className="gap-1">
                    {result.passed ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Pass
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        Fail
                      </>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

