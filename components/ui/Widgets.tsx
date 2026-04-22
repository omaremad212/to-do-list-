'use client';

import { Task } from '@/types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Flame as FlameIcon,
  Trophy as TrophyIcon,
  Bolt as BoltIcon,
  ArrowUp as ArrowUpIcon,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'completed' | 'created' | 'updated' | 'deleted';
  taskTitle: string;
  timestamp: Date;
  userId: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-emerald-500" />;
      case 'created':
        return <BoltIcon className="w-4 h-4 text-[var(--primary)]" />;
      case 'updated':
        return <ArrowUpIcon className="w-4 h-4 text-amber-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Recent Activity
        </h3>
        <span className="text-xs text-[var(--muted-foreground)]">
          Live updates
        </span>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
        {activities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-[var(--muted)]/50 hover:bg-[var(--muted)] transition-colors"
          >
            <div className="mt-0.5 p-2 rounded-lg bg-[var(--card)]">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">
                {activity.taskTitle}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface QuickStatsProps {
  tasks: Task[];
}

export function QuickStats({ tasks }: QuickStatsProps) {
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const streak = 5;

  const stats = [
    {
      icon: <TrophyIcon className="w-5 h-5" />,
      value: completionRate,
      suffix: '%',
      label: 'Completion Rate',
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      icon: <FlameIcon className="w-5 h-5" />,
      value: streak,
      suffix: ' days',
      label: 'Current Streak',
      color: 'text-orange-500 bg-orange-500/10',
    },
    {
      icon: <CheckCircleIcon className="w-5 h-5" />,
      value: completed,
      suffix: '',
      label: 'Completed',
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      icon: <ClockIcon className="w-5 h-5" />,
      value: pending,
      suffix: '',
      label: 'Pending',
      color: 'text-blue-500 bg-blue-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center"
        >
          <div className={clsx('inline-flex p-2 rounded-xl mb-2', stat.color)}>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-[var(--foreground)]">
            {stat.value}
            <span className="text-sm font-normal text-[var(--muted-foreground)]">
              {stat.suffix}
            </span>
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface ProductivityScoreProps {
  score: number;
  trend: number[];
}

export function ProductivityScore({ score, trend }: ProductivityScoreProps) {
  const maxTrend = Math.max(...trend);
  const getGrade = (s: number) => {
    if (s >= 90) return { grade: 'A+', color: 'text-emerald-500' };
    if (s >= 80) return { grade: 'A', color: 'text-emerald-500' };
    if (s >= 70) return { grade: 'B', color: 'text-blue-500' };
    if (s >= 60) return { grade: 'C', color: 'text-amber-500' };
    return { grade: 'D', color: 'text-red-500' };
  };

  const { grade, color } = getGrade(score);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-purple-600 text-white">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white/80">Productivity Score</span>
        <span className="text-xs text-white/60">This week</span>
      </div>
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-6xl font-bold"
        >
          {score}
        </motion.div>
        <div className="flex-1">
          <div className={clsx('text-4xl font-bold mb-2', color)}>
            {grade}
          </div>
          <div className="text-xs text-white/60">Excellent</div>
          <div className="mt-4 flex items-end gap-1 h-8">
            {trend.map((t, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(t / maxTrend) * 100}%` }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-white/30 rounded-t"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}