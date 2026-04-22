'use client';

import { clsx } from 'clsx';
import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            'w-full min-h-[120px] px-4 py-3 rounded-xl border-2 bg-[var(--input)] text-[var(--input-foreground)] transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)]',
            'placeholder:text-[var(--muted-foreground)]',
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
        />
        {error && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;