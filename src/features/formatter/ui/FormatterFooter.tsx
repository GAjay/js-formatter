import type { ReactNode } from 'react';
import type { EditorLanguage, Stats, Status } from '../model/types';
import { formatByteSize } from '../lib/json/stats';
import { editorLanguageLabel, isJsonEditorLanguage } from '../utils/editor-language';

interface FormatterFooterProps {
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

function FooterItem({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`formatter-footer-item${className ? ` ${className}` : ''}`}>
      <span className="formatter-footer-item-label">{label}</span>
      <span className="formatter-footer-item-value">{children}</span>
    </div>
  );
}

export function FormatterFooter({
  editorLanguage,
  status,
  hasInput,
  stats,
  inputBytes,
  outputBytes,
  cursorLine,
  cursorColumn,
  onGoToError,
}: FormatterFooterProps) {
  const jsonMode = isJsonEditorLanguage(editorLanguage);

  let statusText = 'Ready';
  let statusClass = '';

  if (hasInput && jsonMode && status) {
    if (status.valid) {
      statusText = 'Valid';
      statusClass = 'formatter-footer-value--ok';
    } else {
      statusText = status.message;
      statusClass = 'formatter-footer-value--err';
    }
  } else if (hasInput && jsonMode) {
    statusText = 'Checking…';
  } else if (hasInput) {
    statusText = editorLanguageLabel(editorLanguage);
  }

  const statusInteractive = Boolean(status && !status.valid && jsonMode);

  return (
    <div className="formatter-studio-footer">
      <FooterItem label="Status">
        <span
          className={statusClass}
          role={statusInteractive ? 'button' : undefined}
          tabIndex={statusInteractive ? 0 : undefined}
          onClick={statusInteractive ? onGoToError : undefined}
          onKeyDown={(e) => {
            if (statusInteractive && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onGoToError?.();
            }
          }}
          title={statusInteractive ? 'Go to error in input' : undefined}
        >
          {statusText}
        </span>
      </FooterItem>

      {jsonMode && stats && hasInput && (
        <>
          <FooterItem label="Type">{stats.rootType}</FooterItem>
          <FooterItem label="Keys">{stats.keys.toLocaleString()}</FooterItem>
          <FooterItem label="Depth">{stats.depth}</FooterItem>
        </>
      )}

      {hasInput && inputBytes > 0 && <FooterItem label="Input">{formatByteSize(inputBytes)}</FooterItem>}
      {outputBytes > 0 && <FooterItem label="Output">{formatByteSize(outputBytes)}</FooterItem>}

      <span className="formatter-studio-spacer" />

      <FooterItem label="Cursor" className="formatter-footer-item--mono">
        Ln {cursorLine}, Col {cursorColumn}
      </FooterItem>
    </div>
  );
}
