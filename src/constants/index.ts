import type { IndentSize, EditorTheme, UITheme } from '../types';

export const INDENT_OPTIONS: { label: string; value: IndentSize }[] = [
  { label: '2 Spaces', value: 2 },
  { label: '4 Spaces', value: 4 },
  { label: 'Tab', value: 'tab' },
];

export const THEME_OPTIONS: { label: string; value: EditorTheme }[] = [
  { label: 'Atom One Light', value: 'atom-one-light' },
  { label: 'Atom One Dark', value: 'atom-one-dark' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'GitHub', value: 'github' },
];

export const DEFAULT_INPUT = `{"id":1,"name":"Ajay","skills":["React","TypeScript","Node.js"],"active":true,"profile":{"role":"Frontend Developer","experience":6,"location":"Bangalore","links":{"github":"https://github.com/ajay","linkedin":"https://linkedin.com/in/ajay"}},"projects":[{"name":"Dashboard","status":"Completed","tech":["React","Redux"]},{"name":"E-commerce","status":"In Progress","tech":["Next.js","Tailwind"]}]}`;

export const getUITheme = (darkMode: boolean): UITheme => ({
  bg: darkMode ? '#0a0b0f' : '#f0f1f6',
  card: darkMode ? '#15171d' : '#ffffff',
  border: darkMode ? '#252830' : '#e0e3eb',
  text: darkMode ? '#e4e7ee' : '#1a1d27',
  textMuted: darkMode ? '#7a8294' : '#6b7280',
  inputBg: darkMode ? '#0f1117' : '#fafbfd',
  accent: '#4f46e5',
  accentHover: '#4338ca',
  accentLight: darkMode ? 'rgba(79,70,229,0.15)' : 'rgba(79,70,229,0.08)',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
});
