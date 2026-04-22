'use client';

import { TaskFilter } from '@/types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

interface TaskFiltersProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onAddClick: () => void;
}

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskFilters({
  filter,
  onFilterChange,
  onAddClick,
}: TaskFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-1 p-1.5 bg-[var(--muted)] rounded-xl">
        {filters.map((f) => {
          const isActive = filter === f.value;
          return (
            <motion.button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[var(--card)] rounded-lg shadow-sm"
                  initial={false}
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-primary rounded-xl shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all"
      >
        <PlusIcon className="w-4 h-4" />
        Add Task
      </motion.button>
    </div>
  );
}