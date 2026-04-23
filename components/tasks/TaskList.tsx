'use client';

import { Task, TaskFilter, TaskFormData } from '@/types';
import { TaskItem, TaskForm } from '@/components/tasks';
import { TaskSkeleton, EmptyState, Modal, Button } from '@/components/ui';
import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  filter: TaskFilter;
  search: string;
  onToggleComplete: (id: string, completed: boolean) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (data: TaskFormData) => void;
}

export default function TaskList({
  tasks,
  loading,
  filter,
  search,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'pending' && !task.completed);

      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteTask(deleteConfirm);
      toast.success('Task deleted');
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      onUpdateTask({ ...editingTask, ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined });
      toast.success('Task updated');
    } else {
      onAddTask(data);
      toast.success('Task added');
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <>
        <EmptyState
          title={search ? 'No tasks found' : 'No tasks yet'}
          description={
            search
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first task to get organized'
          }
          action={
            !search
              ? {
                  label: 'Add Task',
                  onClick: () => setIsFormOpen(true),
                }
              : undefined
          }
        />
        <TaskForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          initialData={editingTask || undefined}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingTask || undefined}
      />

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Task"
        size="sm"
      >
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}