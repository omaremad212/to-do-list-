'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    themeMode: 'system',
    compactMode: false,
    showAnimations: true,
  });

  useEffect(() => {
    setMounted(true);
    
    // Load appearance settings from localStorage
    const stored = localStorage.getItem('taskflow-appearance');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAppearance(parsed);
    }
    
    // Load theme
    const storedTheme = localStorage.getItem('taskflow-theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.add(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('taskflow-theme', newTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (mode: ThemeMode) => {
    const newAppearance = { ...appearance, themeMode: mode };
    setAppearance(newAppearance);
    localStorage.setItem('taskflow-appearance', JSON.stringify(newAppearance));
    
    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemDark ? 'dark' : 'light');
    } else {
      applyTheme(mode);
    }
  };

  const updateAppearance = (settings: Partial<AppearanceSettings>) => {
    const newAppearance = { ...appearance, ...settings };
    setAppearance(newAppearance);
    localStorage.setItem('taskflow-appearance', JSON.stringify(newAppearance));
  };

  if (!mounted) {
    return <>{children}</>;
  }

  // Listen for system theme changes
  useEffect(() => {
    if (appearance.themeMode !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [appearance.themeMode]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeMode: appearance.themeMode,
      toggleTheme, 
      setThemeMode,
      appearance,
      updateAppearance
    }}>
      <div 
        data-compact={appearance.compactMode} 
        data-animations={appearance.showAnimations}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}