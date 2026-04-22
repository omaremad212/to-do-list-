'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({
  className,
  variant = 'text',
}: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={clsx(
        'skeleton',
        {
          'h-4 rounded-lg': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-xl': variant === 'rectangular',
        },
        className
      )}
    />
  );
}

export function TaskSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm"
    >
      <div className="flex items-start gap-4">
        <Skeleton className="w-6 h-6 mt-0.5" variant="circular" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" variant="rectangular" />
            <Skeleton className="h-6 w-20" variant="rectangular" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}