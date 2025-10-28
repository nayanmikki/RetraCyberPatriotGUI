'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OperationCard } from '@/components/OperationCard';
import { OPS, getOperationsByCategory } from '@/lib/opsRegistry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export function QuickActions() {
  const categories = [
    { id: 'firewall', label: 'Firewall' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'services', label: 'Services' },
    { id: 'updates', label: 'Updates' },
    { id: 'prohibited', label: 'Prohibited' },
    { id: 'forensics', label: 'Forensics' },
  ] as const;

  return (
    <Card className="glass h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="firewall" className="w-full">
          <TabsList className="grid grid-cols-3 gap-1 mb-4">
            {categories.slice(0, 3).map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid grid-cols-3 gap-1 mb-4">
            {categories.slice(3).map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="h-96">
            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="space-y-2 mt-0">
                {getOperationsByCategory(cat.id).map((op) => (
                  <OperationCard key={op.id} operation={op} />
                ))}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

