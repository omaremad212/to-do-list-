'use client';

import { TaskFilter } from '@/types';
import { clsx } from 'clsx';

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

export default function TaskFilters({ filter, onFilterChange, onAddClick }: TaskFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-2 mb-6">
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              filter === f.value
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={onAddClick}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
      >
        + Add Task
      </button>
    </div>
  );
}