'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { TaskPriority } from '@/types';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold',
        {
          'bg-[var(--muted)] text-[var(--muted-foreground)]': variant === 'default',
          'bg-[var(--color-priority-low-bg)] text-[var(--color-priority-low)]': variant === 'success',
          'bg-[var(--color-priority-medium-bg)] text-[var(--color-priority-medium)]': variant === 'warning',
          'bg-[var(--color-priority-high-bg)] text-[var(--color-priority-high)]': variant === 'danger',
        },
        className
      )}
    >
      {children}
    </motion.span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = {
    low: { variant: 'success' as const, label: 'Low' },
    medium: { variant: 'warning' as const, label: 'Medium' },
    high: { variant: 'danger' as const, label: 'High' },
  };

  const { variant, label } = config[priority];

  return <Badge variant={variant}>{label}</Badge>;
}