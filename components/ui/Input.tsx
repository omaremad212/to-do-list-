'use client';

import { clsx } from 'clsx';
import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-[var(--foreground)] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              {icon}
            </div>
          )}
          <motion.input
            ref={ref}
            id={id}
            whileFocus={{ scale: 1.01 }}
            className={clsx(
              'w-full h-12 px-4 rounded-xl border-2 bg-[var(--input)] text-[var(--input-foreground)] transition-all duration-200',
              'focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)]',
              'placeholder:text-[var(--muted-foreground)]',
              icon && 'pl-11',
              error
                ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500'
                : 'border-[var(--border)] hover:border-[var(--border-hover)]',
              className
            )}
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--input-foreground)',
              borderColor: error ? 'var(--destructive)' : 'var(--border)',
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;