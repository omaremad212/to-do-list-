'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  className,
}: CheckboxProps) {
  return (
    <label className={clsx('inline-flex items-center gap-3 cursor-pointer group', className)}>
      <motion.div
        className="relative"
        whileTap={{ scale: 0.9 }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={clsx(
            'w-6 h-6 border-2 rounded-xl transition-all duration-200 flex items-center justify-center',
            'peer-focus:ring-4 peer-focus:ring-[var(--primary)]/20',
            checked
              ? 'gradient-primary border-transparent shadow-lg shadow-[var(--primary)]/25'
              : 'border-[var(--border)] group-hover:border-[var(--border-hover)] bg-[var(--card)]'
          )}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.3 }}
            >
              <CheckIcon className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>
      </motion.div>
      {label && (
        <span className="text-sm font-medium text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}