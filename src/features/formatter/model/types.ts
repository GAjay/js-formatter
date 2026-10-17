export type IndentSize = 2 | 4 | 'tab';
export type EditorTheme = 'atom-one-light' | 'atom-one-dark' | 'monokai' | 'github';

/** Monaco document language for syntax highlighting. JSON tools apply when `json`. */
export type EditorLanguage =
  | 'json'
  | 'javascript'
  | 'typescript'
  | 'yaml'
  | 'xml'
  | 'html'
  | 'markdown'
  | 'css'
  | 'sql'
  | 'plaintext';
export type ProcessingState =
  | 'idle'
  | 'formatting'
  | 'minifying'
  | 'validating'
  | 'repairing'
  | 'sorting'
  | 'escaping'
  | 'unescaping';

export type { Stats, ErrorPosition } from '../lib/json/types';

export interface Status {
  valid: boolean;
  message: string;
  position?: import('../lib/json/types').ErrorPosition;
}

export interface JsonTab {
  id: string;
  name: string;
  input: string;
  output: string;
  status: Status | null;
  stats: import('../lib/json/types').Stats | null;
  processing: ProcessingState;
}

export interface EditorSettings {
  indent: IndentSize;
  theme: EditorTheme;
  language: EditorLanguage;
  showLineNumbers: boolean;
  wrapText: boolean;
  sortKeysOnFormat: boolean;
}
