'use client';

import { clsx } from 'clsx';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export default function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <label className={clsx('inline-flex items-center gap-2 cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={clsx(
            'w-5 h-5 border-2 rounded-md transition-all duration-200',
            'peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2',
            checked
              ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
              : 'bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-600'
          )}
        >
          {checked && (
            <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>}
    </label>
  );
}