import type { EditorTheme } from '../model/types';

export function monacoThemeForEditor(theme: EditorTheme): 'light' | 'vs-dark' {
  return theme === 'atom-one-light' || theme === 'github' ? 'light' : 'vs-dark';
}

export function monacoOptions(lineNumbers: boolean, wordWrap: boolean): Record<string, unknown> {
  return {
    lineNumbers: lineNumbers ? 'on' : 'off',
    wordWrap: wordWrap ? 'on' : 'off',
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: 14,
    lineHeight: 22,
    tabSize: 2,
    padding: { top: 8, bottom: 8 },
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10, useShadows: false },
    automaticLayout: true,
    overviewRulerLanes: 0,
    guides: { indentation: true, bracketPairs: true },
    renderLineHighlight: 'line',
    smoothScrolling: true,
  };
}
