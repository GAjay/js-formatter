import type { JsonTab, Status, Stats, ProcessingState, EditorSettings, IndentSize, EditorTheme } from '../types';

export type TabAction =
  | { type: 'ADD_TAB'; name?: string; input?: string }
  | { type: 'CLOSE_TAB'; id: string }
  | { type: 'SELECT_TAB'; id: string }
  | { type: 'RENAME_TAB'; id: string; name: string }
  | { type: 'SET_INPUT'; id: string; input: string }
  | { type: 'SET_OUTPUT'; id: string; output: string; stats: Stats }
  | { type: 'SET_STATUS'; id: string; status: Status | null }
  | { type: 'SET_STATS'; id: string; stats: Stats | null }
  | { type: 'SET_PROCESSING'; id: string; processing: ProcessingState }
  | { type: 'CLEAR_TAB'; id: string }
  | { type: 'REPAIR_TAB'; id: string; input: string; output: string; stats: Stats };

export type SettingsAction =
  | { type: 'SET_INDENT'; value: IndentSize }
  | { type: 'SET_THEME'; value: EditorTheme }
  | { type: 'SET_LINE_NUMBERS'; value: boolean }
  | { type: 'SET_WRAP_TEXT'; value: boolean };

let tabCounter = 0;

export function createTab(name?: string, input?: string): JsonTab {
  tabCounter++;
  return {
    id: `tab-${Date.now()}-${tabCounter}`,
    name: name || `Tab ${tabCounter}`,
    input: input ?? '',
    output: '',
    status: null,
    stats: null,
    processing: 'idle',
  };
}

export function tabReducer(state: JsonTab[], action: TabAction): JsonTab[] {
  switch (action.type) {
    case 'ADD_TAB': {
      const newTab = createTab(action.name, action.input);
      return [...state, newTab];
    }
    case 'CLOSE_TAB': {
      const filtered = state.filter((t) => t.id !== action.id);
      return filtered.length === 0 ? [createTab()] : filtered;
    }
    case 'SELECT_TAB':
      return state;
    case 'RENAME_TAB':
      return state.map((t) => (t.id === action.id ? { ...t, name: action.name } : t));
    case 'SET_INPUT':
      return state.map((t) => (t.id === action.id ? { ...t, input: action.input } : t));
    case 'SET_OUTPUT':
      return state.map((t) =>
        t.id === action.id ? { ...t, output: action.output, stats: action.stats } : t
      );
    case 'SET_STATUS':
      return state.map((t) => (t.id === action.id ? { ...t, status: action.status } : t));
    case 'SET_STATS':
      return state.map((t) => (t.id === action.id ? { ...t, stats: action.stats } : t));
    case 'SET_PROCESSING':
      return state.map((t) =>
        t.id === action.id ? { ...t, processing: action.processing } : t
      );
    case 'CLEAR_TAB':
      return state.map((t) =>
        t.id === action.id
          ? { ...t, input: '', output: '', status: null, stats: null }
          : t
      );
    case 'REPAIR_TAB':
      return state.map((t) =>
        t.id === action.id
          ? { ...t, input: action.input, output: action.output, stats: action.stats }
          : t
      );
    default:
      return state;
  }
}

export const defaultSettings: EditorSettings = {
  indent: 2,
  theme: 'atom-one-light',
  showLineNumbers: true,
  wrapText: true,
};

export function settingsReducer(state: EditorSettings, action: SettingsAction): EditorSettings {
  switch (action.type) {
    case 'SET_INDENT':
      return { ...state, indent: action.value };
    case 'SET_THEME':
      return { ...state, theme: action.value };
    case 'SET_LINE_NUMBERS':
      return { ...state, showLineNumbers: action.value };
    case 'SET_WRAP_TEXT':
      return { ...state, wrapText: action.value };
    default:
      return state;
  }
}
