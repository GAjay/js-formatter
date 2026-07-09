export type IndentSize = 2 | 4 | 'tab';
export type EditorTheme = 'atom-one-light' | 'atom-one-dark' | 'monokai' | 'github';
export type ProcessingState = 'idle' | 'formatting' | 'minifying' | 'validating' | 'repairing';

export interface Stats {
  lines: number;
  chars: number;
  keys: number;
  elements: number;
  size: string;
}

export interface ErrorPosition {
  line: number;
  column: number;
}

export interface Status {
  valid: boolean;
  message: string;
  position?: ErrorPosition;
}

export interface JsonTab {
  id: string;
  name: string;
  input: string;
  output: string;
  status: Status | null;
  stats: Stats | null;
  processing: ProcessingState;
}

export interface EditorSettings {
  indent: IndentSize;
  theme: EditorTheme;
  showLineNumbers: boolean;
  wrapText: boolean;
}

export interface UITheme {
  bg: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  inputBg: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  success: string;
  error: string;
  warning: string;
}
