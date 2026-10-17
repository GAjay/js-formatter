import { FormatterBottomSettings } from './FormatterBottomSettings';
import { FormatterFooter } from './FormatterFooter';
import { FormatterToolbar, type FormatterActionToolbarProps } from './FormatterToolbar';
import type { EditorLanguage, EditorSettings, Stats, Status } from '../model/types';

type ActionToolbarProps = FormatterActionToolbarProps;

interface FormatterBottomDockProps extends ActionToolbarProps {
  settings: EditorSettings;
  onLineNumbersChange: (v: boolean) => void;
  onWrapTextChange: (v: boolean) => void;
  onSortKeysChange: (v: boolean) => void;
  editorLanguage: EditorLanguage;
  status: Status | null;
  hasInput: boolean;
  stats: Stats | null;
  inputBytes: number;
  outputBytes: number;
  cursorLine: number;
  cursorColumn: number;
  onGoToError?: () => void;
}

export function FormatterBottomDock(props: FormatterBottomDockProps) {
  const {
    settings,
    onLineNumbersChange,
    onWrapTextChange,
    onSortKeysChange,
    editorLanguage,
    status,
    hasInput,
    stats,
    inputBytes,
    outputBytes,
    cursorLine,
    cursorColumn,
    onGoToError,
    ...toolbarProps
  } = props;

  return (
    <div className="formatter-studio-bottom">
      <nav className="formatter-floating-toolbar" aria-label="Formatter actions">
        <FormatterToolbar {...toolbarProps} variant="floating" showSettings={false} />
      </nav>

      <footer className="formatter-bottom-footer">
        <FormatterBottomSettings
          settings={settings}
          onLineNumbersChange={onLineNumbersChange}
          onWrapTextChange={onWrapTextChange}
          onSortKeysChange={onSortKeysChange}
        />
        <FormatterFooter
          editorLanguage={editorLanguage}
          status={status}
          hasInput={hasInput}
          stats={stats}
          inputBytes={inputBytes}
          outputBytes={outputBytes}
          cursorLine={cursorLine}
          cursorColumn={cursorColumn}
          onGoToError={onGoToError}
        />
      </footer>
    </div>
  );
}
