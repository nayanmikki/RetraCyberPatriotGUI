'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { SystemUser, SettingNode, NodeLink, OperationLog, SystemInfo, DEFAULT_SETTING_NODES } from '@/lib/types';

interface AppContextType {
  users: SystemUser[];
  setUsers: (users: SystemUser[]) => void;
  updateUserLabel: (username: string, label: SystemUser['label']) => void;
  updateUserPosition: (username: string, x: number, y: number) => void;
  
  settingNodes: SettingNode[];
  updateSettingNode: (id: string, settings: Record<string, any>) => void;
  
  links: NodeLink[];
  addLink: (link: NodeLink) => void;
  removeLink: (linkId: string) => void;
  
  operations: OperationLog[];
  addOperation: (operation: OperationLog) => void;
  
  systemInfo: SystemInfo | null;
  setSystemInfo: (info: SystemInfo) => void;
  
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  error: string | null;
  setError: (error: string | null) => void;
  
  scanSystem: () => Promise<void>;
  executeOperation: (operationId: string, params?: Record<string, string>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [settingNodes, setSettingNodes] = useState<SettingNode[]>(DEFAULT_SETTING_NODES);
  const [links, setLinks] = useState<NodeLink[]>([]);
  const [operations, setOperations] = useState<OperationLog[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserLabel = useCallback((username: string, label: SystemUser['label']) => {
    setUsers(prev => prev.map(user =>
      user.username === username ? { ...user, label } : user
    ));
  }, []);

  const updateUserPosition = useCallback((username: string, x: number, y: number) => {
    setUsers(prev => prev.map(user =>
      user.username === username ? { ...user, x, y } : user
    ));
  }, []);

  const updateSettingNode = useCallback((id: string, settings: Record<string, any>) => {
    setSettingNodes(prev => prev.map(node =>
      node.id === id ? { ...node, settings: { ...node.settings, ...settings } } : node
    ));
  }, []);

  const addLink = useCallback((link: NodeLink) => {
    setLinks(prev => [...prev, link]);
  }, []);

  const removeLink = useCallback((linkId: string) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
  }, []);

  const addOperation = useCallback((operation: OperationLog) => {
    setOperations(prev => [operation, ...prev]);
  }, []);

  const scanSystem = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scan');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to scan system');
      }
      
      // Position users in a grid on the left side
      const usersWithPositions = data.users.map((user: SystemUser, index: number) => ({
        ...user,
        x: 100,
        y: 100 + (index * 100),
      }));
      
      setUsers(usersWithPositions);
      setSystemInfo(data.system);
    } catch (err: any) {
      setError(err.message || 'Failed to scan system');
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const executeOperation = useCallback(async (operationId: string, params?: Record<string, string>) => {
    const operationLog: OperationLog = {
      id: `op-${Date.now()}`,
      timestamp: new Date().toISOString(),
      operationId,
      operationName: operationId,
      status: 'pending',
    };
    
    addOperation(operationLog);
    setError(null);
    
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationId, params }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Operation failed');
      }
      
      setOperations(prev => prev.map(op =>
        op.id === operationLog.id
          ? { ...op, status: 'success', output: data.stdout }
          : op
      ));
    } catch (err: any) {
      setError(err.message || 'Operation failed');
      setOperations(prev => prev.map(op =>
        op.id === operationLog.id
          ? { ...op, status: 'error', error: err.message }
          : op
      ));
      console.error('Execute error:', err);
    }
  }, [addOperation]);

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        updateUserLabel,
        updateUserPosition,
        settingNodes,
        updateSettingNode,
        links,
        addLink,
        removeLink,
        operations,
        addOperation,
        systemInfo,
        setSystemInfo,
        loading,
        setLoading,
        error,
        setError,
        scanSystem,
        executeOperation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

