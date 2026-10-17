import { ThemeSwitch, Typography } from '@/shared/asriui';
import { useAppTheme } from '@/shared/providers';

export function FormatterHeader() {
  const { resolvedTheme, setTheme } = useAppTheme();

  return (
    <header className="formatter-studio-header formatter-studio-chrome">
      <div className="formatter-brand">
        <Typography variant="h4" as="h1" className="formatter-studio-title">
          <span className="formatter-studio-logo" aria-hidden>
            {'{}'}
          </span>
          JSON Formatter
        </Typography>
        <p className="formatter-studio-tagline">Paste · Format · Validate · Repair</p>
      </div>

      <span className="formatter-studio-spacer" />

      <ThemeSwitch
        theme={resolvedTheme}
        onThemeChange={(mode: 'light' | 'dark') => setTheme(mode)}
        size="md"
      />
    </header>
  );
}
