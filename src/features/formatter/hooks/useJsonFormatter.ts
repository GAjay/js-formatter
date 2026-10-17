import { useReducer, useCallback, useState, useEffect, useRef } from 'react';
import { toast } from '@/shared/asriui';
import { useJsonWorker } from './useJsonWorker';
import {
  tabReducer,
  settingsReducer,
  defaultSettings,
  createTab,
} from '../model/reducer';
import { DEFAULT_INPUT, SAMPLE_JSON } from '../constants';
import type { EditorLanguage, IndentSize, EditorTheme, ProcessingState } from '../model/types';
import { isJsonEditorLanguage } from '../utils/editor-language';
import type { WorkerResponse } from '../worker/json.worker';

const INVALID_TOAST_COOLDOWN_MS = 3500;
const INVALID_TOAST_DURATION_MS = 2600;

function isOkWithResult(res: WorkerResponse): res is Extract<WorkerResponse, { ok: true; result: string }> {
  return res.ok && 'result' in res && typeof res.result === 'string';
}

function isOkValidate(res: WorkerResponse): res is Extract<WorkerResponse, { ok: true; type: 'validate' }> {
  return res.ok && res.type === 'validate';
}

function truncateToastMessage(message: string, max = 72): string {
  const trimmed = message.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function useJsonFormatter() {
  const { ready, format, minify, validate, repair, sortKeys, escape, unescape } = useJsonWorker();

  const [tabs, dispatch] = useReducer(tabReducer, [createTab('Tab 1', DEFAULT_INPUT)]);
  const [settings, dispatchSettings] = useReducer(settingsReducer, defaultSettings);
  const [activeTabId, setActiveTabId] = useState(() => tabs[0].id);
  const [copied, setCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);

  const invalidToastRef = useRef({ key: '', at: 0 });

  const notifyInvalidJson = useCallback((message: string) => {
    const key = message.trim();
    const now = Date.now();
    const { key: lastKey, at: lastAt } = invalidToastRef.current;
    if (key === lastKey && now - lastAt < INVALID_TOAST_COOLDOWN_MS) return;
    invalidToastRef.current = { key, at: now };

    toast.error('Invalid JSON', {
      description: truncateToastMessage(key) || 'Check syntax and try again.',
      duration: INVALID_TOAST_DURATION_MS,
      showProgress: false,
    });
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const applyWorkerError = useCallback(
    (res: Extract<WorkerResponse, { ok: false }>) => {
      dispatch({
        type: 'SET_STATUS',
        id: activeTabId,
        status: { valid: false, message: res.error, position: res.position },
      });
      notifyInvalidJson(res.error);
    },
    [activeTabId, notifyInvalidJson]
  );

  const runOperation = useCallback(
    async (
      processing: ProcessingState,
      runner: () => Promise<WorkerResponse>,
      options?: { writeOutput?: boolean; writeInput?: boolean }
    ) => {
      dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing });
      const res = await runner();
      if (isOkWithResult(res)) {
        if (options?.writeInput) {
          dispatch({
            type: 'REPAIR_TAB',
            id: activeTabId,
            input: res.result,
            output: res.result,
            stats: res.stats,
          });
        } else if (options?.writeOutput !== false) {
          dispatch({ type: 'SET_OUTPUT', id: activeTabId, output: res.result, stats: res.stats });
        }
        dispatch({
          type: 'SET_STATUS',
          id: activeTabId,
          status: { valid: true, message: '' },
        });
      } else if (isOkValidate(res)) {
        dispatch({ type: 'SET_STATS', id: activeTabId, stats: res.stats });
        dispatch({
          type: 'SET_STATUS',
          id: activeTabId,
          status: { valid: true, message: '' },
        });
      } else if (!res.ok) {
        applyWorkerError(res);
      }
      dispatch({ type: 'SET_PROCESSING', id: activeTabId, processing: 'idle' });
    },
    [activeTabId, applyWorkerError]
  );

  const handleFormat = useCallback(
    () => runOperation('formatting', () => format(activeTab.input, settings.indent, settings.sortKeysOnFormat)),
    [runOperation, format, activeTab.input, settings.indent, settings.sortKeysOnFormat]
  );

  const handleMinify = useCallback(
    () => runOperation('minifying', () => minify(activeTab.input)),
    [runOperation, minify, activeTab.input]
  );

  const handleValidate = useCallback(
    () => runOperation('validating', () => validate(activeTab.input), { writeOutput: false }),
    [runOperation, validate, activeTab.input]
  );

  const handleRepair = useCallback(
    () =>
      runOperation('repairing', () => repair(activeTab.input, settings.indent), { writeInput: true }),
    [runOperation, repair, activeTab.input, settings.indent]
  );

  const handleSortKeys = useCallback(
    () => runOperation('sorting', () => sortKeys(activeTab.input, settings.indent)),
    [runOperation, sortKeys, activeTab.input, settings.indent]
  );

  const handleEscape = useCallback(
    () => runOperation('escaping', () => escape(activeTab.input)),
    [runOperation, escape, activeTab.input]
  );

  const handleUnescape = useCallback(
    () => runOperation('unescaping', () => unescape(activeTab.input)),
    [runOperation, unescape, activeTab.input]
  );

  const handleCopyInput = useCallback(() => {
    navigator.clipboard.writeText(activeTab.input).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [activeTab.input]);

  const handleCopyOutput = useCallback(() => {
    navigator.clipboard.writeText(activeTab.output).then(() => {
      setOutputCopied(true);
      setTimeout(() => setOutputCopied(false), 2000);
    });
  }, [activeTab.output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([activeTab.output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab.name || 'formatted'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeTab.output, activeTab.name]);

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR_TAB', id: activeTabId });
    invalidToastRef.current = { key: '', at: 0 };
  }, [activeTabId]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      dispatch({ type: 'SET_INPUT', id: activeTabId, input: text });
    } catch {
      toast.error('Clipboard blocked', {
        description: 'Paste into the editor with ⌘V / Ctrl+V.',
        duration: 2600,
        showProgress: false,
      });
    }
  }, [activeTabId]);

  const handleSample = useCallback(() => {
    const text = JSON.stringify(SAMPLE_JSON, null, 2);
    dispatch({ type: 'SET_INPUT', id: activeTabId, input: text });
  }, [activeTabId]);

  const handleUseOutputAsInput = useCallback(() => {
    if (!activeTab.output.trim()) return;
    dispatch({ type: 'SET_INPUT', id: activeTabId, input: activeTab.output });
    dispatch({ type: 'SET_OUTPUT', id: activeTabId, output: '', stats: null });
  }, [activeTab.output, activeTabId]);

  const handleOpenFiles = useCallback(
    (files: FileList) => {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === 'string') {
          dispatch({ type: 'SET_INPUT', id: activeTabId, input: text });
        }
      };
      reader.readAsText(file);
    },
    [activeTabId]
  );

  const handleAddTab = useCallback(() => {
    const tabNum = tabs.length + 1;
    const tab = createTab(`Tab ${tabNum}`);
    dispatch({ type: 'ADD_TAB', tab });
    setActiveTabId(tab.id);
  }, [tabs.length]);

  const handleCloseTab = useCallback(
    (id: string) => {
      if (id === activeTabId) {
        const idx = tabs.findIndex((t) => t.id === id);
        const remaining = tabs.filter((t) => t.id !== id);
        const newActive = remaining[Math.max(0, idx - 1)];
        if (newActive) setActiveTabId(newActive.id);
      }
      dispatch({ type: 'CLOSE_TAB', id });
    },
    [activeTabId, tabs]
  );

  useEffect(() => {
    if (!isJsonEditorLanguage(settings.language)) {
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: null });
      dispatch({ type: 'SET_STATS', id: activeTabId, stats: null });
      invalidToastRef.current = { key: '', at: 0 };
      return;
    }
    if (!activeTab.input.trim()) {
      dispatch({ type: 'SET_STATUS', id: activeTabId, status: null });
      dispatch({ type: 'SET_STATS', id: activeTabId, stats: null });
      invalidToastRef.current = { key: '', at: 0 };
      return;
    }
    const timer = setTimeout(async () => {
      const res = await validate(activeTab.input);
      if (isOkValidate(res)) {
        dispatch({ type: 'SET_STATS', id: activeTabId, stats: res.stats });
        dispatch({
          type: 'SET_STATUS',
          id: activeTabId,
          status: { valid: true, message: '' },
        });
        invalidToastRef.current = { key: '', at: 0 };
      } else if (!res.ok) {
        dispatch({
          type: 'SET_STATUS',
          id: activeTabId,
          status: { valid: false, message: res.error, position: res.position },
        });
        notifyInvalidJson(res.error);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab.input, activeTabId, settings.language, validate, notifyInvalidJson]);

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    settings,
    dispatch,
    dispatchSettings,
    ready,
    copied,
    outputCopied,
    handleFormat,
    handleMinify,
    handleValidate,
    handleRepair,
    handleSortKeys,
    handleEscape,
    handleUnescape,
    handleCopyInput,
    handleCopyOutput,
    handleDownload,
    handleClear,
    handlePaste,
    handleSample,
    handleUseOutputAsInput,
    handleOpenFiles,
    handleAddTab,
    handleCloseTab,
    setIndent: (v: IndentSize) => dispatchSettings({ type: 'SET_INDENT', value: v }),
    setTheme: (v: EditorTheme) => dispatchSettings({ type: 'SET_THEME', value: v }),
    setLanguage: (v: EditorLanguage) => dispatchSettings({ type: 'SET_LANGUAGE', value: v }),
    setLineNumbers: (v: boolean) => dispatchSettings({ type: 'SET_LINE_NUMBERS', value: v }),
    setWrapText: (v: boolean) => dispatchSettings({ type: 'SET_WRAP_TEXT', value: v }),
    setSortKeysOnFormat: (v: boolean) => dispatchSettings({ type: 'SET_SORT_KEYS', value: v }),
  };
}
