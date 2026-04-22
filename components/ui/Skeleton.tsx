'use client';

import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-slate-200 dark:bg-slate-700',
        {
          'h-4 rounded': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-lg': variant === 'rectangular',
        },
        className
      )}
    />
  );
}

export function TaskSkeleton() {
  return (
    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
      <div className="flex items-start gap-3">
        <Skeleton className="w-5 h-5 mt-0.5" variant="circular" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}