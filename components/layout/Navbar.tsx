'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment, useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tasks', href: '/dashboard', icon: ClipboardDocumentListIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-[var(--navbar-height)] glass border-b border-[var(--border)] shadow-[var(--shadow-sm)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[var(--foreground)] hidden sm:block">
                TaskFlow
              </span>
            </Link>

            {status === 'authenticated' && (
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        'relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                        isActive
                          ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-[var(--primary)]/10 rounded-xl"
                          initial={false}
                          transition={{ type: 'spring', duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-all duration-200 group"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                <AnimatePresence mode="wait">
                  {theme === 'light' ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <MoonIcon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <SunIcon className="w-5 h-5 text-amber-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>

            {status === 'authenticated' ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={clsx(
                    'flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200',
                    userMenuOpen
                      ? 'bg-[var(--accent)] ring-2 ring-[var(--primary)]/20'
                      : 'hover:bg-[var(--accent)]'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-[var(--border)]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
                      <span className="text-sm font-semibold text-white">
                        {session.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-64 origin-top-right"
                    >
                      <div className="bg-[var(--card)] rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden">
                        <div className="px-4 py-4 bg-gradient-to-br from-[var(--primary)]/5 to-transparent border-b border-[var(--border)]">
                          <div className="flex items-center gap-3">
                            {session.user?.image ? (
                              <img
                                src={session.user.image}
                                alt={session.user.name || ''}
                                className="w-10 h-10 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                                <span className="text-base font-bold text-white">
                                  {session.user?.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                                {session.user?.name}
                              </p>
                              <p className="text-xs text-[var(--muted-foreground)] truncate">
                                {session.user?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setUserMenuOpen(false)}
                                className={clsx(
                                  'flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150',
                                  isActive
                                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'
                                )}
                              >
                                <Icon className="w-4 h-4" />
                                {item.name}
                                {isActive && (
                                  <CheckIcon className="w-4 h-4 ml-auto" />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                        <div className="p-2 border-t border-[var(--border)]">
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-150"
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-semibold text-white gradient-primary rounded-xl hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-200"
              >
                Sign in
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-all duration-200"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative w-full max-w-xs bg-[var(--card)]">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="font-bold text-lg text-[var(--foreground)]">TaskFlow</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-all"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={clsx(
                          'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150',
                          isActive
                            ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </nav>
  );
}