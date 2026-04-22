'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layout';
import { TaskList, TaskFilters } from '@/components/tasks';
import { useTasks } from '@/hooks/useTasks';
import { TaskFilter, TaskFormData, Task, TaskPriority } from '@/types';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';

export default function DashboardPage() {
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <div className="flex">
        <Sidebar filter={filter} onFilterChange={setFilter} stats={stats} />

        <main className="flex-1 pt-16 lg:ml-64">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
              {isDemo && (
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg mb-4">
                  <SparklesIcon className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm text-indigo-700 dark:text-indigo-300">
                    Demo Mode - You are exploring with sample data. Feel free to make changes!
                  </span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Tasks
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Manage your to-do list and stay organized
              </p>
            </div>

            <div className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              onAddClick={handleAddClick}
            />

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

            {isFormOpen && (
              <TaskFormModal
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                initialData={editingTask}
              />
            )}

            {deleteConfirm && (
              <DeleteConfirmModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
              />
            )}
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
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Task' : 'Add New Task'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add more details..."
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            id="priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as TaskPriority })
            }
            options={priorityOptions}
          />

          <Input
            label="Due Date"
            id="dueDate"
            type="date"
            value={formData.dueDate || ''}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? 'Save Changes' : 'Add Task'}</Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task" size="sm">
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Are you sure you want to delete this task? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}