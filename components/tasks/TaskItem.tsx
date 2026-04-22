'use client';

import { Task } from '@/types';
import { Checkbox, PriorityBadge } from '@/components/ui';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !task.completed;

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'group relative p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] transition-all duration-200',
        'hover:shadow-lg hover:border-[var(--primary)]/30',
        task.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.completed}
          onChange={(checked) => onToggleComplete(task.id, checked)}
        />

        <div className="flex-1 min-w-0">
          <motion.h3
            layout
            className={clsx(
              'font-semibold text-[var(--foreground)]',
              task.completed && 'line-through text-[var(--muted-foreground)]'
            )}
          >
            {task.title}
          </motion.h3>

          {task.description && (
            <p
              className={clsx(
                'mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2',
                task.completed && 'line-through'
              )}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            <PriorityBadge priority={task.priority} />

            {dueDate && (
              <div
                className={clsx(
                  'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-[var(--muted)] transition-colors',
                  isOverdue
                    ? 'text-red-500 bg-red-500/10'
                    : 'text-[var(--muted-foreground)]'
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatDueDate(dueDate)}
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
          >
            <PencilIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <TrashIcon className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}