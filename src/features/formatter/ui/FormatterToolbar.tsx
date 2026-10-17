import type { ReactNode } from 'react';
import { Dropdown, Icon, Switch } from '@/shared/asriui';
import { INDENT_OPTIONS, LANGUAGE_OPTIONS, THEME_OPTIONS } from '../constants';
import type { EditorLanguage, EditorSettings, IndentSize, EditorTheme, ProcessingState } from '../model/types';
import { IconToolButton } from './IconToolButton';

export type FormatterActionToolbarProps = {
  variant?: 'inline' | 'floating';
  processing: ProcessingState;
  ready: boolean;
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onRepair: () => void;
  onSortKeys: () => void;
  onEscape: () => void;
  onUnescape: () => void;
};

export type FormatterToolbarProps = FormatterActionToolbarProps &
  (
    | {
        showSettings?: true;
        settings: EditorSettings;
        onIndentChange: (v: IndentSize) => void;
        onThemeChange: (v: EditorTheme) => void;
        onLanguageChange: (v: EditorLanguage) => void;
        onLineNumbersChange: (v: boolean) => void;
        onWrapTextChange: (v: boolean) => void;
        onSortKeysChange: (v: boolean) => void;
      }
    | {
        showSettings: false;
      }
  );

function ToolbarGroup({
  label,
  children,
  hideLabel,
  className,
}: {
  label: string;
  children: ReactNode;
  hideLabel?: boolean;
  className?: string;
}) {
  return (
    <div className={`formatter-toolbar-group${className ? ` ${className}` : ''}`} role="group" aria-label={label}>
      {!hideLabel && <span className="formatter-toolbar-group-label">{label}</span>}
      <div className="formatter-toolbar-group-body">{children}</div>
    </div>
  );
}

function SettingField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="formatter-setting-field">
      <span className="formatter-setting-label">{label}</span>
      {children}
    </div>
  );
}

type FormatterToolbarWithSettings = Exclude<FormatterToolbarProps, { showSettings: false }>;

function toolbarHasSettings(props: FormatterToolbarProps): props is FormatterToolbarWithSettings {
  return props.showSettings !== false;
}

function EditorSettingsGroup(props: FormatterToolbarWithSettings & { hideLabel?: boolean }) {
  const { settings, hideLabel } = props;
  return (
    <ToolbarGroup label="Editor" hideLabel={hideLabel}>
      <SettingField label="Language">
        <Dropdown
          aria-label="Editor language"
          size="sm"
          value={settings.language}
          onValueChange={(v: string | string[]) => {
            const raw = Array.isArray(v) ? v[0] : v;
            props.onLanguageChange(raw as EditorLanguage);
          }}
          options={LANGUAGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </SettingField>
      <SettingField label="Indent">
        <Dropdown
          aria-label="Indent size"
          size="sm"
          value={String(settings.indent)}
          onValueChange={(v: string | string[]) => {
            const raw = Array.isArray(v) ? v[0] : v;
            const num = Number(raw);
            props.onIndentChange((Number.isNaN(num) ? raw : num) as IndentSize);
          }}
          options={INDENT_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))}
        />
      </SettingField>
      <SettingField label="Theme">
        <Dropdown
          aria-label="Editor theme"
          size="sm"
          value={settings.theme}
          onValueChange={(v: string | string[]) => {
            const raw = Array.isArray(v) ? v[0] : v;
            props.onThemeChange(raw as EditorTheme);
          }}
          options={THEME_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </SettingField>
      <SettingField label="Sort on format">
        <Switch
          aria-label="Sort keys when formatting"
          checked={settings.sortKeysOnFormat}
          onCheckedChange={props.onSortKeysChange}
        />
      </SettingField>
      <SettingField label="Line numbers">
        <Switch
          aria-label="Line numbers"
          checked={settings.showLineNumbers}
          onCheckedChange={props.onLineNumbersChange}
        />
      </SettingField>
      <SettingField label="Wrap">
        <Switch aria-label="Wrap lines" checked={settings.wrapText} onCheckedChange={props.onWrapTextChange} />
      </SettingField>
    </ToolbarGroup>
  );
}

export function FormatterToolbar(props: FormatterToolbarProps) {
  const busy = props.processing !== 'idle';
  const is = (state: ProcessingState) => props.processing === state;
  const floating = props.variant === 'floating';
  const barClass = floating
    ? 'formatter-bar formatter-bar--floating'
    : 'formatter-bar formatter-studio-chrome';
  const toolAppearance = floating ? 'float' : 'toolbar';

  return (
    <div className={barClass} role="toolbar" aria-label="Formatter tools">
      <ToolbarGroup label="Transform" hideLabel={floating} className={floating ? 'formatter-toolbar-group--float' : undefined}>
        <IconToolButton
          label="Format JSON"
          variant="primary"
          appearance={toolAppearance}
          onClick={props.onFormat}
          disabled={!props.ready || busy}
          loading={is('formatting')}
        >
          <Icon name="sparkles" size="sm" aria-hidden />
        </IconToolButton>
        <IconToolButton
          label="Minify"
          appearance={toolAppearance}
          onClick={props.onMinify}
          disabled={!props.ready || busy}
          loading={is('minifying')}
        >
          <Icon name="type" size="sm" aria-hidden />
        </IconToolButton>
        <IconToolButton
          label="Sort keys"
          appearance={toolAppearance}
          onClick={props.onSortKeys}
          disabled={!props.ready || busy}
          loading={is('sorting')}
        >
          <Icon name="grid" size="sm" aria-hidden />
        </IconToolButton>
        <IconToolButton
          label="Validate"
          appearance={toolAppearance}
          onClick={props.onValidate}
          disabled={!props.ready || busy}
          loading={is('validating')}
        >
          <Icon name="check" size="sm" aria-hidden />
        </IconToolButton>
        <IconToolButton
          label="Repair JSON"
          appearance={toolAppearance}
          onClick={props.onRepair}
          disabled={!props.ready || busy}
          loading={is('repairing')}
        >
          <Icon name="puzzle" size="sm" aria-hidden />
        </IconToolButton>
      </ToolbarGroup>

      {floating ? <span className="formatter-floating-toolbar-sep" aria-hidden /> : null}

      <ToolbarGroup label="Strings" hideLabel={floating} className={floating ? 'formatter-toolbar-group--float' : undefined}>
        <IconToolButton
          label="Escape string"
          appearance={toolAppearance}
          onClick={props.onEscape}
          disabled={!props.ready || busy}
          loading={is('escaping')}
        >
          <Icon name="code" size="sm" aria-hidden />
        </IconToolButton>
        <IconToolButton
          label="Unescape string"
          appearance={toolAppearance}
          onClick={props.onUnescape}
          disabled={!props.ready || busy}
          loading={is('unescaping')}
        >
          <Icon name="form" size="sm" aria-hidden />
        </IconToolButton>
      </ToolbarGroup>

      {toolbarHasSettings(props) && <EditorSettingsGroup {...props} hideLabel={floating} />}
    </div>
  );
}
