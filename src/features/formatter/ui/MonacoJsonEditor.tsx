import { forwardRef, lazy, Suspense, useEffect, useImperativeHandle, useRef } from 'react';
import { loader } from '@monaco-editor/react';
import { Loader } from 'asriui/loader';
import type { editor as MonacoEditorType } from 'monaco-editor';
import type { EditorLanguage, EditorTheme } from '../model/types';
import { monacoOptions, monacoThemeForEditor } from '../utils/editor-theme';

const MonacoEditor = lazy(() => import('@monaco-editor/react').then((m) => ({ default: m.Editor })));

export interface MonacoJsonEditorHandle {
  focusAt: (line: number, column: number) => void;
}

interface MonacoJsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  editorTheme: EditorTheme;
  language: EditorLanguage;
  lineNumbers: boolean;
  wordWrap: boolean;
  onCursorPositionChange?: (line: number, column: number) => void;
}

/** Monaco editor with AsriUI loading state (AsriUI Monaco subpath breaks Vite production builds). */
export const MonacoJsonEditor = forwardRef<MonacoJsonEditorHandle, MonacoJsonEditorProps>(function MonacoJsonEditor(
  { value, onChange, readOnly, editorTheme, language, lineNumbers, wordWrap, onCursorPositionChange },
  ref
) {
  const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor | null>(null);
  const theme = monacoThemeForEditor(editorTheme);

  useEffect(() => {
    const editor = editorRef.current;
    const model = editor?.getModel();
    if (!model || model.getLanguageId() === language) return;
    void loader.init().then((monaco) => {
      const current = editorRef.current?.getModel();
      if (current && current.getLanguageId() !== language) {
        monaco.editor.setModelLanguage(current, language);
      }
    });
  }, [language]);

  useImperativeHandle(ref, () => ({
    focusAt(line: number, column: number) {
      const ed = editorRef.current;
      if (!ed) return;
      ed.focus();
      ed.setPosition({ lineNumber: line, column });
      ed.revealLineInCenter(line);
      ed.setSelection({
        startLineNumber: line,
        startColumn: column,
        endLineNumber: line,
        endColumn: column + 1,
      });
    },
  }));

  return (
    <div className="formatter-monaco-host">
      <Suspense fallback={<Loader variant="spinner" size="md" aria-label="Loading editor" className="formatter-monaco-loader" />}>
        <MonacoEditor
          height="100%"
          language={language}
          theme={theme}
          value={value}
          onChange={(v) => onChange?.(v ?? '')}
          onMount={(editor) => {
            editorRef.current = editor;
            const pos = editor.getPosition();
            if (pos) onCursorPositionChange?.(pos.lineNumber, pos.column);
            editor.onDidChangeCursorPosition((e) => {
              onCursorPositionChange?.(e.position.lineNumber, e.position.column);
            });
          }}
          options={{
            readOnly,
            ...monacoOptions(lineNumbers, wordWrap),
          }}
        />
      </Suspense>
    </div>
  );
});
