'use client';

import { clsx } from 'clsx';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
          {
            'gradient-primary text-white hover:shadow-lg hover:shadow-[var(--primary)]/25 focus:ring-[var(--primary)]':
              variant === 'primary',
            'bg-[var(--card)] text-[var(--foreground)] border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] focus:ring-[var(--primary)]':
              variant === 'secondary',
            'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] focus:ring-[var(--primary)]':
              variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500':
              variant === 'danger',
            'px-3 py-2 text-xs gap-1.5': size === 'sm',
            'px-5 py-2.5 text-sm gap-2': size === 'md',
            'px-6 py-3 text-base gap-2': size === 'lg',
          },
          className
        )}
        {...props}
      >
        <motion.span
          className="relative z-10 flex items-center gap-2"
          whileHover={disabled || loading ? {} : { scale: 1 }}
          whileTap={disabled || loading ? {} : { scale: 0.98 }}
        >
          {loading && (
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {children}
        </motion.span>
        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;