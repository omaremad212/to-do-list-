'use client';

import { useSession } from 'next-auth/react';
import { Navbar, Sidebar } from '@/components/layout';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { clsx } from 'clsx';
import {
  CheckCircleIcon,
  ClockIcon,
  BoltIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { LineChart, StatCard, DonutChart } from '@/components/ui/Charts';
import { RecentActivity, QuickStats, ProductivityScore } from '@/components/ui/Widgets';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    tasks,
    loading,
    stats,
    isDemo,
    filter,
    setFilter,
  } = useTasks();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full gradient-primary"
        />
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high');
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate) < new Date();
  });

  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  const generateActivityData = () => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });
    
    return last7Days.map((day) => {
      const dayTasks = tasks.filter((t) => {
        if (!t.updatedAt) return false;
        const taskDate = new Date(t.updatedAt);
        return taskDate.toDateString() === day.toDateString();
      });
      return {
        label: format(day, 'EEE'),
        value: dayTasks.length,
      };
    });
  };

  const generatePriorityData = () => [
    { label: 'High', value: highPriorityTasks.length, color: 'var(--color-priority-high)' },
    { label: 'Medium', value: tasks.filter((t) => t.priority === 'medium').length, color: 'var(--color-priority-medium)' },
    { label: 'Low', value: tasks.filter((t) => t.priority === 'low').length, color: 'var(--color-priority-low)' },
  ];

  const chartData = generateActivityData();
  const priorityData = generatePriorityData();

  const recentActivities = tasks
    .slice(0, 10)
    .map((t) => ({
      id: t.id,
      type: t.completed ? 'completed' as const : 'created' as const,
      taskTitle: t.title,
      timestamp: new Date(t.updatedAt || t.createdAt),
      userId: t.userId,
    }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <div className="flex">
        <Sidebar filter={filter} onFilterChange={setFilter} stats={stats} />
        
        <main className="flex-1 pt-[var(--navbar-height)] lg:ml-[var(--sidebar-width)]">
          <div className="p-6 lg:p-8 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key="header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {isDemo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-4 py-3 gradient-primary/10 border border-[var(--primary)]/20 rounded-2xl mb-6"
                  >
                    <BoltIcon className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-sm font-medium text-[var(--primary)]">
                      Demo Mode - Exploring with sample data
                    </span>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                      Dashboard
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-1 bg-[var(--muted)] rounded-xl">
                    {(['7d', '30d', '90d'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={clsx(
                          'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                          timeRange === range
                            ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                        )}
                      >
                        {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Tasks"
                value={tasks.length}
                change={12}
                trend="up"
                icon={<ChartBarIcon className="w-5 h-5" />}
                subtitle="This week"
              />
              <StatCard
                title="Completed"
                value={completedTasks.length}
                change={8}
                trend="up"
                icon={<CheckCircleIcon className="w-5 h-5" />}
                subtitle="This week"
              />
              <StatCard
                title="In Progress"
                value={pendingTasks.length}
                change={-3}
                trend="down"
                icon={<ClockIcon className="w-5 h-5" />}
              />
              <StatCard
                title="Overdue"
                value={overdueTasks.length}
                change={0}
                trend="neutral"
                icon={<CalendarIcon className="w-5 h-5" />}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      Task Completion
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Tasks completed over time
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--foreground)]">
                      {completionRate}%
                    </div>
                    <div className="text-xs text-emerald-500">+5% vs last week</div>
                  </div>
                </div>
                <LineChart
                  data={chartData}
                  height={200}
                  color="var(--primary)"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                  By Priority
                </h3>
                <DonutChart data={priorityData} size={160} strokeWidth={16} />
                <div className="mt-6 space-y-3">
                  {priorityData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm"
              >
                <QuickStats tasks={tasks} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm"
              >
                <ProductivityScore 
                  score={completionRate} 
                  trend={[65, 72, 68, 80, 75, 85, completionRate]} 
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm"
            >
              <RecentActivity activities={recentActivities} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface Activity {
  id: string;
  type: 'completed' | 'created' | 'updated' | 'deleted';
  taskTitle: string;
  timestamp: Date;
  userId: string;
}