'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { TaskFilter } from '@/types';
import { clsx } from 'clsx';
import {
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

const filters: { value: TaskFilter; label: string; icon: typeof ListBulletIcon }[] = [
  { value: 'all', label: 'All Tasks', icon: ListBulletIcon },
  { value: 'completed', label: 'Completed', icon: CheckCircleIcon },
  { value: 'pending', label: 'Pending', icon: ClockIcon },
];

export default function Sidebar({ filter, onFilterChange, stats }: SidebarProps) {
  const { theme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 pt-6 pb-4">
      <div className="px-4 mb-6">
        <h2 className="px-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Filters
        </h2>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {filters.map((f) => {
          const Icon = f.icon;
          const isActive = filter === f.value;
          const count = f.value === 'all' ? stats.total : f.value === 'completed' ? stats.completed : stats.pending;

          return (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                {f.label}
              </div>
              <span
                className={clsx(
                  'text-xs px-2 py-0.5 rounded-full',
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
          <p className="text-sm font-semibold mb-1">Pro Tip</p>
          <p className="text-xs text-indigo-100">Use priorities to focus on what matters most.</p>
        </div>
      </div>
    </aside>
  );
}