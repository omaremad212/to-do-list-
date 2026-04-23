'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'system';

interface AppearanceSettings {
  themeMode: ThemeMode;
  compactMode: boolean;
  showAnimations: boolean;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  appearance: AppearanceSettings;
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
  mounted: boolean;
}

const defaultAppearance: AppearanceSettings = {
  themeMode: 'system',
  compactMode: false,
  showAnimations: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
}

function applySettingsToDocument(compactMode: boolean, showAnimations: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-compact', compactMode ? 'true' : 'false');
    document.documentElement.setAttribute('data-animations', showAnimations ? 'true' : 'false');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultAppearance);

  const resolveTheme = useCallback((mode: ThemeMode): Theme => {
    if (mode === 'system') {
      return getSystemTheme();
    }
    return mode;
  }, []);

  useEffect(() => {
    setMounted(true);

    const storedAppearance = localStorage.getItem('taskflow-appearance');
    if (storedAppearance) {
      try {
        const parsed = JSON.parse(storedAppearance) as AppearanceSettings;
        setAppearance(parsed);
        const resolvedTheme = resolveTheme(parsed.themeMode);
        setTheme(resolvedTheme);
        applyThemeToDocument(resolvedTheme);
        applySettingsToDocument(parsed.compactMode, parsed.showAnimations);
      } catch (e) {
        console.error('Failed to parse appearance settings', e);
        const resolvedTheme = resolveTheme('system');
        setTheme(resolvedTheme);
        applyThemeToDocument(resolvedTheme);
        applySettingsToDocument(false, true);
      }
    } else {
      const resolvedTheme = resolveTheme('system');
      setTheme(resolvedTheme);
      applyThemeToDocument(resolvedTheme);
      applySettingsToDocument(false, true);
    }
  }, [resolveTheme]);

  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (appearance.themeMode === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyThemeToDocument(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, appearance.themeMode]);

  const applyTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    applyThemeToDocument(newTheme);
    localStorage.setItem('taskflow-theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    const newAppearance: AppearanceSettings = { ...appearance, themeMode: newTheme };
    setAppearance(newAppearance);
    applyTheme(newTheme);
    localStorage.setItem('taskflow-appearance', JSON.stringify(newAppearance));
  }, [theme, appearance, applyTheme]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    const newAppearance = { ...appearance, themeMode: mode };
    setAppearance(newAppearance);
    localStorage.setItem('taskflow-appearance', JSON.stringify(newAppearance));
    
    const newTheme = resolveTheme(mode);
    applyTheme(newTheme);
    applySettingsToDocument(newAppearance.compactMode, newAppearance.showAnimations);
  }, [appearance, resolveTheme, applyTheme]);

  const updateAppearance = useCallback((settings: Partial<AppearanceSettings>) => {
    const newAppearance = { ...appearance, ...settings };
    setAppearance(newAppearance);
    localStorage.setItem('taskflow-appearance', JSON.stringify(newAppearance));
    applySettingsToDocument(newAppearance.compactMode, newAppearance.showAnimations);
  }, [appearance]);

  const contextValue: ThemeContextType = {
    theme,
    themeMode: appearance.themeMode,
    toggleTheme,
    setThemeMode,
    appearance,
    updateAppearance,
    mounted,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      themeMode: 'system',
      toggleTheme: () => {},
      setThemeMode: () => {},
      appearance: defaultAppearance,
      updateAppearance: () => {},
      mounted: false,
    };
  }
  return context;
}