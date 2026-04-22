'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useSession } from 'next-auth/react';
import { Task, TaskFilter, TaskFormData } from '@/types';

const DEMO_TASKS: Task[] = [
  {
    id: 'demo-1',
    title: '完成产品需求文档 PRD',
    description: '撰写新功能的产品需求文档，包括用户故事和功能规格说明。需要包含详细的用例描述和验收标准。',
    completed: false,
    priority: 'high',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-2',
    title: '审核 UI 设计稿',
    description: '检查新界面的设计稿，确保符合设计规范和用户体验最佳实践。与设计团队确认颜色和间距。',
    completed: true,
    priority: 'high',
    dueDate: new Date(Date.now() - 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-3',
    title: '团队周会演示准备',
    description: '准备本周的工作进展演示，包含关键指标和下阶段计划。准备好 PPT 和数据图表。',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-4',
    title: '代码审查 PR #42',
    description: 'Review 新功能的 Pull Request，确保代码质量和测试覆盖。检查单元测试和集成测试。',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 172800000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-5',
    title: '更新技术文档',
    description: '更新 API 文档和开发者指南，反映最新的变更。包括新的端点和参数说明。',
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 432000000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-6',
    title: '优化数据库查询性能',
    description: '分析并优化慢查询，提升页面加载速度。添加必要的索引和缓存策略。',
    completed: true,
    priority: 'medium',
    dueDate: new Date(Date.now() - 172800000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-7',
    title: '集成第三方支付API',
    description: '集成 Stripe 支付网关，支持信用卡和 PayPal。处理 webhooks 回调。',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 259200000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-8',
    title: '用户反馈分析',
    description: '分析最近一周的用户反馈，提炼改进建议。准备用户体验改进报告。',
    completed: true,
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-9',
    title: '安全漏洞修复',
    description: '修复发现的 XSS 漏洞，确保用户数据安全。更新安全头和输入验证。',
    completed: true,
    priority: 'high',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-10',
    title: '移动端响应式适配',
    description: '确保应用在手机和平板上有良好的用户体验。测试各种屏幕尺寸。',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 345600000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-11',
    title: '设置 CI/CD 流水线',
    description: '配置 GitHub Actions 实现自动化测试和部署。设置环境变量和密钥。',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 432000000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-12',
    title: '性能监控仪表板',
    description: '创建实时性能监控仪表板，跟踪关键指标。集成 Sentry 和数据分析。',
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 604800000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-13',
    title: '用户访谈准备',
    description: '准备下周用户访谈的问题和议程。联系 5 位活跃用户。',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 216000000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-14',
    title: 'A/B 测试设计',
    description: '设计新首页的 A/B 测试方案。确定测试目标和成功指标。',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 518400000),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'demo@taskflow.app',
  },
  {
    id: 'demo-15',
    title: '月度报告生成',
    description: '生成上月的运营报告，包括用户增长、留存和收入数据。',
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

  const isDemo = (session?.user as any)?.isDemo;

  const fetchTasks = useCallback(async () => {
    if (isDemo) {
      setTasks(DEMO_TASKS);
      setLoading(false);
      return;
    }

    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { db } = await import('@/lib/firebase');
      const { collection, query, getDocs, orderBy } = await import('firebase/firestore');
      
      const tasksRef = collection(db, 'users', session.user.email, 'tasks');
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
  }, [session?.user?.email, isDemo]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

    if (!session?.user?.email) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc, collection } = await import('firebase/firestore');
      
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
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (task: Task) => {
    if (isDemo) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      return;
    }

    if (!session?.user?.email) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      
      const taskRef = doc(db, 'users', session.user.email, 'tasks', task.id);
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

    if (!session?.user?.email) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { doc, deleteDoc } = await import('firebase/firestore');
      
      const taskRef = doc(db, 'users', session.user.email, 'tasks', id);
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

    if (!session?.user?.email) return;

    try {
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      
      const taskRef = doc(db, 'users', session.user.email, 'tasks', id);
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