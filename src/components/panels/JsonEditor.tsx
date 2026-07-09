import { lazy, Suspense, useRef, useEffect } from 'react';
import type { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { EditorTheme } from '../../types';

const MonacoEditor = lazy(() => import('@monaco-editor/react').then((m) => ({ default: m.Editor })));

const THEME_MAP: Record<EditorTheme, string> = {
  'atom-one-light': 'atom-one-light',
  'atom-one-dark': 'atom-one-dark',
  monokai: 'monokai',
  github: 'github',
};

interface EditorProps {
  value: string;
  onChange?: OnChange;
  readOnly?: boolean;
  theme: EditorTheme;
  wordWrap: boolean;
  lineNumbers: boolean;
  onMount?: OnMount;
  height?: string;
}

function EditorSkeleton({ height }: { height: string }) {
  return (
    <div
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        color: '#8892a4',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e4e7f0',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Loading editor...</span>
    </div>
  );
}

export default function JsonEditor({
  value,
  onChange,
  readOnly = false,
  theme,
  wordWrap,
  lineNumbers,
  onMount,
  height = '100%',
}: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme('atom-one-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'string', foreground: '50a14f' },
        { token: 'number', foreground: '986801' },
        { token: 'keyword', foreground: '0184bb' },
        { token: 'string.key.json', foreground: 'e45649' },
      ],
      colors: {
        'editor.background': '#fafafa',
        'editorLineNumber.foreground': '#9d9d9f',
        'editorLineNumber.activeForeground': '#383a42',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editorCursor.foreground': '#383a42',
      },
    });

    monaco.editor.defineTheme('atom-one-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'keyword', foreground: '56b6c2' },
        { token: 'string.key.json', foreground: 'e06c75' },
      ],
      colors: {
        'editor.background': '#282c34',
        'editorLineNumber.foreground': '#636d83',
        'editorLineNumber.activeForeground': '#abb2bf',
        'editor.lineHighlightBackground': '#2c313c',
        'editorCursor.foreground': '#abb2bf',
      },
    });

    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'string', foreground: 'a6e22e' },
        { token: 'number', foreground: 'ae81ff' },
        { token: 'keyword', foreground: '66d9e8' },
        { token: 'string.key.json', foreground: 'f92672' },
      ],
      colors: {
        'editor.background': '#272822',
        'editorLineNumber.foreground': '#75715e',
        'editorLineNumber.activeForeground': '#f8f8f2',
        'editor.lineHighlightBackground': '#3e3d32',
        'editorCursor.foreground': '#f8f8f2',
      },
    });

    monaco.editor.defineTheme('github', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'string', foreground: '032f62' },
        { token: 'number', foreground: '005cc5' },
        { token: 'keyword', foreground: '005cc5' },
        { token: 'string.key.json', foreground: 'd73a49' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editorLineNumber.foreground': '#babbbd',
        'editorLineNumber.activeForeground': '#24292e',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editorCursor.foreground': '#24292e',
      },
    });

    monaco.editor.setTheme(THEME_MAP[theme]);
    onMount?.(editor, monaco);
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = (window as any).monaco;
    if (editor && monaco) monaco.editor.setTheme(THEME_MAP[theme]);
  }, [theme]);

  return (
    <Suspense fallback={<EditorSkeleton height={height} />}>
      <MonacoEditor
        value={value}
        onChange={onChange}
        onMount={handleMount}
        language="json"
        theme={THEME_MAP[theme]}
        height={height}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: lineNumbers ? 'on' : 'off',
          wordWrap: wordWrap ? 'on' : 'off',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderLineHighlight: 'all',
          roundedSelection: true,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 12, bottom: 12 },
          scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
          overviewRulerLanes: 0,
          guides: { indentation: false, bracketPairs: false },
        }}
      />
    </Suspense>
  );
}
