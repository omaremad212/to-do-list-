'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { TaskFilter } from '@/types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import {
  ListBulletIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import {
  ListBulletIcon as ListBulletIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
} from '@heroicons/react/24/solid';

interface SidebarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

const filters: {
  value: TaskFilter;
  label: string;
  icon: typeof ListBulletIcon;
  iconSolid: typeof ListBulletIconSolid;
  description: string;
}[] = [
  {
    value: 'all',
    label: 'All Tasks',
    icon: ListBulletIcon,
    iconSolid: ListBulletIconSolid,
    description: 'View all your tasks',
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: CheckCircleIcon,
    iconSolid: CheckCircleIconSolid,
    description: 'Finished tasks',
  },
  {
    value: 'pending',
    label: 'Pending',
    icon: ClockIcon,
    iconSolid: ClockIconSolid,
    description: 'Tasks to work on',
  },
];

export default function Sidebar({ filter, onFilterChange, stats }: SidebarProps) {
  const { theme } = useTheme();

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col fixed left-0 top-[var(--navbar-height)] h-[calc(100vh-var(--navbar-height))] w-[var(--sidebar-width)] border-r border-[var(--border)]',
        'bg-gradient-to-b from-[var(--card)] to-transparent',
        'transition-colors duration-300'
      )}
    >
      <div className="flex-1 flex flex-col py-6 px-4">
        <div className="mb-6 px-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Filters
          </h2>
        </div>

        <nav className="flex-1 space-y-2">
          {filters.map((f, index) => {
            const Icon = f.icon;
            const IconSolid = f.iconSolid;
            const isActive = filter === f.value;
            const count =
              f.value === 'all'
                ? stats.total
                : f.value === 'completed'
                  ? stats.completed
                  : stats.pending;

            return (
              <motion.button
                key={f.value}
                onClick={() => onFilterChange(f.value)}
                className={clsx(
                  'relative w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-left transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-[var(--primary)]/15 to-transparent'
                    : 'hover:bg-[var(--accent)]'
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-transparent rounded-2xl border border-[var(--primary)]/20"
                    initial={false}
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}

                <div
                  className={clsx(
                    'relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-[var(--accent)] group-hover:text-[var(--foreground)]'
                  )}
                >
                  {isActive ? (
                    <IconSolid className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="relative z-10 flex-1 min-w-0">
                  <p
                    className={clsx(
                      'text-sm font-semibold transition-colors duration-150',
                      isActive
                        ? 'text-[var(--foreground)]'
                        : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'
                    )}
                  >
                    {f.label}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {f.description}
                  </p>
                </div>

                <motion.span
                  className={clsx(
                    'relative z-10 text-xs font-bold px-2.5 py-1 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-[var(--secondary)]'
                  )}
                  layout
                >
                  {count}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[var(--primary)] to-purple-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-white/80" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Pro Tip
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                Use priorities to focus on what matters most.
              </p>
            </div>
            <div className="absolute -right-2 -bottom-2 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="px-3 py-2">
            <p className="text-xs text-[var(--muted-foreground)]">
              Keyboard shortcut:{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--muted)] font-mono text-[10px]">
                N
              </kbd>{' '}
              for new task
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}