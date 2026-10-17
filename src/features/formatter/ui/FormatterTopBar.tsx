import { Dropdown, ThemeSwitch, Typography } from '@/shared/asriui';
import { useAppTheme } from '@/shared/providers';
import { INDENT_OPTIONS, LANGUAGE_OPTIONS, THEME_OPTIONS } from '../constants';
import type { EditorLanguage, EditorSettings, IndentSize, EditorTheme, JsonTab } from '../model/types';
import { DocumentTabs } from './DocumentTabs';

export interface FormatterTopBarProps {
  tabs: JsonTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onAddTab: () => void;
  settings: EditorSettings;
  onLanguageChange: (v: EditorLanguage) => void;
  onIndentChange: (v: IndentSize) => void;
  onThemeChange: (v: EditorTheme) => void;
}

export function FormatterTopBar({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onAddTab,
  settings,
  onLanguageChange,
  onIndentChange,
  onThemeChange,
}: FormatterTopBarProps) {
  const { resolvedTheme, setTheme } = useAppTheme();

  return (
    <header className="formatter-top-bar">
      <div className="formatter-top-brand">
        <Typography variant="h4" as="div" className="formatter-studio-title">
          <span className="formatter-studio-logo" aria-hidden>
            {'{}'}
          </span>
          JSON Formatter
        </Typography>
      </div>

      <div className="formatter-top-tabs">
        <DocumentTabs
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={onSelectTab}
          onCloseTab={onCloseTab}
          onAddTab={onAddTab}
        />
      </div>

      <div className="formatter-top-settings">
        <Dropdown
          aria-label="Editor language"
          size="sm"
          className="formatter-top-dropdown"
          value={settings.language}
          onValueChange={(v: string | string[]) => {
            const raw = Array.isArray(v) ? v[0] : v;
            onLanguageChange(raw as EditorLanguage);
          }}
          options={LANGUAGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
        <Dropdown
          aria-label="Indent size"
          size="sm"
          className="formatter-top-dropdown"
          value={String(settings.indent)}
          onValueChange={(v: string | string[]) => {
            const raw = Array.isArray(v) ? v[0] : v;
            const num = Number(raw);
            onIndentChange((Number.isNaN(num) ? raw : num) as IndentSize);
          }}
          options={INDENT_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))}
        />
        <Dropdown
          aria-label="Editor theme"
          size="sm"
          className="formatter-top-dropdown"
          value={settings.theme}
          onValueChange={(v: string | string[]) => {
            const raw = Array.isArray(v) ? v[0] : v;
            onThemeChange(raw as EditorTheme);
          }}
          options={THEME_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
        <ThemeSwitch
          theme={resolvedTheme}
          onThemeChange={(mode: 'light' | 'dark') => setTheme(mode)}
          size="md"
        />
      </div>
    </header>
  );
}
