'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Task, TaskFilter, TaskFormData } from '@/types';

const DEMO_TASKS: Task[] = [
  {
    id: 'demo-1',
    title: 'Complete Product Requirements Document',
    description: 'Write detailed PRD for new feature including user stories and acceptance criteria.',
    completed: false,
    priority: 'high',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-2',
    title: 'Review UI Design Mockups',
    description: 'Check new interface designs for consistency and UX best practices.',
    completed: true,
    priority: 'high',
    dueDate: new Date(Date.now() - 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-3',
    title: 'Team Weekly Meeting Preparation',
    description: 'Prepare presentation with progress metrics and next phase plans.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-4',
    title: 'Code Review PR #42',
    description: 'Review new feature pull request for code quality and test coverage.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 172800000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-5',
    title: 'Update Technical Documentation',
    description: 'Update API docs and developer guides with latest changes.',
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 432000000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-6',
    title: 'Optimize Database Query Performance',
    description: 'Analyze and optimize slow queries to improve page load times.',
    completed: true,
    priority: 'medium',
    dueDate: new Date(Date.now() - 172800000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-7',
    title: 'Integrate Payment Gateway',
    description: 'Integrate Stripe for credit card and PayPal processing.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 259200000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-8',
    title: 'User Feedback Analysis',
    description: 'Analyze recent user feedback and compile improvement suggestions.',
    completed: true,
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-9',
    title: 'Security Vulnerability Fix',
    description: 'Fix XSS vulnerability to ensure user data security.',
    completed: true,
    priority: 'high',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-10',
    title: 'Mobile Responsive Adaptation',
    description: 'Ensure app works well on mobile and tablet devices.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 345600000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-11',
    title: 'Set Up CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 432000000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-12',
    title: 'Performance Monitoring Dashboard',
    description: 'Create real-time monitoring dashboard with key metrics.',
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 604800000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-13',
    title: 'User Interview Preparation',
    description: 'Prepare questions and agenda for user interviews next week.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 216000000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-14',
    title: 'A/B Test Design',
    description: 'Design A/B test for new homepage with clear success metrics.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 518400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-15',
    title: 'Monthly Report Generation',
    description: 'Generate last month operational report with growth and retention data.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
];

export function useTasks() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [search, setSearch] = useState('');

  const isDemo = (session?.user as { isDemo?: boolean })?.isDemo === true;
  const userEmail = session?.user?.email as string | undefined;

  const fetchTasks = useCallback(async () => {
    if (!userEmail || isDemo) return;

    setLoading(true);
    try {
      const { db } = await import('@/lib/firebase');
      const { collection, query, getDocs, orderBy } = await import('firebase/firestore');

      const tasksRef = collection(db, 'users', userEmail, 'tasks');
      const q = query(tasksRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const fetchedTasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
        dueDate: doc.data().dueDate?.toDate?.() || undefined,
      })) as Task[];

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [userEmail, isDemo]);

  useEffect(() => {
    if (isDemo) {
      setTasks(DEMO_TASKS);
      setLoading(false);
    } else if (userEmail) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [isDemo, userEmail, fetchTasks]);

  const addTask = async (data: TaskFormData) => {
    if (isDemo) {
      const newTask: Task = {
        id: `demo-${Date.now()}`,
        title: data.title,
        description: data.description,
        completed: false,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'demo@taskflow.app',
      };
      setTasks([newTask, ...tasks]);
      return;
    }

    if (!userEmail) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc, collection } = await import('firebase/firestore');

      const taskRef = doc(collection(db, 'users', userEmail, 'tasks'));
      const newTask = {
        id: taskRef.id,
        title: data.title,
        description: data.description || '',
        completed: false,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userEmail,
      };

      await setDoc(taskRef, newTask);
      await fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (task: Task) => {
    if (isDemo) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      return;
    }

    if (!userEmail) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      const taskRef = doc(db, 'users', userEmail, 'tasks', task.id);
      await setDoc(taskRef, { ...task, updatedAt: new Date() }, { merge: true });
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (isDemo) {
      setTasks(tasks.filter(t => t.id !== id));
      return;
    }

    if (!userEmail) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { doc, deleteDoc } = await import('firebase/firestore');

      const taskRef = doc(db, 'users', userEmail, 'tasks', id);
      await deleteDoc(taskRef);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    if (isDemo) {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
      return;
    }

    if (!userEmail) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');

      const taskRef = doc(db, 'users', userEmail, 'tasks', id);
      await setDoc(taskRef, { completed, updatedAt: new Date() }, { merge: true });
      await fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return {
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
  };
}