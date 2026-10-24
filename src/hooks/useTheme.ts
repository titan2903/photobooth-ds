import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'photobooth-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
  }, [theme]);

  return { theme, toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark') };
}
