import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AsriUIProvider, type ThemeMode } from 'asriui/config';
import { ToastProvider } from '@/shared/asriui';
import {
  AppThemeContext,
  readStoredTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
} from './theme-context';

export function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(readStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => resolveTheme(readStoredTheme()));

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.dataset.theme = resolved;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (theme === 'system') {
        const next = resolveTheme('system');
        setResolvedTheme(next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        document.documentElement.dataset.theme = next;
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const config = useMemo(
    () => ({
      theme,
      fontFamily: '"Work Sans", ui-sans-serif, system-ui, sans-serif',
    }),
    [theme]
  );
  const themeValue = useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, resolvedTheme]
  );

  return (
    <AsriUIProvider config={config}>
      <ToastProvider position="bottom-right" duration={2800} limit={2} showProgress={false}>
        <AppThemeContext.Provider value={themeValue}>{children}</AppThemeContext.Provider>
      </ToastProvider>
    </AsriUIProvider>
  );
}
