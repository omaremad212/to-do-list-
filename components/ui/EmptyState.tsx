'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'tasks' | 'search' | 'filter';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  tasks: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  search: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  filter: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
};

export default function EmptyState({
  title,
  description,
  icon = 'tasks',
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative w-24 h-24 mb-6"
      >
        <div className="absolute inset-0 gradient-primary/20 rounded-full animate-pulse" />
        <div className="relative w-full h-full flex items-center justify-center gradient-primary/10 rounded-full">
          <span className="text-[var(--primary)]">{icons[icon]}</span>
        </div>
      </motion.div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--muted-foreground)] max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-primary rounded-xl shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all"
        >
          <PlusIcon className="w-4 h-4" />
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}