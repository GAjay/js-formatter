import type { ReactNode } from 'react';
import { Switch } from '@/shared/asriui';
import type { EditorSettings } from '../model/types';

function SwitchField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="formatter-bottom-switch">
      <span className="formatter-bottom-switch-label">{label}</span>
      {children}
    </div>
  );
}

export interface FormatterBottomSettingsProps {
  settings: EditorSettings;
  onLineNumbersChange: (v: boolean) => void;
  onWrapTextChange: (v: boolean) => void;
  onSortKeysChange: (v: boolean) => void;
}

export function FormatterBottomSettings({
  settings,
  onLineNumbersChange,
  onWrapTextChange,
  onSortKeysChange,
}: FormatterBottomSettingsProps) {
  return (
    <div className="formatter-bottom-switches" aria-label="Editor toggles">
      <SwitchField label="Sort keys">
        <Switch
          aria-label="Sort keys when formatting"
          checked={settings.sortKeysOnFormat}
          onCheckedChange={onSortKeysChange}
        />
      </SwitchField>
      <SwitchField label="Line numbers">
        <Switch
          aria-label="Line numbers"
          checked={settings.showLineNumbers}
          onCheckedChange={onLineNumbersChange}
        />
      </SwitchField>
      <SwitchField label="Wrap">
        <Switch aria-label="Wrap lines" checked={settings.wrapText} onCheckedChange={onWrapTextChange} />
      </SwitchField>
    </div>
  );
}
