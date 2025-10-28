'use client';

import { Badge } from '@/components/ui/badge';
import { UserLabel } from '@/lib/types';

interface StatusBadgeProps {
  label: UserLabel;
  className?: string;
}

export function StatusBadge({ label, className }: StatusBadgeProps) {
  const variants = {
    admin: { variant: 'success' as const, text: 'Authorized Admin' },
    standard: { variant: 'default' as const, text: 'Standard User' },
    unauthorized: { variant: 'destructive' as const, text: 'Unauthorized' },
  };

  const { variant, text } = variants[label];

  return (
    <Badge variant={variant} className={className}>
      {text}
    </Badge>
  );
}

