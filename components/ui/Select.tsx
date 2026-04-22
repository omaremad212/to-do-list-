'use client';

import { clsx } from 'clsx';
import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
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
          <select
            ref={ref}
            id={id}
            className={clsx(
              'w-full h-12 px-4 pr-10 rounded-xl border-2 bg-[var(--input)] text-[var(--input-foreground)] transition-all duration-200 appearance-none cursor-pointer',
              'focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)]',
              error
                ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500'
                : 'border-[var(--border)] hover:border-[var(--border-hover)] focus:border-[var(--primary)]',
              className
            )}
            style={{
              backgroundColor: 'var(--input)',
              color: 'var(--input-foreground)',
              borderColor: error ? 'var(--destructive)' : undefined,
            }}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted-foreground)]">
            <ChevronDownIcon className="w-5 h-5" />
          </div>
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

Select.displayName = 'Select';

export default Select;