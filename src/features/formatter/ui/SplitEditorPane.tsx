import { useState, type ReactNode } from 'react';
import { Typography } from '@/shared/asriui';
import type { EditorLanguage, EditorTheme } from '../model/types';
import { IconToolButton } from './IconToolButton';
import { MonacoJsonEditor, type MonacoJsonEditorHandle } from './MonacoJsonEditor';

interface SplitEditorPaneProps {
  pane: 'input' | 'output';
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  editorTheme: EditorTheme;
  language: EditorLanguage;
  lineNumbers: boolean;
  wordWrap: boolean;
  emptyHint?: string;
  meta?: string;
  headerActions?: ReactNode;
  sideActions?: ReactNode;
  editorRef?: React.RefObject<MonacoJsonEditorHandle | null>;
  onCursorPositionChange?: (line: number, column: number) => void;
  onDropFiles?: (files: FileList) => void;
}

export function SplitEditorPane({
  pane,
  title,
  value,
  onChange,
  readOnly,
  editorTheme,
  language,
  lineNumbers,
  wordWrap,
  emptyHint,
  meta,
  headerActions,
  sideActions,
  editorRef,
  onCursorPositionChange,
  onDropFiles,
}: SplitEditorPaneProps) {
  const [dragOver, setDragOver] = useState(false);
  const showEditor = !readOnly || value;

  return (
    <section
      className={`formatter-pane formatter-editor-pane--${pane}${dragOver ? ' formatter-pane--drag' : ''}`}
      aria-label={title}
      onDragEnter={(e) => {
        if (!onDropFiles) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragOver={(e) => {
        if (!onDropFiles) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!onDropFiles) return;
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setDragOver(false);
      }}
      onDrop={(e) => {
        if (!onDropFiles) return;
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) onDropFiles(e.dataTransfer.files);
      }}
    >
      <div className="formatter-pane-head">
        <div className="formatter-pane-head-leading">
          <span className="formatter-pane-head-title">{title}</span>
          {meta && <span className="formatter-pane-head-meta">{meta}</span>}
        </div>
        <div className="formatter-pane-head-actions">{headerActions}</div>
      </div>

      <div className="formatter-pane-body">
        <div className="formatter-pane-editor">
          {showEditor ? (
            <MonacoJsonEditor
              ref={editorRef}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              editorTheme={editorTheme}
              language={language}
              lineNumbers={lineNumbers}
              wordWrap={wordWrap}
              onCursorPositionChange={onCursorPositionChange}
            />
          ) : (
            <div className="formatter-pane-empty">
              <Typography variant="small" as="p" className="formatter-pane-empty-title">
                No output yet
              </Typography>
              <Typography variant="muted" as="p">
                {emptyHint}
              </Typography>
            </div>
          )}
        </div>
        {sideActions ? (
          <aside className="formatter-pane-side-actions" aria-label={`${title} actions`}>
            {sideActions}
          </aside>
        ) : null}
      </div>
    </section>
  );
}

export function PaneIconAction({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <IconToolButton label={label} onClick={onClick} disabled={disabled} active={active} appearance="pane">
      {children}
    </IconToolButton>
  );
}
