'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar, Sidebar } from '@/components/layout';
import { TaskList, TaskFilters } from '@/components/tasks';
import { useTasks } from '@/hooks/useTasks';
import { TaskFilter, TaskFormData, Task, TaskPriority } from '@/types';
import { MagnifyingGlassIcon, BoltIcon } from '@heroicons/react/24/outline';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    tasks,
    loading,
    filter,
    setFilter,
    search,
    setSearch,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    stats,
    isDemo,
  } = useTasks();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleAddClick = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleFormSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await updateTask({
        ...editingTask,
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });
    } else {
      await addTask(data);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteTask(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <div className="flex">
        <Sidebar filter={filter} onFilterChange={setFilter} stats={stats} />

        <main className="flex-1 pt-[var(--navbar-height)] lg:ml-[var(--sidebar-width)]">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
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
                      Demo Mode - You are exploring with sample data
                    </span>
                  </motion.div>
                )}

                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                      Tasks
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] transition-all"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key="task-filters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.05 }}
              >
                <TaskFilters
                  filter={filter}
                  onFilterChange={setFilter}
                  onAddClick={handleAddClick}
                />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key="task-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TaskList
                  tasks={tasks}
                  loading={loading}
                  filter={filter}
                  search={search}
                  onToggleComplete={toggleComplete}
                  onUpdateTask={handleEdit}
                  onDeleteTask={handleDelete}
                  onAddTask={handleFormSubmit}
                />
              </motion.div>
            </AnimatePresence>

            {isFormOpen && (
              <TaskFormModal
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                initialData={editingTask}
              />
            )}

            <AnimatePresence>
              {deleteConfirm && (
                <Modal
                  isOpen={!!deleteConfirm}
                  onClose={() => setDeleteConfirm(null)}
                  title="Delete Task"
                  size="sm"
                >
                  <p className="text-[var(--muted-foreground)] mb-6">
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
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task | null;
}) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        priority: initialData.priority,
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task' : 'Add New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          required
        />

        <Textarea
          label="Description (optional)"
          id="description"
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add more details..."
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            id="priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as TaskPriority,
              })
            }
            options={priorityOptions}
          />

          <Input
            label="Due Date"
            id="dueDate"
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}