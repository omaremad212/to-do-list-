'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui';

const DynamicNavbar = dynamic(() => Promise.resolve(Navbar), { ssr: false });

function SettingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { themeMode, setThemeMode, appearance, updateAppearance } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'danger', label: 'Danger Zone', icon: TrashIcon },
  ];

  const [notifications, setNotifications] = useState({
    emailTaskReminders: true,
    emailWeeklyDigest: true,
    pushNotifications: true,
    taskDueAlerts: true,
  });

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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="pt-[var(--navbar-height)]">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                Settings
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Manage your account and preferences
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <nav className="lg:w-64 flex-shrink-0">
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap transition-all',
                          isActive
                            ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              <div className="flex-1 space-y-6">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                      <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                        Profile Information
                      </h2>
                      
                      <div className="flex items-center gap-6 mb-6">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || ''}
                            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[var(--border)]"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-white">
                              {session.user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <Button variant="secondary" size="sm">
                            Change Photo
                          </Button>
                          <p className="text-xs text-[var(--muted-foreground)] mt-2">
                            JPG, GIF or PNG. Max 2MB.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue={session.user?.name || ''}
                            className="w-full h-12 px-4 rounded-xl border-2 border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={session.user?.email || ''}
                            disabled
                            className="w-full h-12 px-4 rounded-xl border-2 border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button>Save Changes</Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                      <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                        Notification Preferences
                      </h2>
                      
                      <div className="space-y-4">
                        {[
                          {
                            key: 'emailTaskReminders',
                            label: 'Task Reminders',
                            description: 'Get email reminders for upcoming tasks',
                          },
                          {
                            key: 'emailWeeklyDigest',
                            label: 'Weekly Digest',
                            description: 'Receive a weekly summary of your progress',
                          },
                          {
                            key: 'pushNotifications',
                            label: 'Push Notifications',
                            description: 'Enable browser push notifications',
                          },
                          {
                            key: 'taskDueAlerts',
                            label: 'Due Date Alerts',
                            description: 'Get notified when tasks are due',
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]/50"
                          >
                            <div>
                              <p className="font-medium text-[var(--foreground)]">
                                {item.label}
                              </p>
                              <p className="text-sm text-[var(--muted-foreground)]">
                                {item.description}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setNotifications({
                                  ...notifications,
                                  [item.key]:
                                    !notifications[item.key as keyof typeof notifications],
                                })
                              }
                              className={clsx(
                                'w-12 h-7 rounded-full transition-all relative',
                                notifications[item.key as keyof typeof notifications]
                                  ? 'gradient-primary'
                                  : 'bg-[var(--border)]'
                              )}
                            >
                              <div
                                className={clsx(
                                  'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all',
                                  notifications[item.key as keyof typeof notifications]
                                    ? 'left-6'
                                    : 'left-1'
                                )}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                      <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                        Appearance Settings
                      </h2>
                      
                      <div className="space-y-4">
{[
                          {
                            key: 'themeMode',
                            label: 'Theme',
                            options: [
                              { value: 'light', label: 'Light' },
                              { value: 'dark', label: 'Dark' },
                              { value: 'system', label: 'System' },
                            ],
                          },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="p-4 rounded-xl bg-[var(--muted)]/50"
                          >
                            <p className="font-medium text-[var(--foreground)] mb-3">
                              {item.label}
                            </p>
                            <div className="flex gap-2">
                              {item.options?.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => setThemeMode(opt.value as 'light' | 'dark' | 'system')}
                                  className={clsx(
                                    'px-4 py-2 rounded-lg font-medium transition-all',
                                    themeMode === opt.value
                                      ? 'gradient-primary text-white'
                                      : 'bg-[var(--card)] text-[var(--foreground)]'
                                  )}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

{[
                          { key: 'compactMode', label: 'Compact Mode', description: 'Reduce spacing for more content' },
                          { key: 'showAnimations', label: 'Show Animations', description: 'Enable motion effects' },
                        ].map((item) => {
                          const isEnabled = item.key === 'compactMode' ? appearance.compactMode : appearance.showAnimations;
                          return (
                            <div
                              key={item.key}
                              className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]/50"
                            >
                              <div>
                                <span className="font-medium text-[var(--foreground)]">
                                  {item.label}
                                </span>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {item.description}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  updateAppearance({
                                    [item.key]: !isEnabled
                                  })
                                }
                                className={clsx(
                                  'w-12 h-7 rounded-full transition-all relative',
                                  isEnabled
                                    ? 'gradient-primary'
                                    : 'bg-[var(--border)]'
                                )}
                              >
                                <div
                                  className={clsx(
                                    'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all',
                                    isEnabled
                                      ? 'left-6'
                                      : 'left-1'
                                  )}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                      <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                        Security Settings
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-[var(--muted)]/50">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                            <span className="font-medium text-[var(--foreground)]">
                              Password
                            </span>
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)] ml-8">
                            Last changed 30 days ago
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[var(--muted)]/50">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                            <span className="font-medium text-[var(--foreground)]">
                              Two-Factor Authentication
                            </span>
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)] ml-8">
                            Add extra security to your account
                          </p>
                        </div>
                      </div>

                      <Button variant="secondary" className="mt-4">
                        Change Password
                      </Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'danger' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                      <h2 className="text-lg font-semibold text-red-500 mb-2">
                        Danger Zone
                      </h2>
                      <p className="text-sm text-[var(--muted-foreground)] mb-6">
                        These actions are irreversible. Please proceed with
                        caution.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10">
                          <div>
                            <p className="font-medium text-[var(--foreground)]">
                              Delete All Tasks
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              Permanently delete all your tasks
                            </p>
                          </div>
                          <Button variant="danger" size="sm">
                            Delete All
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10">
                          <div>
                            <p className="font-medium text-[var(--foreground)]">
                              Delete Account
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              Permanently delete your account and data
                            </p>
                          </div>
                          <Button variant="danger" size="sm">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}