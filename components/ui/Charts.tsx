'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus as MinusIcon,
} from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  secondary?: number;
}

interface LineChartProps {
  data: ChartData[];
  height?: number;
  showGradient?: boolean;
  color?: string;
}

export function LineChart({
  data,
  height = 200,
  showGradient = true,
  color = 'var(--primary)',
}: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return `${x},${y}`;
  });

  const areaPoints = `0,100 ${points.join(' ')} 100,100`;

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {showGradient && (
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        )}
        <polygon
          points={areaPoints}
          fill="url(#areaGradient)"
          className="transition-all duration-500"
        />
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-500"
        />
        {points.map((point, i) => {
          const [x, y] = point.split(',');
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1"
              fill={color}
              className="opacity-0 hover:opacity-100 transition-opacity"
            />
          );
        })}
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: ChartData[];
  height?: number;
  color?: string;
}

export function BarChart({
  data,
  height = 200,
  color = 'var(--primary)',
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const range = maxValue || 1;

  return (
    <div className="w-full flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const barHeight = (d.value / range) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${barHeight}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="w-full rounded-lg"
              style={{
                backgroundColor: color,
                minHeight: '4px',
              }}
            />
            <span className="text-[8px] text-[var(--muted-foreground)] truncate max-w-full">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({
  data,
  size = 120,
  strokeWidth = 12,
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {data.map((d, i) => {
          const percentage = total > 0 ? d.value / total : 0;
          const dashLength = percentage * circumference;
          const dashOffset = currentOffset;
          currentOffset += dashLength;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-dashOffset}
              className="transition-all duration-500"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-[var(--foreground)]">
          {total}
        </span>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  subtitle,
}: StatCardProps) {
  const TrendIcon =
    trend === 'up'
      ? TrendingUpIcon
      : trend === 'down'
        ? TrendingDownIcon
        : MinusIcon;

  const trendColor =
    trend === 'up'
      ? 'text-emerald-500'
      : trend === 'down'
        ? 'text-red-500'
        : 'text-[var(--muted-foreground)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-bl-full" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            {title}
          </span>
          {icon && (
            <div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              {icon}
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-[var(--foreground)] mb-2">
          {value}
        </div>
        {subtitle && (
          <span className="text-xs text-[var(--muted-foreground)]">
            {subtitle}
          </span>
        )}
        {change !== undefined && (
          <div className={clsx('flex items-center gap-1 mt-2', trendColor)}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {change > 0 ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">vs last week</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}