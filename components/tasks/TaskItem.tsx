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

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
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
      className={clsx(
        'group relative p-4 border rounded-lg bg-white dark:bg-slate-800 transition-all',
        'hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700',
        task.completed ? 'opacity-60' : 'border-slate-200 dark:border-slate-700'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onChange={(checked) => onToggleComplete(task.id, checked)}
        />

        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              'font-medium text-slate-900 dark:text-slate-100',
              task.completed && 'line-through text-slate-500 dark:text-slate-400'
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={clsx(
                'mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2',
                task.completed && 'line-through'
              )}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <PriorityBadge priority={task.priority} />

            {dueDate && (
              <div
                className={clsx(
                  'flex items-center gap-1 text-xs',
                  isOverdue
                    ? 'text-red-600 dark:text-red-400 font-medium'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatDueDate(dueDate)}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}