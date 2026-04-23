'use client';

import { useTheme } from '@/components/providers/ThemeProvider';

export function useAnimations() {
  const { appearance } = useTheme();
  return appearance.showAnimations;
}

export function useCompactMode() {
  const { appearance } = useTheme();
  return appearance.compactMode;
}