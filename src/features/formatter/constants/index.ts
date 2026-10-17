import type { EditorLanguage, IndentSize, EditorTheme } from '../model/types';

export const INDENT_OPTIONS: { label: string; value: IndentSize }[] = [
  { label: '2 Spaces', value: 2 },
  { label: '4 Spaces', value: 4 },
  { label: 'Tab', value: 'tab' },
];

export const LANGUAGE_OPTIONS: { label: string; value: EditorLanguage }[] = [
  { label: 'JSON', value: 'json' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'YAML', value: 'yaml' },
  { label: 'XML', value: 'xml' },
  { label: 'HTML', value: 'html' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'CSS', value: 'css' },
  { label: 'SQL', value: 'sql' },
  { label: 'Plain text', value: 'plaintext' },
];

export const THEME_OPTIONS: { label: string; value: EditorTheme }[] = [
  { label: 'Atom One Light', value: 'atom-one-light' },
  { label: 'Atom One Dark', value: 'atom-one-dark' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'GitHub', value: 'github' },
];

export const DEFAULT_INPUT = `{"id":1,"name":"Ajay","skills":["React","TypeScript","Node.js"],"active":true,"profile":{"role":"Frontend Developer","experience":6,"location":"Bangalore","links":{"github":"https://github.com/ajay","linkedin":"https://linkedin.com/in/ajay"}},"projects":[{"name":"Dashboard","status":"Completed","tech":["React","Redux"]},{"name":"E-commerce","status":"In Progress","tech":["Next.js","Tailwind"]}]}`;

export const SAMPLE_JSON = {
  name: 'JSON Formatter',
  version: 1,
  active: true,
  tags: ['format', 'validate', 'repair'],
  owner: { name: 'Ajay', city: 'Bangalore' },
  items: [
    { id: 1, title: 'Alpha', price: 9.5 },
    { id: 2, title: 'Beta', price: 12 },
  ],
  notes: null,
} as const;
