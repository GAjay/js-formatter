import { Settings } from 'lucide-react';
import Card from '../ui/Card';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import Label from '../ui/Label';
import { INDENT_OPTIONS, THEME_OPTIONS } from '../../constants';
import type { IndentSize, EditorTheme, EditorSettings, UITheme } from '../../types';

interface SettingsCardProps {
  settings: EditorSettings;
  onIndentChange: (v: IndentSize) => void;
  onThemeChange: (v: EditorTheme) => void;
  onLineNumbersChange: (v: boolean) => void;
  onWrapTextChange: (v: boolean) => void;
  ui: UITheme;
}

export default function SettingsCard({
  settings,
  onIndentChange,
  onThemeChange,
  onLineNumbersChange,
  onWrapTextChange,
  ui,
}: SettingsCardProps) {
  return (
    <Card title="Settings" icon={<Settings size={14} color={ui.accent} />} ui={ui}>
      <div>
        <Label ui={ui}>Indentation</Label>
        <Select value={settings.indent} options={INDENT_OPTIONS} onChange={onIndentChange} ui={ui} />
      </div>
      <div>
        <Label ui={ui}>Theme</Label>
        <Select value={settings.theme} options={THEME_OPTIONS} onChange={onThemeChange} ui={ui} />
      </div>
      <div style={{ marginTop: '0.25rem' }}>
        <Toggle label="Line Numbers" value={settings.showLineNumbers} onChange={onLineNumbersChange} ui={ui} />
      </div>
      <Toggle label="Wrap Text" value={settings.wrapText} onChange={onWrapTextChange} ui={ui} />
    </Card>
  );
}
