'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { Task, TaskFilter, TaskFormData } from '@/types';

export function useTasks() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [search, setSearch] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const tasksRef = collection(db, 'users', session.user.email, 'tasks');
      const q = query(tasksRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const fetchedTasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      })) as Task[];

      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (data: TaskFormData) => {
    if (!session?.user?.email) return;

    const taskRef = doc(collection(db, 'users', session.user.email, 'tasks'));
    const newTask = {
      id: taskRef.id,
      title: data.title,
      description: data.description || '',
      completed: false,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: session.user.email,
    };

    await setDoc(taskRef, newTask);
    await fetchTasks();
  };

  const updateTask = async (task: Task) => {
    if (!session?.user?.email) return;

    const taskRef = doc(db, 'users', session.user.email, 'tasks', task.id);
    await setDoc(taskRef, { ...task, updatedAt: new Date() }, { merge: true });
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    if (!session?.user?.email) return;

    const taskRef = doc(db, 'users', session.user.email, 'tasks', id);
    await deleteDoc(taskRef);
    await fetchTasks();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    if (!session?.user?.email) return;

    const taskRef = doc(db, 'users', session.user.email, 'tasks', id);
    await setDoc(taskRef, { completed, updatedAt: new Date() }, { merge: true });
    await fetchTasks();
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
  };
}